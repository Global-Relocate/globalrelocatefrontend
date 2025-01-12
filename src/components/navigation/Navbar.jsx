import React, { useState, useEffect } from "react";
import logo from "../../assets/svg/logo.svg";
import { useNavigate } from "react-router-dom";
import SelectLanguages from "@/components/drawers/SelectLanguages";

const Navbar = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isLangDrawerOpen, setIsLangDrawerOpen] = useState(false);

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
        <div className="text-lg md:text-xl lg:text-2xl z-20 gap-2 flex items-center justify-center font-bold text-white">
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
          <SelectLanguages/>
            {/* <div
              className="flex items-center space-x-1 cursor-pointer"
              // onClick={() => setIsLangDrawerOpen(true)}
            >
              <img
                src="https://uk.usembassy.gov/wp-content/uploads/sites/16/US_Flag_Color_72DPI_750x450.jpg"
                className="w-7 h-7 rounded-full"
                alt="logo"
              />
              <span className="text-sm">EN</span>
            </div>
          </SelectLanguages> */}
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
        <div className="absolute top-0 left-0 w-full h-screen bg-white text-black flex flex-col items-start justify-between pb-8 px-8 space-y-8 pt-20 md:hidden">
          <button
            onClick={toggleDrawer}
            className="absolute top-6 right-6 text-black"
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
          <div className="flex flex-col gap-5 text-[#404040] text-lg items-start">
            <a href="#home" className="hover:text-black" onClick={toggleDrawer}>
              Home
            </a>
            <a
              href="#about"
              className="hover:text-black"
              onClick={toggleDrawer}
            >
              Countries & Data
            </a>
            <a
              href="#services"
              className="hover:text-black"
              onClick={toggleDrawer}
            >
              Communities
            </a>
            <a
              href="#contact"
              className="hover:text-black"
              onClick={toggleDrawer}
            >
              Tools
            </a>
            <a
              href="#contact"
              className="hover:text-black"
              onClick={toggleDrawer}
            >
              Contact
            </a>
            <SelectLanguages/>
          </div>
          <div className="flex flex-col gap-4 w-full">
            <button
              onClick={handleSignIn}
              className="w-full px-4 py-3 rounded-xl text-sm text-black border hover:bg-gray-100"
            >
              Sign In
            </button>
            <button
              onClick={handleSignUp}
              className="w-full px-4 py-3 bg-[#FCA311] text-sm text-black rounded-xl hover:bg-yellow-400"
            >
              Sign Up
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
