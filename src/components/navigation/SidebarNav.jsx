import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "@/context/AuthContext";
import { LuUserRound } from "react-icons/lu";
import { IoChevronDownOutline } from "react-icons/io5";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import SelectLanguages from "@/components/drawers/SelectLanguages";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function SidebarNav({ onSettingsOpen }) {
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);
  const displayName = user?.username || user?.name || "User";

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b px-4">
      <div className="flex items-center">
        <SidebarTrigger className="mr-2" />
        <div className="h-full flex items-center">
          <Separator orientation="vertical" className="h-4 bg-[#d4d4d4]" />
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
            <DropdownMenuItem 
              className="cursor-pointer"
              onClick={() => navigate("/user/profile")}
            >
              View profile
            </DropdownMenuItem>
            <DropdownMenuItem 
              className="cursor-pointer"
              onClick={() => onSettingsOpen(true)}
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
    </header>
  );
} 