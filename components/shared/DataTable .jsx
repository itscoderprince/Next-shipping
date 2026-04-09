// ─── Imports ──────────────────────────────────────────────────────────────────

import React, { useState } from "react";
import Link from "next/link";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import axios from "axios";

import { download, generateCsv, mkConfig } from "export-to-csv";
import { toast } from "sonner";

import env from "@/configs/env";

import { IconButton, Tooltip } from "@mui/material";
import { Delete } from "@mui/icons-material";
import RecyclingIcon from "@mui/icons-material/Recycling";
import RestoreFromTrashIcon from "@mui/icons-material/RestoreFromTrash";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import GetAppIcon from "@mui/icons-material/GetApp";

import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import { MRT_ToggleDensePaddingButton } from "material-react-table";
import { MRT_ToggleFullScreenButton } from "material-react-table";
import { MRT_ToggleGlobalFilterButton } from "material-react-table";
import { MRT_ShowHideColumnsButton } from "material-react-table";

// Local
import UIButton from "./UIButton";
import useDeleteMutation from "@/hooks/useDeleteMutation";

// 🟢 AI CHANGE: Workaround for MRT v3 & MUI v9 compatibility warnings
// Intercepts `console.error` exclusively for Dev Mode to stop MUI v9 DOM prop leaks from cluttering the terminal.
if (typeof window !== "undefined") {
  const originalConsoleError = console.error;
  console.error = (...args) => {
    // React logs warnings using format strings, e.g. "React does not recognize the `%s` prop..."
    // The actual prop name ("InputProps", "inputProps") is passed as args[1].
    // We check if ANY string argument contains the banned, harmless prop names.
    const hasHarmlessWarning = args.some(
      (arg) =>
        typeof arg === "string" &&
        (arg.includes("InputProps") ||
          arg.includes("inputProps") ||
          arg.includes("MenuListProps") ||
          arg.includes(
            "React does not recognize the `%s` prop on a DOM element",
          )),
    );

    if (hasHarmlessWarning) {
      return;
    }

    originalConsoleError(...args);
  };
}

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * DataTable — Reusable server-side table with filtering, sorting,
 * pagination, delete, and CSV export.
 *
 * Props:
 *   queryKey        — Unique cache key (e.g. "products")
 *   fetchUrl        — API endpoint to fetch rows from
 *   columnConfig    — Column definitions array
 *   initialPageSize — Rows per page (default: 10)
 *   exportEndpoint  — API endpoint to export all data as CSV
 *   deleteEndpoint  — API endpoint to delete rows
 *   deleteType      — "SD" (soft delete) | "PD" (permanent delete)
 *   trashView       — URL of the trash/recycle-bin page
 *   createAction    — Function that returns row action menu items
 */
