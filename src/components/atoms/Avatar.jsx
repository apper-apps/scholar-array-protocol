import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const Avatar = forwardRef(({ 
  className, 
  src, 
  alt, 
  initials,
  size = "default",
  ...props 
}, ref) => {
  const sizes = {
    sm: "h-8 w-8 text-xs",
    default: "h-10 w-10 text-sm",
    lg: "h-12 w-12 text-base",
    xl: "h-16 w-16 text-lg"
  };

  return (
    <div
      ref={ref}
      className={cn(
        "relative flex shrink-0 overflow-hidden rounded-full bg-gradient-to-br from-primary-400 to-secondary-500",
        sizes[size],
        className
      )}
      {...props}
    >
      {src ? (
        <img className="aspect-square h-full w-full object-cover" src={src} alt={alt} />
      ) : initials ? (
        <div className="flex h-full w-full items-center justify-center text-white font-medium">
          {initials}
        </div>
      ) : (
        <div className="flex h-full w-full items-center justify-center text-white">
          <ApperIcon name="User" className="h-1/2 w-1/2" />
        </div>
      )}
    </div>
  );
});

Avatar.displayName = "Avatar";

export default Avatar;