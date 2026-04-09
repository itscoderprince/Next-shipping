"use client";

import * as React from "react";
import { Switch as SwitchPrimitive } from "radix-ui";

import { cn } from "@/lib/utils";

function Switch({
  className,
  size = "default",
  children,
  thumbChildren,
  ...props
}) {
  return (
    <>
      <SwitchPrimitive.Root
        data-slot="switch"
        data-state={props.checked ? "checked" : "unchecked"}
        data-size={size}
        className={cn(
          "peer group/switch relative inline-flex shrink-0 items-center rounded-full border border-transparent shadow-xs transition-all outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 data-[size=default]:h-6 data-[size=default]:w-11 data-[size=sm]:h-5 data-[size=sm]:w-9 data-[state=checked]:bg-primary data-[state=unchecked]:bg-zinc-300 dark:data-[state=unchecked]:bg-zinc-700 data-disabled:cursor-not-allowed data-disabled:opacity-50",
          className,
        )}
        {...props}
      >
        {children}
        <SwitchPrimitive.Thumb
          data-slot="switch-thumb"
          className="pointer-events-none flex items-center justify-center rounded-full bg-white shadow-lg ring-0 transition-all duration-300 group-data-[size=default]/switch:size-5 group-data-[size=sm]/switch:size-4 group-data-[size=default]/switch:data-checked:translate-x-5 group-data-[size=default]/switch:data-unchecked:translate-x-0.5 group-data-[size=sm]/switch:data-checked:translate-x-4 group-data-[size=sm]/switch:data-unchecked:translate-x-0.5"
        >
          {thumbChildren}
        </SwitchPrimitive.Thumb>
      </SwitchPrimitive.Root>
    </>
  );
}

export { Switch };
