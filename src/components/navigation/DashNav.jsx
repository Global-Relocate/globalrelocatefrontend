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
import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { LuUserRound } from "react-icons/lu";
import AccountSettings from "../../pages/user/AccountSettings";

function DashNav({ navState, setNavState }) {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const displayName = user?.username || user?.name || "User";

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
        <div className="flex items-center">
          <img src={logo} alt="logo" className="w-36" />
        </div>
      </div>

      <div className="flex items-center space-x-3">
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center justify-start space-x-1 p-2 rounded-3xl cursor-pointer hover:bg-gray-100 outline-none">
            <div className="flex text-white items-center justify-center h-7 w-7 rounded-full bg-[#8F8F8F]">
              <LuUserRound />
            </div>
            <span className="text-xs">{displayName}</span>
            <IoChevronDownOutline className="text-gray-400" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[200px]">
            <DropdownMenuItem className="cursor-pointer"
            onClick={() => navigate("/user/profile")}>
              View profile
            </DropdownMenuItem>
            <DropdownMenuItem 
              className="cursor-pointer"
              onClick={() => setIsSettingsOpen(true)}
            >
              Account Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer">
              Give us feedback
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              Help Center
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              Privacy Policy
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer font-bold">
              Upgrade plan
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="cursor-pointer text-red-600 focus:text-red-600"
              onClick={handleLogout}
            >
              Log Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <SelectLanguages />
      </div>
      <AccountSettings open={isSettingsOpen} onOpenChange={setIsSettingsOpen} />
    </div>
  );
}

export default DashNav;
