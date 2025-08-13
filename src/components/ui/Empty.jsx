import React from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Empty = ({ 
  className, 
  title = "No data found",
  description = "Get started by adding your first item.",
  icon = "Inbox",
  action,
  actionLabel = "Add New"
}) => {
  return (
    <div className={cn("flex flex-col items-center justify-center p-12 text-center", className)}>
      <div className="p-4 bg-gray-100 rounded-full mb-4">
        <ApperIcon name={icon} className="h-12 w-12 text-gray-400" />
      </div>
      
      <h2 className="text-xl font-semibold text-gray-900 mb-2">{title}</h2>
      <p className="text-gray-600 mb-6 max-w-md">{description}</p>
      
      {action && (
        <Button onClick={action} variant="default" className="flex items-center">
          <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export default Empty;