import React, { useState } from "react";
import { Button } from "../ui/button";

function FilterButton({ isActive, title, onClick, ...props }) {
  const [isClicked, setIsClicked] = useState(isActive);

  const handleClick = () => {
    setIsClicked(!isClicked);
    if (onClick) onClick();
  };

  return (
    <Button
      {...props}
      onClick={handleClick}
      className={`${
        isClicked 
          ? "bg-black text-white shadow-md" 
          : "bg-white text-black hover:bg-black/5"
      } rounded-3xl shadow-none border border-[#D4D4D4] transition-colors duration-200`}
    >
      {title}
    </Button>
  );
}

export default FilterButton;
