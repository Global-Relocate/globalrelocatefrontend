import React from "react";
import { BsSearch } from "react-icons/bs";

function SearchInput({ value, onChange, placeholder }) {
  return (
    <div className="flex items-center w-full md:w-[400px] bg-white p-3 rounded-xl border border-[#D4D4D4]">
      <BsSearch className="text-lg text-[#626262]" />
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full px-3 bg-white text-[#626262] focus:outline-none"
      />
    </div>
  );
}

export default SearchInput;
