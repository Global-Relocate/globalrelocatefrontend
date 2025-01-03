import React from "react";
import Navbar from "../navigation/Navbar";

function MainLayout({ children }) {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}

export default MainLayout;
