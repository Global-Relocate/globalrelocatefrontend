import React from "react";
import { BsSearch } from "react-icons/bs";

function SearchInput() {
  return (
    <div className="flex items-center w-full md:w-[400px] bg-[#F6F6F6] p-3 rounded-xl">
      <BsSearch className="text-lg text-[#626262]" />
      <input
        type="text"
        placeholder="Search"
        className="w-full px-3 bg-transparent text-[#626262]  focus:outline-none"
      />
    </div>
  );
}

export default SearchInput;
