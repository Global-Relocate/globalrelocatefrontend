import React from "react";
import Navbar from "../navigation/Navbar";
import Footer from "../navigation/Footer";

function MainLayout({ children }) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}

export default MainLayout;