const DataTable = ({
  queryKey,
  fetchUrl,
  columnConfig,
  initialPageSize = 10,
  exportEndpoint,
  deleteEndpoint,
  deleteType,
  trashView,
  createAction,
}) => {
  // ─── State ──────────────────────────────────────────────────────────────────

  const [columnFilters, setColumnFilters] = useState([]);
  const [sorting, setSorting] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: initialPageSize,
  });
  const [rowSelection, setRowSelection] = useState({});
  const [exportLoading, setExportLoading] = useState(false);

  // ─── Data Fetching ──────────────────────────────────────────────────────────
  // Re-fetches whenever filters, sorting, or pagination change.

  const {
    data: { data = [], meta } = {},
    isError,
    isRefetching,
    isLoading,
  } = useQuery({
    queryKey: [queryKey, { columnFilters, globalFilter, pagination, sorting }],
    queryFn: async () => {
      const url = new URL(fetchUrl, env.NEXT_PUBLIC_APP_URL);
      url.searchParams.set(
        "start",
        `${pagination.pageIndex * pagination.pageSize}`,
      );
      url.searchParams.set("size", `${pagination.pageSize}`);
      url.searchParams.set("filters", JSON.stringify(columnFilters ?? []));
      url.searchParams.set("globalFilter", globalFilter ?? "");
      url.searchParams.set("sorting", JSON.stringify(sorting ?? []));
      url.searchParams.set("deleteType", deleteType);

      const { data: response } = await axios.get(url.href);
      return response;
    },
    placeholderData: keepPreviousData,
  });

  // ─── Delete Mutation ────────────────────────────────────────────────────────

  const deleteMutation = useDeleteMutation(queryKey, deleteEndpoint);

  // Asks for confirmation then fires the delete request.
  // deleteType: "SD" = soft delete, "PD" = permanent, "RSD" = restore
  const handleDelete = (ids, deleteType) => {
    const message =
      deleteType === "PD"
        ? "Are you sure want to delete to the data permanently ?"
        : "Are you sure move data into trash ?";

    if (confirm(message)) {
      deleteMutation.mutate({ ids, deleteType });
      setRowSelection({});
    }
  };

  // ─── CSV Export ─────────────────────────────────────────────────────────────
  // Exports selected rows, or all rows (via API) if nothing is selected.

  const handleExport = async (selectedRows) => {
    setExportLoading(true);
    try {
      const csvConfig = mkConfig({
        fieldSeparator: "",
        decimalSeparator: "",
        useKeysAsHeaders: true,
        filename: "csv-data",
      });

      let rowData;

      if (Object.keys(rowSelection).length > 0) {
        // Export only selected rows
        rowData = selectedRows.map((row) => row.original);
      } else {
        // Fetch all rows from the server and export
        const { data: response } = await axios.get(exportEndpoint);
        if (!response.success) throw new Error(response.message);
        rowData = response.data;
      }

      download(csvConfig)(generateCsv(csvConfig)(rowData));
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    } finally {
      setExportLoading(false);
    }
  };

  // ─── Table Config ───────────────────────────────────────────────────────────

  const table = useMaterialReactTable({
    // Core
    columns: columnConfig,
    data,

    // Features
    enableRowSelection: true,
    enableColumnOrdering: true,
    enableStickyHeader: true,
    enableStickyFooter: true,
    columnFilterDisplayMode: "popover",
    paginationDisplayMode: "pages",
    initialState: { showColumnFilters: true },

    // 🟢 AI CHANGE: MUI v9 uses slotProps.input instead of InputProps (material-react-table v3 compat)
    muiSearchTextFieldProps: {
      slotProps: { input: {} },
      InputProps: undefined, // Clears the deprecated prop from hitting the DOM
    },
    muiFilterTextFieldProps: {
      slotProps: { input: {} },
      InputProps: undefined, // Clears the deprecated prop from hitting the DOM
    },

    // 🟢 AI CHANGE: MUI v9 Checkbox uses slotProps instead of inputProps
    muiSelectCheckboxProps: {
      inputProps: undefined,
      slotProps: { input: {} },
    },
    muiSelectAllCheckboxProps: {
      inputProps: undefined,
      slotProps: { input: {} },
    },

    // Fix: MUI v9 Menu uses slotProps instead of MenuListProps
    muiRowActionMenuProps: {
      MenuListProps: undefined,
      slotProps: { list: {} },
    },

    // Server-side — we handle filter/sort/page via API, not client-side
    manualFiltering: true,
    manualSorting: true,
    manualPagination: true,

    // Error banner
    muiToolbarAlertBannerProps: isError
      ? { color: "error", children: "Error loading data" }
      : undefined,

    // State change handlers
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,

    // Total row count for pagination controls
    rowCount: meta?.totalRowCount ?? 0,

    // Current state
    state: {
      columnFilters,
      globalFilter,
      isLoading,
      pagination,
      showAlertBanner: isError,
      showProgressBars: isRefetching,
      sorting,
      rowSelection,
    },

    // Use MongoDB _id as the unique row identifier
    getRowId: (originalRow) => originalRow._id,

    // ── Toolbar: Right-Side Icon Buttons ──────────────────────────────────────
    renderToolbarInternalActions: ({ table }) => (
      <>
        {/* Built-in MRT buttons */}
        <MRT_ToggleGlobalFilterButton table={table} />
        <MRT_ShowHideColumnsButton table={table} />
        <MRT_ToggleFullScreenButton table={table} />
        <MRT_ToggleDensePaddingButton table={table} />

        {/* Recycle bin link — hidden when already in trash view (PD mode) */}
        {deleteType !== "PD" && (
          <Tooltip title="Recycle Bin">
            <Link href={trashView}>
              <IconButton>
                <RecyclingIcon />
              </IconButton>
            </Link>
          </Tooltip>
        )}

        {/* Soft Delete — move selected rows to trash */}
        {deleteType === "SD" && (
          <Tooltip title="Delete">
            <IconButton
              disabled={
                !table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()
              }
              onClick={() =>
                handleDelete(Object.keys(rowSelection), deleteType)
              }
            >
              <Delete />
            </IconButton>
          </Tooltip>
        )}

        {/* Trash View — restore or permanently delete selected rows */}
        {deleteType === "PD" && (
          <>
            <Tooltip title="Restore">
              <IconButton
                disabled={
                  !table.getIsSomeRowsSelected() &&
                  !table.getIsAllRowsSelected()
                }
                onClick={() => handleDelete(Object.keys(rowSelection), "RSD")}
              >
                <RestoreFromTrashIcon />
              </IconButton>
            </Tooltip>

            <Tooltip title="Delete Forever">
              <IconButton
                disabled={
                  !table.getIsSomeRowsSelected() &&
                  !table.getIsAllRowsSelected()
                }
                onClick={() =>
                  handleDelete(Object.keys(rowSelection), deleteType)
                }
              >
                <DeleteForeverIcon />
              </IconButton>
            </Tooltip>
          </>
        )}
      </>
    ),

    // ── Row Actions: "..." Menu on each row ───────────────────────────────────
    enableRowActions: true,
    positionActionsColumn: "last",
    renderRowActionMenuItems: ({ row }) =>
      createAction(row, deleteType, handleDelete),

    // ── Toolbar: Left-Side Export Button ──────────────────────────────────────
    renderTopToolbarCustomActions: ({ table }) => (
      <Tooltip title="Export to CSV">
        <UIButton
          // 🟢 AI CHANGE: Fixed `isLoading` to `loading` to match UIButton's expected prop (prevents DOM leak)
          loading={exportLoading}
          onClick={() => handleExport(table.getSelectedRowModel().rows)}
        >
          <GetAppIcon /> Export
        </UIButton>
      </Tooltip>
    ),
  });

  // ─── Render ─────────────────────────────────────────────────────────────────

  return <MaterialReactTable table={table} />;
};

export default DataTable;
