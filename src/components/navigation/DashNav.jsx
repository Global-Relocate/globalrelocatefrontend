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
import { Link, useNavigate } from "react-router-dom";
import { LuUserRound } from "react-icons/lu";
import AccountSettings from "../../pages/user/account-settings";
import PropTypes from "prop-types";
import { getUserProfile } from '@/services/api';
import { LogOut } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

function DashNav({ navState, setNavState }) {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
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
        console.error('Error fetching profile picture:', error);
      }
    };

    fetchProfilePic();
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="flex justify-between items-center h-20 px-5 bg-white text-black border border-[#D4D4D4] w-full shadow-sm fixed z-50 top-0">
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
          <img src={logo} alt="logo" className="w-36" />
        </Link>
      </div>

      <div className="flex items-center space-x-3">
        <DropdownMenu>
          <DropdownMenuTrigger className="hidden sm:flex items-center justify-start space-x-1 p-2 rounded-3xl cursor-pointer hover:bg-gray-100 outline-none">
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
              View profile
            </DropdownMenuItem>
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => setIsSettingsOpen(true)}
            // >
            //   Account Settings
            // </DropdownMenuItem>
            // <DropdownMenuSeparator />
            // <DropdownMenuItem
            //   className="cursor-pointer"
            //   onClick={() => navigate("/user/feedback")}
            >
              Give us feedback
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => navigate("/help")}
              className="cursor-pointer"
            >
              Help Center
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer" 
            onClick={() => navigate("/privacy")}>
              Privacy Policy
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="cursor-pointer font-bold"
              onClick={() => navigate("/upgrade")}
            >
              Upgrade plan
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="cursor-pointer text-red-600 focus:text-red-600"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Log Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <SelectLanguages />

        {/* Logout Button - Desktop */}
        <button
          onClick={handleLogout}
          className="hidden sm:flex items-center space-x-2 text-[#404040] hover:text-black transition-colors duration-200"
        >
          <LogOut className="h-5 w-5" />
          <span>Logout</span>
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
              <span>Logout</span>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
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
