import React, { useState, useEffect } from "react";
import logo from "../../assets/images/logo_main.png";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  const handleSignIn = () => {
    navigate("/login");
  };

  const handleSignUp = () => {
    navigate("/signup");
  };

  return (
    <header
      className={`fixed top-0 w-full z-50 ${
        isScrolled ? "bg-white shadow-sm" : "bg-transperant"
      } transition-colors duration-300`}
    >
      {/* className={`fixed top-0 w-full z-50 ${
        isScrolled ? "bg-black shadow-md" : "bg-white"
      } transition-colors duration-300`}
    > */}
      <nav className="container mx-auto px-5 md:px-10 py-4 flex justify-between items-center">
        {/* Logo */}
        <div className="text-lg md:text-xl lg:text-2xl gap-2 flex items-center justify-center font-bold text-white">
          <img src={logo} alt="logo" />
        </div>

        {/* Nav Links (Desktop) */}
        <ul className="hidden md:flex space-x-8 text-black">
          <li>
            <a href="#home" className="hover:text-gray-300">
              Home
            </a>
          </li>
          <li>
            <a href="#about" className="hover:text-gray-300">
              Countries & Data
            </a>
          </li>
          <li>
            <a href="#services" className="hover:text-gray-300">
              Community
            </a>
          </li>
          <li>
            <a href="#contact" className="hover:text-gray-300">
              Tools
            </a>
          </li>
          <li>
            <a href="#contact" className="hover:text-gray-300">
              Contacts
            </a>
          </li>
        </ul>

        {/* Sign Up and Sign In Buttons */}
        <div className="hidden md:flex space-x-4">
          <div className="flex items-center space-x-1 cursor-pointer">
            <img
              src="https://uk.usembassy.gov/wp-content/uploads/sites/16/US_Flag_Color_72DPI_750x450.jpg"
              className="w-7 h-7 rounded-full"
              alt="logo"
            />
            <span className="text-sm">EN</span>
          </div>
          <button className="px-4 py-2 text-black" onClick={handleSignIn}>
            Log In
          </button>
          <button
            className="bg-[#fca311] text-black py-2 px-4 rounded-xl text-sm font-medium"
            onClick={handleSignUp}
          >
            Get Started
          </button>
        </div>

        {/* Hamburger Menu (Mobile) */}
        <button
          onClick={toggleDrawer}
          className="md:hidden text-black focus:outline-none"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16m-7 6h7"
            />
          </svg>
        </button>
      </nav>

      {/* Mobile Drawer */}
      {isDrawerOpen && (
        <div className="absolute top-0 left-0 w-full h-screen bg-black text-white flex flex-col items-center space-y-8 pt-20 md:hidden">
          <button
            onClick={toggleDrawer}
            className="absolute top-5 right-5 text-white"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
          <a
            href="#home"
            className="hover:text-gray-300"
            onClick={toggleDrawer}
          >
            Home
          </a>
          <a
            href="#about"
            className="hover:text-gray-300"
            onClick={toggleDrawer}
          >
            About
          </a>
          <a
            href="#services"
            className="hover:text-gray-300"
            onClick={toggleDrawer}
          >
            Services
          </a>
          <a
            href="#contact"
            className="hover:text-gray-300"
            onClick={toggleDrawer}
          >
            Contact
          </a>
          <div className="space-y-4 space-x-3">
            <button className="px-4 py-2 border rounded-xl text-white hover:bg-gray-700">
              Sign In
            </button>
            <button className="px-4 py-2 bg-yellow-600 text-white rounded-xl hover:bg-yellow-700">
              Sign Up
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
