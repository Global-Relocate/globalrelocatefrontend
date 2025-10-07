import { useState, useEffect, useContext, useRef } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContextExport";
import SelectLanguages from "@/components/drawers/SelectLanguages";
import SelectLanguageModal from "../modals/select-language-modal";
import logo from "../../assets/svg/logo.svg";
import { X, Menu, LogOut } from "lucide-react";
import { useTranslation } from "react-i18next";
import { LuUserRound } from "react-icons/lu";
import { IoChevronDownOutline } from "react-icons/io5";
import PropTypes from "prop-types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BellIcon } from "lucide-react";
import { useNotifications } from "@/context/NotificationsContext";
import { getUserProfile } from "@/services/api";

const Navbar = () => {
  const { t } = useTranslation();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { unreadCount } = useNotifications();
  const { isAuthenticated, logout, user } = useContext(AuthContext);
  const [profilePic, setProfilePic] = useState(null);
  const displayName = user?.username || user?.name || "User";
  const drawerRef = useRef(null);

  const navLinks = [
    { href: "/", label: t("landingPage.navbar.home") },
    { href: "/user/countries", label: t("landingPage.navbar.countriesData") },
    // { href: "/user/community", label: t("landingPage.navbar.community") }, // Comment out community
    {
      href: "/user/tax-calculator",
      label: t("userDashboard.sidebar.taxCalculator"),
    },
    { href: "/upgrade", label: t("landingPage.navbar.pricing") },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle click outside to close drawer
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        drawerRef.current &&
        !drawerRef.current.contains(event.target) &&
        isDrawerOpen
      ) {
        setIsDrawerOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDrawerOpen]);

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

  useEffect(() => {
    const fetchProfilePic = async () => {
      try {
        const response = await getUserProfile();
        if (response.success && response.data?.profilePic) {
          setProfilePic(response.data.profilePic);
        }
      } catch (error) {
        console.error("Error fetching profile picture:", error);
      }
    };

    fetchProfilePic();
  }, []);

  NavLinks.propTypes = {
    mobile: PropTypes.bool,
    onClick: PropTypes.func,
  };

  return (
    <>
      <header
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          isScrolled ? "bg-white/80 backdrop-blur-md" : "bg-transparent"
        }`}
      >
        <nav className="pl-[34px] pr-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center focus:outline-none">
              <img src={logo} alt="Global Relocate Logo" className="h-12" />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center flex-1 justify-center">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`transition-colors duration-200 px-4 ${
                    location.pathname === link.href
                      ? "text-black"
                      : "text-[#404040] hover:text-black"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Desktop Right Section */}
            <div className="hidden lg:flex items-center gap-4">
              {isAuthenticated ? (
                <>
                  <DropdownMenu>
                    <DropdownMenuTrigger className="flex items-center justify-start space-x-1 p-2 rounded-3xl cursor-pointer hover:bg-gray-100 outline-none">
                      <div className="flex text-white items-center justify-center h-7 w-7 rounded-full bg-[#8F8F8F] mr-1">
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
                        {t("landingPage.navbar.viewProfile")}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => navigate("/help")}
                        className="cursor-pointer"
                      >
                        {t("landingPage.navbar.helpCenter")}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="cursor-pointer"
                        onClick={() => navigate("/user/feedback")}
                      >
                        {t("landingPage.navbar.giveFeedback")}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <SelectLanguages />
                  <button
                    onClick={() => navigate("/user/notifications")}
                    className="relative hidden sm:flex items-center space-x-2 text-[#404040] hover:text-black transition-colors duration-200 rounded-full hover:bg-gray-200 p-2"
                  >
                    <BellIcon className="h-5 w-5" />
                    {unreadCount > 0 && (
                      <span className="absolute w-[8px] h-[8px] bg-destructive rounded-full right-[9px] top-[8px]"></span>
                    )}
                  </button>
                  <button
                    onClick={handleLogout}
                    className="hidden sm:flex items-center space-x-2 text-[#404040] hover:text-black transition-colors duration-200"
                  >
                    <LogOut className="h-5 w-5" />
                    <span>{t("landingPage.navbar.logout")}</span>
                  </button>
                </>
              ) : (
                <>
                  <SelectLanguages />

                  <button
                    onClick={handleSignIn}
                    className="text-[#404040] hover:text-black transition-colors duration-200"
                  >
                    {t("landingPage.navbar.logIn")}
                  </button>
                  <button
                    onClick={handleSignUp}
                    className="bg-[#FCA311] hover:bg-[#e5940c] text-black px-6 py-3 rounded-xl text-sm transition-colors duration-200"
                  >
                    {t("landingPage.navbar.getStarted")}
                  </button>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="flex lg:hidden items-center gap-x-6">
              <div className="flex items-center space-x-2">
                <SelectLanguageModal />
              </div>
              <button
                onClick={() => setIsDrawerOpen(!isDrawerOpen)}
                className="text-gray-700 focus:outline-none"
              >
                <Menu className="h-6 w-6" />
              </button>
            </div>
          </div>
        </nav>
      </header>

      {/* Mobile Drawer - Moved outside of header to be independent */}
      <div
        className={`fixed inset-0 z-[150] ${
          isDrawerOpen ? "pointer-events-auto" : "pointer-events-none"
        }`}
      >
        {/* Overlay */}
        <div
          className={`absolute inset-0 bg-black/20 transition-opacity duration-300 ${
            isDrawerOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setIsDrawerOpen(false)}
        ></div>

        {/* Drawer */}
        <div
          ref={drawerRef}
          className={`absolute right-0 top-0 bottom-0 w-full sm:w-[380px] bg-white mobile-drawer transition-transform duration-300 ${
            isDrawerOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="mobile-drawer-content">
            <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-white sticky top-0 z-10">
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

            <div className="flex-1 overflow-y-auto bg-white">
              <div className="px-6 py-8">
                <div className="flex flex-col space-y-6">
                  {navLinks.map(({ href, label }) => (
                    <Link
                      key={href}
                      to={href}
                      className={`text-base ${
                        isActivePath(href)
                          ? "text-black font-medium"
                          : "text-gray-700"
                      }`}
                      onClick={() => setIsDrawerOpen(false)}
                    >
                      {label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-100 bg-white sticky bottom-0 z-10">
              {isAuthenticated ? (
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-xl text-gray-700 border border-gray-300 hover:bg-gray-100 transition-colors duration-200"
                >
                  <LogOut className="h-5 w-5" />
                  <span>{t("landingPage.navbar.logout")}</span>
                </button>
              ) : (
                <div className="space-y-4">
                  <button
                    onClick={handleSignIn}
                    className="w-full px-4 py-3 rounded-xl text-gray-700 border border-gray-300 hover:bg-gray-100 transition-colors duration-200"
                  >
                    {t("landingPage.navbar.logIn")}
                  </button>
                  <button
                    onClick={handleSignUp}
                    className="w-full px-4 py-3 bg-[#FCA311] hover:bg-[#e5940c] text-black rounded-xl transition-colors duration-200"
                  >
                    {t("landingPage.navbar.getStarted")}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
