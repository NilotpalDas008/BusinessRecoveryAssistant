import * as React from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

export interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverEffect?: boolean;
  glow?: boolean;
}

export function GlassCard({
  className,
  hoverEffect = true,
  glow = false,
  children,
  ...props
}: GlassCardProps) {
  return (
    <div
      className={cn(
        "relative rounded-2xl border border-white/10 bg-[#121216]/70 backdrop-blur-xl p-6 transition-all duration-300",
        hoverEffect && "glass-panel-hover",
        glow && "before:absolute before:-inset-px before:rounded-2xl before:bg-gradient-to-r before:from-purple-500/20 before:to-blue-500/20 before:opacity-0 hover:before:opacity-100 before:transition-opacity before:-z-10",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
