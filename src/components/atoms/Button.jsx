import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Button = forwardRef(({ 
  className, 
  variant = "default", 
  size = "default", 
  children, 
  ...props 
}, ref) => {
  const baseClasses = "inline-flex items-center justify-center rounded-md font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";
  
  const variants = {
    default: "bg-primary-500 text-white shadow hover:bg-primary-600 hover:scale-105",
    secondary: "bg-secondary-500 text-white shadow hover:bg-secondary-600 hover:scale-105",
    accent: "bg-accent-500 text-white shadow hover:bg-accent-600 hover:scale-105",
    outline: "border-2 border-primary-500 text-primary-500 hover:bg-primary-500 hover:text-white",
    ghost: "text-primary-500 hover:bg-primary-50 hover:text-primary-600",
    success: "bg-green-500 text-white shadow hover:bg-green-600 hover:scale-105",
    danger: "bg-red-500 text-white shadow hover:bg-red-600 hover:scale-105"
  };
  
  const sizes = {
    sm: "h-8 px-3 text-sm",
    default: "h-10 px-4 py-2",
    lg: "h-12 px-6 text-lg",
    icon: "h-10 w-10"
  };
  
  return (
    <button
      className={cn(baseClasses, variants[variant], sizes[size], className)}
      ref={ref}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = "Button";

export default Button;