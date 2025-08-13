import React, { useState } from "react";
import Header from "@/components/organisms/Header";
import Sidebar from "@/components/organisms/Sidebar";
import MobileSidebar from "@/components/organisms/MobileSidebar";
import ApperIcon from "@/components/ApperIcon";

const Layout = ({ children }) => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background-50 flex">
      {/* Desktop Sidebar */}
      <Sidebar className="hidden lg:flex" />
      
      {/* Mobile Sidebar */}
      <MobileSidebar 
        isOpen={isMobileSidebarOpen}
        onClose={() => setIsMobileSidebarOpen(false)}
      />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header with Menu Button */}
        <div className="lg:hidden bg-white border-b border-gray-200 px-4 py-3">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="p-2 rounded-md text-gray-600 hover:bg-gray-100 transition-colors"
            >
              <ApperIcon name="Menu" className="h-6 w-6" />
            </button>
            <div className="flex items-center">
              <div className="p-1.5 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg">
                <ApperIcon name="GraduationCap" className="h-5 w-5 text-white" />
              </div>
              <span className="ml-2 text-lg font-bold gradient-text">Scholar Hub</span>
            </div>
            <div className="w-10" /> {/* Spacer for centering */}
          </div>
        </div>
        
        {/* Header */}
        <Header title="Dashboard" className="hidden lg:block" />
        
        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;