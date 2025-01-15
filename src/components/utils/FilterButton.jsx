import React from "react";
import { LuSettings2 } from "react-icons/lu";

function FilterButton() {
  return (
    <div className="flex items-center p-3 space-x-2 rounded-xl border transition-all hover:bg-[#F6F6F6] cursor-pointer">
      <LuSettings2 />
      <span> Filter</span>
    </div>
  );
}

export default FilterButton;
