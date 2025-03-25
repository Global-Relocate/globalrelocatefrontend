import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import SelectLanguages from "@/components/drawers/SelectLanguages";
import logo from "../../assets/svg/logo.svg";
import { X, Menu, LogOut } from "lucide-react";
import { useTranslation } from "react-i18next";
import { LuUserRound } from "react-icons/lu";
import { IoChevronDownOutline } from "react-icons/io5";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const { t } = useTranslation();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, logout, user } = useContext(AuthContext);
  const [profilePic, setProfilePic] = useState(null);
  const displayName = user?.username || user?.name || "User";

  const navLinks = [
    { href: "/", label: t("landingPage.navbar.home") },
    { href: "/user/countries", label: t("landingPage.navbar.countriesData") },
    // { href: "/user/community", label: t("landingPage.navbar.community") }, // Comment out community
    { href: "/user/tax-calculator", label: t("landingPage.navbar.tools") },
    { href: "/upgrade", label: t("landingPage.navbar.pricing") },
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

  const NavLinks = ({ mobile = false, onClick = () => { } }) => (
    <ul className={`${mobile ? "flex flex-col space-y-6" : "flex space-x-8"}`}>
      {navLinks.map(({ href, label }) => (
        <li key={href}>
          <Link
            to={href}
            className={`transition-colors duration-200 ${isActivePath(href)
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
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled
          ? "bg-white/80 backdrop-blur-md border-b border-gray-200"
          : "bg-transparent"
          }`}
      >
        <nav className="max-w-[1440px] mx-auto px-6 lg:px-10 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center focus:outline-none">
              <img src={logo} alt="Global Relocate Logo" className="h-12" />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center flex-1 justify-center">
              <NavLinks />
            </div>

            {/* Desktop Right Section */}
            <div className="hidden lg:flex items-center space-x-6">
              <SelectLanguages />
              {isAuthenticated ? (
                <>
                  <DropdownMenu>
                    <DropdownMenuTrigger className="flex items-center justify-start space-x-1 p-2 rounded-3xl cursor-pointer hover:bg-gray-100 outline-none">
                      <div className="flex text-white items-center justify-center h-7 w-7 rounded-full bg-[#8F8F8F]">
                        {profilePic ? (
                          <img 
                            src={profilePic} 
                            alt="Profile" 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <LuUserRound className="h-4 w-4" />
                        )}
                      </div>
                      <span className="text-xs">{displayName}</span>
                      <IoChevronDownOutline className="text-gray-400" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-[200px]">
                      <DropdownMenuItem
                        className="cursor-pointer"
                        onClick={() => navigate("/user/profile")}
                      >
                        View profile
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => navigate("/help")}
                        className="cursor-pointer"
                      >
                        Help Center
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="cursor-pointer"
                        onClick={() => navigate("/user/feedback")}
                      >
                        Give us feedback
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <button
                    onClick={handleLogout}
                    className="flex items-center justify-center p-2 text-[#404040] hover:text-black transition-colors duration-200"
                  >
                    <LogOut className="h-5 w-5" />
                  </button>
                </>
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
          className={`fixed inset-0 bg-white z-[60] lg:hidden transition-transform duration-300 ${isDrawerOpen ? "translate-x-0" : "translate-x-full"
            }`}
        >
          <div className="flex flex-col h-full">
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <Link to="/" className="focus:outline-none">
                <img src={logo} alt="Global Relocate Logo" className="h-10" />
              </Link>
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
