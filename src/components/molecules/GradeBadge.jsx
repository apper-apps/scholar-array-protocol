import React from "react";
import Badge from "@/components/atoms/Badge";
import { cn } from "@/utils/cn";

const GradeBadge = ({ grade, percentage, size = "default" }) => {
  const getGradeColor = (grade) => {
    switch (grade) {
      case "A+":
      case "A":
        return "bg-gradient-to-r from-green-500 to-green-600 text-white";
      case "A-":
      case "B+":
        return "bg-gradient-to-r from-blue-500 to-blue-600 text-white";
      case "B":
      case "B-":
        return "bg-gradient-to-r from-yellow-500 to-yellow-600 text-white";
      case "C+":
      case "C":
        return "bg-gradient-to-r from-orange-500 to-orange-600 text-white";
      case "C-":
      case "D":
        return "bg-gradient-to-r from-red-400 to-red-500 text-white";
      case "F":
        return "bg-gradient-to-r from-red-600 to-red-700 text-white";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const sizes = {
    sm: "px-2 py-1 text-xs",
    default: "px-3 py-1 text-sm",
    lg: "px-4 py-2 text-base font-semibold"
  };

  return (
    <div className={cn(
      "inline-flex items-center rounded-full font-semibold border-0",
      getGradeColor(grade),
      sizes[size]
    )}>
      {grade}
      {percentage && (
        <span className="ml-1 opacity-90">({percentage}%)</span>
      )}
    </div>
  );
};

export default GradeBadge;