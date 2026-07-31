import * as React from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "purple" | "emerald" | "amber" | "zinc";
}

export function Badge({
  className,
  variant = "purple",
  children,
  ...props
}: BadgeProps) {
  const variantStyles = {
    purple:
      "bg-purple-500/10 text-purple-300 border-purple-500/20 shadow-[0_0_12px_rgba(168,85,247,0.15)]",
    emerald:
      "bg-emerald-500/10 text-emerald-300 border-emerald-500/20 shadow-[0_0_12px_rgba(16,185,129,0.15)]",
    amber:
      "bg-amber-500/10 text-amber-300 border-amber-500/20 shadow-[0_0_12px_rgba(245,158,11,0.15)]",
    zinc:
      "bg-zinc-800/80 text-zinc-300 border-zinc-700/60",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-full border backdrop-blur-md transition-all duration-300",
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
