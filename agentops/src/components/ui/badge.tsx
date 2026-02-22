"use client";

import * as React from "react";

import { cn } from "@/lib/cn";

export type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & {
  variant?: "default" | "success" | "warning";
};

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium",
        variant === "default" && "border-zinc-200 bg-zinc-50 text-zinc-800",
        variant === "success" && "border-emerald-200 bg-emerald-50 text-emerald-800",
        variant === "warning" && "border-amber-200 bg-amber-50 text-amber-900",
        className,
      )}
      {...props}
    />
  );
}

