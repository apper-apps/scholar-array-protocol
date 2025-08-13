import React from "react";
import { NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const MobileSidebar = ({ isOpen, onClose }) => {
  const navigationItems = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: "LayoutDashboard"
    },
    {
      name: "Students", 
      href: "/students",
      icon: "Users"
    },
    {
      name: "Classes",
      href: "/classes", 
      icon: "BookOpen"
    },
    {
      name: "Grades",
      href: "/grades",
      icon: "GraduationCap"
    },
    {
      name: "Attendance",
      href: "/attendance",
      icon: "Calendar"
    }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="lg:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
          />
          
          {/* Sidebar */}
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="lg:hidden fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl"
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200">
                <div className="flex items-center">
                  <div className="p-2 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg">
                    <ApperIcon name="GraduationCap" className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-3">
                    <h2 className="text-xl font-bold gradient-text">Scholar Hub</h2>
                    <p className="text-xs text-gray-500">Student Management</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-1 rounded-md hover:bg-gray-100 transition-colors"
                >
                  <ApperIcon name="X" className="h-5 w-5 text-gray-500" />
                </button>
              </div>

              {/* Navigation */}
              <nav className="flex-1 px-4 py-6 space-y-2">
                {navigationItems.map((item) => (
                  <NavLink
                    key={item.name}
                    to={item.href}
                    onClick={onClose}
                    className={({ isActive }) =>
                      cn(
                        "flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 group",
                        isActive
                          ? "bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-md"
                          : "text-gray-600 hover:text-primary-600 hover:bg-primary-50"
                      )
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <ApperIcon
                          name={item.icon}
                          className={cn(
                            "mr-3 h-5 w-5 transition-colors",
                            isActive ? "text-white" : "text-gray-400 group-hover:text-primary-500"
                          )}
                        />
                        {item.name}
                      </>
                    )}
                  </NavLink>
                ))}
              </nav>

              {/* Footer */}
              <div className="p-4 border-t border-gray-200">
                <div className="flex items-center text-xs text-gray-500">
                  <ApperIcon name="Heart" className="h-4 w-4 mr-1 text-red-400" />
                  Made for educators
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MobileSidebar;