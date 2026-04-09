"use client";

import React, { useMemo, useCallback, Suspense } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import DatatableWrapper from "@/components/shared/DatatableWrapper";
import { DeleteAction } from "@/components/shared/ActionsButtons";
import { ADMIN_ROUTES } from "@/routes/Admin.route";
import { columnConfig } from "@/lib/helper";
import { DT_CATEGORY_COLUMN } from "@/lib/column";
import env from "@/configs/env";
import UIButton from "@/components/shared/UIButton";
import Link from "next/link";
import { Trash2, ArrowLeft } from "lucide-react";
import { useSearchParams } from "next/navigation";

// Centralized config mapping
const TRASH_CONFIG = {
  category: {
    title: "Category Trash",
    columns: DT_CATEGORY_COLUMN,
    fetchUrl: "/api/category",
    exportUrl: "/api/category/export",
    deleteUrl: "/api/category/delete",
    backUrl: ADMIN_ROUTES.CATEGORIES,
    backTitle: "Go to Categories",
  },
  // Add more modules here in the future
};

// Extracted inner component so we can cleanly wrap it in <Suspense>
const TrashContent = () => {
  const searchParams = useSearchParams();
  const trashOf = searchParams.get("trashof") || "category"; // 🟢 AI CHANGE: Added fallback to prevent runtime crash

  const config = TRASH_CONFIG[trashOf] || TRASH_CONFIG.category;

  // 1. Column configuration for categories
  const columns = useMemo(
    () => columnConfig(config.columns, false, false, true),
    [config.columns], // 🟢 AI CHANGE: Added dependency to update columns if config changes
  );

  // 2. Action Menu for Trash
  const action = useCallback((row, deleteType, handleDelete) => {
    let actionMenu = [];
    actionMenu.push(
      <DeleteAction
        handleDelete={handleDelete}
        row={row}
        deleteType={deleteType}
        key="delete"
      />,
    );
    return actionMenu;
  }, []);

  return (
    <Card className="sm:py-4 py-2 gap-3 sm:gap-2">
      <CardHeader className="w-full border-b [.border-b]:pb-3">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-red-50 dark:bg-red-950/30 rounded-xl">
              <Trash2 className="size-6 text-red-600" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-red-600 flex items-center gap-2">
                {config.title}
                <span className="text-xs font-normal italic text-gray-400 font-sans ml-1">
                  (Permanent Deletion Area)
                </span>
              </h1>
              <p className="text-sm text-gray-500">
                Manage soft-deleted items: restore or remove them permanently.
              </p>
            </div>
          </div>
          <Link href={config.backUrl}>
            <UIButton className="gap-2 group" variant="outline">
              <ArrowLeft className="size-4 group-hover:-translate-x-1 transition-transform" />
              {config.backTitle}
            </UIButton>
          </Link>
        </div>
      </CardHeader>

      <CardContent>
        <DatatableWrapper
          key={trashOf} // 🟢 AI CHANGE: Forces table re-mount if category type changes
          queryKey={`${trashOf}-data-deleted`}
          fetchUrl={`${env.NEXT_PUBLIC_APP_URL}${config.fetchUrl}`}
          columnConfig={columns}
          deleteEndpoint={`${env.NEXT_PUBLIC_APP_URL}${config.deleteUrl}`}
          deleteType="PD"
          trashView={true}
          createAction={action}
        />
      </CardContent>
    </Card>
  );
};

const TrashPage = () => {
  return (
    <Suspense fallback={<div>Loading Trash...</div>}>
      <TrashContent />
    </Suspense>
  );
};

export default TrashPage;
