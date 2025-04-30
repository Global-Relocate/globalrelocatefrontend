import React from "react";
import { BsSearch } from "react-icons/bs";
import { X } from "lucide-react";

function SearchInput({ value, onChange, placeholder }) {
  // Handle clear button click
  const handleClear = () => {
    // Call onChange with empty string to clear the input
    onChange({ target: { value: "" } });
  };

  return (
    <div className="flex items-center w-full bg-white p-3 rounded-xl border border-[#D4D4D4]">
      <BsSearch className="text-lg text-[#626262]" />
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full px-3 bg-white text-[#626262] focus:outline-none"
      />
      {value && (
        <button 
          onClick={handleClear} 
          className="flex items-center justify-center p-1 rounded-full hover:bg-gray-100"
          aria-label="Clear search"
        >
          <X className="h-4 w-4 text-gray-500" />
        </button>
      )}
    </div>
  );
}

export default SearchInput;
