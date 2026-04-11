import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors",
  {
    variants: {
      variant: {
        default: "border-blue-200 bg-blue-100 text-blue-800",
        secondary: "border-orange-200 bg-orange-100 text-orange-800",
        destructive: "border-red-200 bg-red-100 text-red-800",
        success: "border-green-200 bg-green-100 text-green-800",
        warning: "border-yellow-200 bg-yellow-100 text-yellow-800",
        info: "border-cyan-200 bg-cyan-100 text-cyan-800",
        outline: "border-slate-300 bg-white text-slate-700",
        ghost: "border-transparent bg-slate-100 text-slate-700",
        purple: "border-purple-200 bg-purple-100 text-purple-800",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
