import React from "react";
import logo from "../../assets/svg/logo.svg";

const PageLoader = () => {
  return (
    <div className="flex flex-col gap-3 items-center min-h-dvh justify-center">
      <img src={logo} alt="Global Relocate Logo" className="h-14 md:h-16" />
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-t-transparent border-yellow-500"></div>
    </div>
  );
};

export default PageLoader;
