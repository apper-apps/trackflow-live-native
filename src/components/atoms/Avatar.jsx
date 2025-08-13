import { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Avatar = forwardRef(({ className, src, alt, name, size = "default", ...props }, ref) => {
  const sizes = {
    sm: "h-6 w-6 text-xs",
    default: "h-8 w-8 text-sm",
    lg: "h-10 w-10 text-base",
    xl: "h-12 w-12 text-lg"
  };

  const initials = name ? name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) : "U";

  if (src) {
    return (
      <img
        src={src}
        alt={alt || name}
        className={cn(
          "rounded-full object-cover border-2 border-white shadow-sm",
          sizes[size],
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }

  return (
    <div
      className={cn(
        "rounded-full flex items-center justify-center bg-gradient-to-br from-primary to-secondary text-white font-medium border-2 border-white shadow-sm",
        sizes[size],
        className
      )}
      ref={ref}
      {...props}
    >
      {initials}
    </div>
  );
});

Avatar.displayName = "Avatar";

export default Avatar;