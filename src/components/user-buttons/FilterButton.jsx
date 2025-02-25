import React from "react";
import { Button } from "../ui/button";

function FilterButton({ isActive, title, onClick, ...props }) {
  return (
    <Button
      {...props}
      onClick={onClick}
      className={`${
        isActive
          ? "bg-black text-white shadow-md"
          : "bg-white text-black hover:bg-black hover:text-white"
      } rounded-3xl shadow-none border border-[#EDEBE8] transition-colors duration-200`}
    >
      {title}
    </Button>
  );
}

export default FilterButton;
