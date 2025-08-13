import { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Badge = forwardRef(({ className, variant = "default", ...props }, ref) => {
  const variants = {
    default: "bg-gray-100 text-gray-800 border border-gray-200",
    primary: "bg-gradient-to-r from-primary/10 to-secondary/10 text-primary border border-primary/20",
    success: "bg-gradient-to-r from-success/10 to-emerald-100 text-success border border-success/20",
    warning: "bg-gradient-to-r from-warning/10 to-amber-100 text-warning border border-warning/20",
    error: "bg-gradient-to-r from-error/10 to-red-100 text-error border border-error/20",
    info: "bg-gradient-to-r from-info/10 to-blue-100 text-info border border-info/20"
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        variants[variant],
        className
      )}
      ref={ref}
      {...props}
    />
  );
});

Badge.displayName = "Badge";

export default Badge;