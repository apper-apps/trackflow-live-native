import { forwardRef } from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const Select = forwardRef(({ className, children, ...props }, ref) => {
  return (
    <div className="relative">
      <select
        className={cn(
          "flex h-10 w-full appearance-none rounded-lg border border-gray-300 bg-white px-3 py-2 pr-10 text-sm text-gray-900 transition-all duration-200 focus:border-primary focus:ring-2 focus:ring-primary focus:ring-offset-1 disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
      </select>
      <ApperIcon
        name="ChevronDown"
        className="absolute right-3 top-3 h-4 w-4 text-gray-500 pointer-events-none"
      />
    </div>
  );
});

Select.displayName = "Select";

export default Select;