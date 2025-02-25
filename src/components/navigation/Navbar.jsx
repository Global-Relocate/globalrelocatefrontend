import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import SelectLanguages from "@/components/drawers/SelectLanguages";
import logo from "../../assets/svg/logo.svg";
import { X, Menu, LogOut } from "lucide-react";
import { useTranslation } from "react-i18next";

const Navbar = () => {
  const { t } = useTranslation();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, logout } = useContext(AuthContext);

  const navLinks = [
    { href: "/", label: t("landingPage.navbar.home") },
    { href: "/user/countries", label: t("landingPage.navbar.countriesData") },
    { href: "#community", label: t("landingPage.navbar.community") },
    { href: "#tools", label: t("landingPage.navbar.tools") },
    { href: "#contact", label: t("landingPage.navbar.contact") },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Prevent background scroll when drawer is open
  useEffect(() => {
    if (isDrawerOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isDrawerOpen]);

  const handleSignIn = () => {
    setIsDrawerOpen(false);
    navigate("/login");
  };

  const handleSignUp = () => {
    setIsDrawerOpen(false);
    navigate("/signup");
  };

  const handleLogout = () => {
    setIsDrawerOpen(false);
    logout();
    navigate("/");
  };

  const isActivePath = (path) => location.pathname === path;

  const NavLinks = ({ mobile = false, onClick = () => {} }) => (
    <ul className={`${mobile ? "flex flex-col space-y-6" : "flex space-x-8"}`}>
      {navLinks.map(({ href, label }) => (
        <li key={href}>
          <Link
            to={href}
            className={`transition-colors duration-200 ${
              isActivePath(href)
                ? "text-black hover:text-[#404040]"
                : "text-[#404040] hover:text-black"
            }`}
            onClick={onClick}
          >
            {label}
          </Link>
        </li>
      ))}
    </ul>
  );

  return (
    <>
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
          className={`fixed inset-0 bg-white z-[60] lg:hidden transition-transform duration-300 ${
            isDrawerOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex flex-col h-full">
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
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

            <div className="flex-1 overflow-y-auto">
              <div className="px-6 py-8">
                <NavLinks mobile onClick={() => setIsDrawerOpen(false)} />
                <div className="mt-8">
                  <SelectLanguages />
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-100">
              {isAuthenticated ? (
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-xl text-gray-700 border border-gray-300 hover:bg-gray-100 transition-colors duration-200"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Logout</span>
                </button>
              ) : (
                <div className="space-y-4">
                  <button
                    onClick={handleSignIn}
                    className="w-full px-4 py-3 rounded-xl text-gray-700 border border-gray-300 hover:bg-gray-100 transition-colors duration-200"
                  >
                    Log In
                  </button>
                  <button
                    onClick={handleSignUp}
                    className="w-full px-4 py-3 bg-[#FCA311] hover:bg-[#e5940c] text-black rounded-xl transition-colors duration-200"
                  >
                    Get Started
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Navbar;
