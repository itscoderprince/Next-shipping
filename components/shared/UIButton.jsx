"use client";

import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Premium UIButton component with built-in loading states and consistent styling.
 * Supports a custom 'violet' theme as requested.
 * @param {string} className - Additional CSS classes
 * @param {boolean} loading - Displays a spinner and disables the button
 * @param {React.ReactNode} children - Button content
 * @param {string} variant - Shadcn button variants (default, outline, ghost, etc.)
 */
const UIButton = ({ 
  className, 
  loading = false, 
  children, 
  variant = "default", 
  size = "default",
  ...props 
}) => {
  return (
    <Button
      className={cn(
        "relative transition-all duration-300 font-heading font-semibold rounded-lg h-10 px-6",
        // Default Violet Theme for primary buttons
        variant === "default" && "bg-violet-600 hover:bg-violet-700 text-white shadow-sm hover:shadow-violet-200/50 hover:shadow-xl active:scale-[0.98]",
        loading && "text-transparent pointer-events-none",
        className
      )}
      variant={variant}
      size={size}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <Loader2 className="h-4 w-4 animate-spin text-white" />
        </div>
      )}
      <span className={cn("inline-flex items-center gap-2", loading ? "opacity-0" : "opacity-100")}>
        {children}
      </span>
    </Button>
  );
};

export default UIButton;