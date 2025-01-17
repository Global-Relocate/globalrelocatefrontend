import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import SelectLanguages from "@/components/drawers/SelectLanguages";
import logo from "../../assets/svg/logo.svg";
import { X, Menu, LogOut } from "lucide-react";

const Navbar = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, logout } = useContext(AuthContext);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "#about", label: "Countries & Data" },
    { href: "#services", label: "Community" },
    { href: "#tools", label: "Tools" },
    { href: "#contact", label: "Contact" }
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isDrawerOpen ? "hidden" : "";
  }, [isDrawerOpen]);

  const handleSignIn = () => navigate("/login");
  const handleSignUp = () => navigate("/signup");
  const handleLogout = () => {
    logout();
    navigate("/");
  };
  const isActivePath = (path) => location.pathname === path;

  const NavLinks = ({ mobile = false, onClick = () => {} }) => (
    <ul className={`${mobile ? "flex flex-col space-y-6" : "flex space-x-8"}`}>
      {navLinks.map(({ href, label }) => (
        <li key={href}>
          <a
            href={href}
            className={`transition-colors duration-200 ${
              isActivePath(href)
                ? "text-black hover:text-[#404040]"
                : "text-[#404040] hover:text-black"
            }`}
            onClick={onClick}
          >
            {label}
          </a>
        </li>
      ))}
    </ul>
  );

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/80 backdrop-blur-md border-b border-gray-200"
          : "bg-transparent"
      }`}
    >
      <nav className="max-w-[1440px] mx-auto px-6 lg:px-10 py-4">
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate("/")}
            className="flex items-center focus:outline-none"
          >
            <img src={logo} alt="Global Relocate Logo" className="h-10" />
          </button>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center flex-1 justify-center">
            <NavLinks />
          </div>

          {/* Desktop Right Section */}
          <div className="hidden lg:flex items-center space-x-6">
            <SelectLanguages />
            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 text-[#404040] hover:text-black transition-colors duration-200"
              >
                <LogOut className="h-5 w-5" />
                <span>Logout</span>
              </button>
            ) : (
              <>
                <button
                  onClick={handleSignIn}
                  className="text-[#404040] hover:text-black transition-colors duration-200"
                >
                  Log In
                </button>
                <button
                  onClick={handleSignUp}
                  className="bg-[#FCA311] hover:bg-[#e5940c] text-black px-6 py-3 rounded-xl text-sm transition-colors duration-200"
                >
                  Get Started
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsDrawerOpen(!isDrawerOpen)}
            className="lg:hidden text-gray-700 focus:outline-none"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <div
        className={`fixed inset-0 bg-white shadow-xl z-[9999] lg:hidden transform transition-transform duration-300 ease-in-out ${
          isDrawerOpen ? "translate-x-0" : "translate-x-full"
        }`}
        style={{ isolation: 'isolate' }}
      >
        <div className="flex flex-col h-full">
          <div className="flex justify-between items-center p-6">
            <button
              onClick={() => navigate("/")}
              className="focus:outline-none"
            >
              <img src={logo} alt="Global Relocate Logo" className="h-10" />
            </button>
            <button
              onClick={() => setIsDrawerOpen(false)}
              className="text-gray-700 focus:outline-none"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="flex flex-col flex-1 px-6 pt-8">
            <NavLinks mobile onClick={() => setIsDrawerOpen(false)} />
            <div className="pt-8">
              <SelectLanguages />
            </div>
          </div>

          <div className="p-6 space-y-4">
            {isAuthenticated ? (
              <button
                onClick={() => {
                  handleLogout();
                  setIsDrawerOpen(false);
                }}
                className="w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-xl text-gray-700 border border-gray-300 hover:bg-gray-100 transition-colors duration-200"
              >
                <LogOut className="h-5 w-5" />
                <span>Logout</span>
              </button>
            ) : (
              <>
                <button
                  onClick={() => {
                    handleSignIn();
                    setIsDrawerOpen(false);
                  }}
                  className="w-full px-4 py-3 rounded-xl text-gray-700 border border-gray-300 hover:bg-gray-100 transition-colors duration-200"
                >
                  Log In
                </button>
                <button
                  onClick={() => {
                    handleSignUp();
                    setIsDrawerOpen(false);
                  }}
                  className="w-full px-4 py-3 bg-[#FCA311] hover:bg-[#e5940c] text-black rounded-xl transition-colors duration-200"
                >
                  Get Started
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
