import * as React from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "gradient" | "outline" | "ghost" | "secondary";
  size?: "sm" | "md" | "lg";
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "gradient", size = "md", children, ...props }, ref) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium rounded-xl transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/50 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]";

    const sizeStyles = {
      sm: "px-4 py-2 text-xs gap-1.5",
      md: "px-5 py-2.5 text-sm gap-2",
      lg: "px-7 py-3.5 text-base gap-2.5 font-semibold",
    };

    const variantStyles = {
      gradient:
        "btn-gradient text-white shadow-lg shadow-purple-900/20 hover:shadow-purple-700/40 border border-purple-400/20",
      outline:
        "border border-white/15 bg-white/[0.03] text-zinc-200 hover:bg-white/[0.08] hover:border-white/25 hover:text-white backdrop-blur-sm",
      ghost:
        "text-zinc-300 hover:text-white hover:bg-white/[0.06]",
      secondary:
        "bg-zinc-800/80 text-zinc-100 border border-zinc-700/50 hover:bg-zinc-700/80 hover:border-zinc-600",
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, sizeStyles[size], variantStyles[variant], className)}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
