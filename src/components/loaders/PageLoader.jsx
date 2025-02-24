import React from "react";
import logo from "../../assets/svg/logo.svg";

const PageLoader = () => {
  return (
    <div className="flex flex-col gap-2 items-center min-h-dvh justify-center">
      <img src={logo} alt="Global Relocate Logo" className="h-10" />
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-yellow-500"></div>
    </div>
  );
};

export default PageLoader;
