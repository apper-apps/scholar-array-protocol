import React from "react";
import { Card, CardContent } from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const StatCard = ({ 
  title, 
  value, 
  icon, 
  trend, 
  trendValue,
  color = "primary",
  className 
}) => {
  const colorClasses = {
    primary: "text-primary-500",
    secondary: "text-secondary-500",
    accent: "text-accent-500",
    success: "text-green-500",
    warning: "text-yellow-500",
    danger: "text-red-500"
  };

  const gradientBgs = {
    primary: "bg-gradient-to-br from-primary-500 to-primary-600",
    secondary: "bg-gradient-to-br from-secondary-500 to-secondary-600",
    accent: "bg-gradient-to-br from-accent-500 to-accent-600",
    success: "bg-gradient-to-br from-green-500 to-green-600",
    warning: "bg-gradient-to-br from-yellow-500 to-yellow-600",
    danger: "bg-gradient-to-br from-red-500 to-red-600"
  };

  return (
    <Card className={cn("hover-lift cursor-pointer", className)}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
            <p className="text-3xl font-bold gradient-text">{value}</p>
            {trend && (
              <div className="flex items-center mt-2">
                <ApperIcon 
                  name={trend === "up" ? "TrendingUp" : "TrendingDown"} 
                  className={cn(
                    "h-4 w-4 mr-1",
                    trend === "up" ? "text-green-500" : "text-red-500"
                  )} 
                />
                <span className={cn(
                  "text-sm font-medium",
                  trend === "up" ? "text-green-600" : "text-red-600"
                )}>
                  {trendValue}
                </span>
              </div>
            )}
          </div>
          <div className={cn("p-3 rounded-full", gradientBgs[color])}>
            <ApperIcon name={icon} className="h-6 w-6 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatCard;