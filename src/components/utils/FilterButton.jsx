import React from "react";
import { Button } from "../ui/button";

function FilterButton({ isActive, title, ...props }) {
  return (
    <Button
      {...props}
      className={`${
        isActive ? "bg-black text-white shadow-md" : "bg-white text-black"
      } rounded-3xl  shadow-none hover:text-white border border-black`}
    >
      {title}
    </Button>
  );
}

export default FilterButton;
