import React, { useState } from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const SearchBar = ({ 
  placeholder = "Search...", 
  onSearch, 
  className,
  value: controlledValue,
  onChange: controlledOnChange 
}) => {
  const [internalValue, setInternalValue] = useState("");
  
  const isControlled = controlledValue !== undefined;
  const value = isControlled ? controlledValue : internalValue;
  
  const handleChange = (e) => {
    const newValue = e.target.value;
    
    if (!isControlled) {
      setInternalValue(newValue);
    }
    
    if (controlledOnChange) {
      controlledOnChange(e);
    }
    
    if (onSearch) {
      onSearch(newValue);
    }
  };

  const handleClear = () => {
    const newValue = "";
    
    if (!isControlled) {
      setInternalValue(newValue);
    }
    
    if (controlledOnChange) {
      controlledOnChange({ target: { value: newValue } });
    }
    
    if (onSearch) {
      onSearch(newValue);
    }
  };

  return (
    <div className={cn("relative w-full max-w-sm", className)}>
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <ApperIcon name="Search" className="h-5 w-5 text-gray-400" />
      </div>
      <input
        type="text"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className="w-full pl-10 pr-10 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-primary-400 transition-all duration-200"
      />
      {value && (
        <button
          onClick={handleClear}
          className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-gray-700 transition-colors"
        >
          <ApperIcon name="X" className="h-5 w-5 text-gray-400" />
        </button>
      )}
    </div>
  );
};

export default SearchBar;