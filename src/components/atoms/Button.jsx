import { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Button = forwardRef(({ className, variant = "default", size = "default", ...props }, ref) => {
  const variants = {
    default: "bg-gradient-to-r from-primary to-secondary hover:brightness-90 text-white shadow-lg",
    outline: "border-2 border-primary text-primary bg-transparent hover:bg-gradient-to-r hover:from-primary hover:to-secondary hover:text-white",
    ghost: "hover:bg-gray-100 text-gray-700 hover:text-gray-900",
    success: "bg-gradient-to-r from-success to-emerald-600 hover:brightness-90 text-white shadow-lg",
    warning: "bg-gradient-to-r from-warning to-amber-600 hover:brightness-90 text-white shadow-lg",
    error: "bg-gradient-to-r from-error to-red-600 hover:brightness-90 text-white shadow-lg"
  };

  const sizes = {
    default: "h-10 px-4 py-2",
    sm: "h-8 px-3 text-sm",
    lg: "h-12 px-8 text-lg",
    icon: "h-10 w-10"
  };

  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-lg text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed",
        variants[variant],
        sizes[size],
        className
      )}
      ref={ref}
      {...props}
    />
  );
});

Button.displayName = "Button";

export default Button;