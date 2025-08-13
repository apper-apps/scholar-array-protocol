import React from "react";
import { cn } from "@/utils/cn";

const ProgressRing = ({ 
  percentage, 
  size = 60, 
  strokeWidth = 4, 
  color = "primary",
  label,
  className 
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const colors = {
    primary: "#4A90E2",
    secondary: "#7B68EE",
    success: "#4CAF50",
    warning: "#FFC107",
    danger: "#FF6B6B"
  };

  return (
    <div className={cn("relative inline-flex items-center justify-center", className)}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#E5E7EB"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={colors[color]}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-300 ease-in-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-lg font-semibold text-gray-900">{Math.round(percentage)}%</span>
        {label && <span className="text-xs text-gray-500">{label}</span>}
      </div>
    </div>
  );
};

export default ProgressRing;