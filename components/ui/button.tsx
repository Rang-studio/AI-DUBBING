import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition-all duration-200 outline-none",
          "disabled:cursor-not-allowed disabled:opacity-60",
          variant === "primary" &&
            "bg-blueDeep text-white shadow-soft hover:-translate-y-0.5 hover:shadow-card active:translate-y-0",
          variant === "secondary" &&
            "bg-white text-ink border border-slate-200 shadow-soft hover:bg-slate-50",
          variant === "ghost" && "bg-transparent text-ink hover:bg-white/60",
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

export { Button };
