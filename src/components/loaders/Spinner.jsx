import React from "react";



const Spinner = ({ size = "w-8 h-8", color = "border-black" }) => {
  return (
    <div className="flex items-center justify-center">
      <div className={`${size} border-2 ${color} border-t-transparent rounded-full animate-spin`}></div>
    </div>
  );
};

export default Spinner;
