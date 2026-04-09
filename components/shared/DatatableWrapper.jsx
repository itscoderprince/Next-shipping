import { ThemeProvider } from "@mui/material";
// 🟢 AI CHANGE: Swapped `@mui/material/useTheme` for `next-themes/useTheme` to successfully extract actual dark/light state (`resolvedTheme`).
import { useTheme } from "next-themes";
import React, { useState, useEffect } from "react";
import DataTable from "./DataTable ";
import { darkTheme, lightTheme } from "@/lib/materialTheme";

// Wraps DataTable with MUI ThemeProvider so the table respects the app's dark/light mode.
// Also waits for the component to mount before rendering (avoids hydration mismatch).
const DatatableWrapper = ({
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
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Only render after mount to avoid SSR/client theme mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <ThemeProvider theme={resolvedTheme === "dark" ? darkTheme : lightTheme}>
      <DataTable
        queryKey={queryKey}
        fetchUrl={fetchUrl}
        columnConfig={columnConfig}
        initialPageSize={initialPageSize}
        exportEndpoint={exportEndpoint}
        deleteEndpoint={deleteEndpoint}
        deleteType={deleteType}
        trashView={trashView}
        createAction={createAction}
      />
    </ThemeProvider>
  );
};

export default DatatableWrapper;
