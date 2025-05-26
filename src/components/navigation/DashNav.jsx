import { GiHamburgerMenu } from "react-icons/gi";
import { IoMdClose } from "react-icons/io";
import SelectLanguages from "../drawers/SelectLanguages";
import logo from "../../assets/svg/logo.svg";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { IoChevronDownOutline } from "react-icons/io5";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { LuUserRound } from "react-icons/lu";
import AccountSettings from "../../pages/user/account-settings";
import PropTypes from "prop-types";
import { getUserProfile } from "@/services/api";
import { BellIcon, LogOut } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useTranslation } from "react-i18next";
import { useNotifications } from "@/context/NotificationsContext";

function DashNav({ navState, setNavState }) {
  const { t } = useTranslation();
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const { unreadCount } = useNotifications();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [profilePic, setProfilePic] = useState(null);
  const displayName = user?.username || user?.name || "User";

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

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const quickLinks = [
    { href: "/", label: t("landingPage.navbar.home") },
    { href: "/user/countries", label: t("landingPage.navbar.countriesData") },
    { href: "/user/tax-calculator", label: t("landingPage.navbar.tools") },
    { href: "/upgrade", label: t("landingPage.navbar.pricing") },
  ];

  return (
    <div className="flex justify-between items-center h-20 px-5 bg-white text-black w-full fixed z-50 top-0">
      <div className="flex items-center justify-center gap-8 w-full">
        <div className="flex items-center">
          <div className="mr-2 block sm:hidden">
            {!navState ? (
              <GiHamburgerMenu
                className="cursor-pointer"
                onClick={() => setNavState(true)}
              />
            ) : (
              <IoMdClose
                className="cursor-pointer"
                onClick={() => setNavState(false)}
              />
            )}
          </div>
          <Link to="/" className="flex items-center">
            <img
              src={logo}
              alt="Global relocate logo"
              className="h-12 hidden sm:block ml-5"
            />
          </Link>
        </div>

        {/* Quick Links - Centered */}
        <div className="hidden md:flex items-center justify-center flex-1">
          {quickLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={`text-sm transition-colors duration-200 px-4 ${
                location.pathname === link.href
                  ? "text-black"
                  : "text-[#404040] hover:text-black"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right side items */}
        <div className="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center justify-start space-x-1 p-2 rounded-3xl cursor-pointer hover:bg-gray-100 outline-none">
              <div className="flex text-white items-center justify-center h-7 w-7 rounded-full bg-[#8F8F8F] overflow-hidden">
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
              <DropdownMenuItem
                onClick={() => navigate("/privacy")}
                className="cursor-pointer"
              >
                {t("landingPage.navbar.privacyPolicy")}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="cursor-pointer font-bold"
                onClick={() => navigate("/upgrade")}
              >
                {t("landingPage.navbar.upgradePlan")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <SelectLanguages />

          {/* Logout Button - Desktop */}
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
            <span>{t("Logout")}</span>
          </button>

          {/* Logout Button - Mobile */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={handleLogout}
                  className="sm:hidden flex items-center justify-center p-2 text-[#404040] hover:text-black transition-colors duration-200"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <span>{t("Logout")}</span>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
      <AccountSettings open={isSettingsOpen} onOpenChange={setIsSettingsOpen} />
    </div>
  );
}

DashNav.propTypes = {
  navState: PropTypes.bool.isRequired,
  setNavState: PropTypes.func.isRequired,
};

export default DashNav;
