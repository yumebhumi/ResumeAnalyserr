"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-2xl text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-[linear-gradient(135deg,#06B6D4,#22D3EE,#E5E7EB)] px-5 py-3 text-slate-950 shadow-[0_14px_40px_rgba(34,211,238,0.28)] hover:-translate-y-0.5 hover:shadow-[0_18px_48px_rgba(34,211,238,0.34)]",
        secondary:
          "border border-white/12 bg-white/6 px-5 py-3 text-slate-100 hover:border-cyan-300/35 hover:bg-white/10",
        ghost:
          "px-4 py-2.5 text-slate-300 hover:bg-white/8 hover:text-slate-50",
      },
      size: {
        default: "",
        sm: "px-4 py-2 text-sm",
        lg: "px-6 py-3.5 text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
