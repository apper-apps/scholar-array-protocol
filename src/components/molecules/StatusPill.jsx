import React from "react";
import { cn } from "@/utils/cn";

const StatusPill = ({ status, size = "default" }) => {
  const getStatusStyle = (status) => {
    switch (status.toLowerCase()) {
      case "present":
        return "bg-green-100 text-green-800 border-green-200";
      case "absent":
        return "bg-red-100 text-red-800 border-red-200";
      case "late":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "excused":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "active":
        return "bg-green-100 text-green-800 border-green-200";
      case "inactive":
        return "bg-gray-100 text-gray-800 border-gray-200";
      case "graduated":
        return "bg-purple-100 text-purple-800 border-purple-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const sizes = {
    sm: "px-2 py-1 text-xs",
    default: "px-3 py-1 text-sm",
    lg: "px-4 py-2 text-base"
  };

  return (
    <span className={cn(
      "inline-flex items-center rounded-full border font-medium capitalize",
      getStatusStyle(status),
      sizes[size]
    )}>
      {status}
    </span>
  );
};

export default StatusPill;