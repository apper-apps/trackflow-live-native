import { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Card = forwardRef(({ className, ...props }, ref) => {
  return (
    <div
      className={cn(
        "rounded-lg bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});

Card.displayName = "Card";

export default Card;