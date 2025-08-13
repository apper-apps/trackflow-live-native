import { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Input = forwardRef(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "flex h-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-500 transition-all duration-200 focus:border-primary focus:ring-2 focus:ring-primary focus:ring-offset-1 disabled:opacity-50",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});

Input.displayName = "Input";

export default Input;