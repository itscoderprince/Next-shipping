"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle({ className }) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  // Avoid hydration mismatch
  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div
        className={cn(
          "h-6 w-11 rounded-full bg-muted animate-pulse",
          className,
        )}
      />
    );
  }

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="flex items-center gap-2">
        <Switch
          id="theme-toggle"
          aria-label="Toggle theme"
          checked={theme === "dark"}
          onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
          className="transition-colors border-none"
          thumbChildren={
            <div className="relative flex items-center justify-center size-full">
              <Sun className="h-3 w-3 text-amber-500 transition-all duration-300 rotate-0 scale-100 opacity-100 dark:-rotate-90 dark:scale-0 dark:opacity-0 absolute" />
              <Moon className="h-3 w-3 text-slate-100 dark:text-slate-900 transition-all duration-300 rotate-90 scale-0 opacity-0 dark:rotate-0 dark:scale-100 dark:opacity-100 absolute" />
            </div>
          }
        />
      </div>
    </div>
  );
}
