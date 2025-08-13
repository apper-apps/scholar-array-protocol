import React from "react";
import { cn } from "@/utils/cn";

const Loading = ({ className, rows = 3 }) => {
  return (
    <div className={cn("space-y-4 p-4", className)}>
      {/* Header skeleton */}
      <div className="flex items-center justify-between">
        <div className="h-8 bg-gray-200 rounded animate-shimmer w-48"></div>
        <div className="h-10 bg-gray-200 rounded animate-shimmer w-32"></div>
      </div>
      
      {/* Stats cards skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="bg-white rounded-lg p-6 shadow-sm card-shadow">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded animate-shimmer w-20"></div>
                <div className="h-8 bg-gray-200 rounded animate-shimmer w-16"></div>
              </div>
              <div className="h-12 w-12 bg-gray-200 rounded-full animate-shimmer"></div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Table skeleton */}
      <div className="bg-white rounded-lg shadow-sm card-shadow">
        <div className="p-6 border-b border-gray-200">
          <div className="h-6 bg-gray-200 rounded animate-shimmer w-40"></div>
        </div>
        <div className="p-6 space-y-4">
          {Array.from({ length: rows }).map((_, index) => (
            <div key={index} className="flex items-center space-x-4">
              <div className="h-10 w-10 bg-gray-200 rounded-full animate-shimmer"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded animate-shimmer w-1/3"></div>
                <div className="h-3 bg-gray-200 rounded animate-shimmer w-1/4"></div>
              </div>
              <div className="h-6 bg-gray-200 rounded animate-shimmer w-16"></div>
              <div className="h-8 bg-gray-200 rounded animate-shimmer w-20"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Loading;