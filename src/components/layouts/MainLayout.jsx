import React from "react";
import Navbar from "../navigation/Navbar";
import Footer from "../navigation/Footer";

function MainLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-grow">
        <Navbar />
        {children}
      </div>
      <Footer />
    </div>
  );
}

export default MainLayout;
