import React from "react";
import ApperIcon from "@/components/ApperIcon";
import Avatar from "@/components/atoms/Avatar";
import { cn } from "@/utils/cn";

const Header = ({ title, className }) => {
  return (
    <header className={cn("bg-white border-b border-gray-200 px-6 py-4", className)}>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold gradient-text">{title}</h1>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <button className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors">
            <ApperIcon name="Bell" className="h-6 w-6" />
            <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
          </button>

          {/* Settings */}
          <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
            <ApperIcon name="Settings" className="h-6 w-6" />
          </button>

          {/* User Avatar */}
          <div className="flex items-center space-x-3">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">Ms. Johnson</p>
              <p className="text-xs text-gray-500">Mathematics Teacher</p>
            </div>
            <Avatar initials="MJ" size="default" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;