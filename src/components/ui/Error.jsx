import React from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Error = ({ 
  className, 
  message = "Something went wrong. Please try again.", 
  onRetry,
  title = "Oops! An error occurred"
}) => {
  return (
    <div className={cn("flex flex-col items-center justify-center p-8 text-center", className)}>
      <div className="p-4 bg-red-100 rounded-full mb-4">
        <ApperIcon name="AlertTriangle" className="h-12 w-12 text-red-500" />
      </div>
      
      <h2 className="text-2xl font-semibold text-gray-900 mb-2">{title}</h2>
      <p className="text-gray-600 mb-6 max-w-md">{message}</p>
      
      {onRetry && (
        <Button onClick={onRetry} className="flex items-center">
          <ApperIcon name="RefreshCw" className="h-4 w-4 mr-2" />
          Try Again
        </Button>
      )}
    </div>
  );
};

export default Error;