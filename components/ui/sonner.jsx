"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner } from "sonner";
import {
  CheckCircle2,
  XCircle,
  Info,
  AlertTriangle,
  Loader2,
} from "lucide-react";

const Toaster = ({ ...props }) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme}
      position="top-right"
      className="toaster group"
      style={{
        "--normal-bg": "var(--background)",
        "--normal-text": "var(--foreground)",
        "--normal-border": "var(--border)",
      }}
      toastOptions={{
        classNames: {
          toast:
            "group toast bg-background text-foreground border-border border shadow-md !rounded-full px-5 py-2.5! gap-4 font-sans text-[16px] font-semibold leading-snug !w-auto",
          description: "group-[.toast]:text-muted-foreground",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
        },
      }}
      icons={{
        success: (
          <CheckCircle2
            strokeWidth={2}
            className="w-6 h-6 text-white fill-emerald-500"
          />
        ),
        error: (
          <XCircle
            strokeWidth={2}
            className="w-6 h-6 text-white fill-red-500"
          />
        ),
        info: (
          <Info strokeWidth={2} className="w-6 h-6 text-white fill-blue-500" />
        ),
        warning: (
          <AlertTriangle
            strokeWidth={2}
            className="w-6 h-6 text-white fill-amber-500"
          />
        ),
        loading: <Loader2 className="w-6 h-6 animate-spin text-zinc-500" />,
      }}
      {...props}
    />
  );
};

export { Toaster };
