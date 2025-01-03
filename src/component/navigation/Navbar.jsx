import React, { useState, useEffect } from "react";

const Navbar = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

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

  return (
    <header
      className={`fixed top-0 w-full z-50 ${
        isScrolled ? "bg-black shadow-md" : "bg-transparent"
      } transition-colors duration-300`}
    >
      <nav className="container mx-auto px-5 md:px-10 py-4 flex justify-between items-center">
        {/* Logo */}
        <div className="text-lg md:text-xl lg:text-2xl gap-2 flex items-center justify-center font-bold text-white">
          <div className="w-[30px] md:w-[45px] h-[30px] md:h-[45px] bg-white rounded-full "></div>
          <div className="flex flex-col gap-0 items-start">
            <span>Global</span>
            <span>Relocate</span>
          </div>
        </div>

        {/* Nav Links (Desktop) */}
        <ul className="hidden md:flex space-x-8 text-white">
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
          <button className="px-4 py-2 border rounded-xl text-white hover:bg-gray-700">
            Sign In
          </button>
          <button className="px-4 py-2 bg-white text-black rounded-xl ">
            Sign Up
          </button>
        </div>

        {/* Hamburger Menu (Mobile) */}
        <button
          onClick={toggleDrawer}
          className="md:hidden text-white focus:outline-none"
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
