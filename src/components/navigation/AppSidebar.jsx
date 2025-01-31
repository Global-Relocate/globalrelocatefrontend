import { useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { AuthContext } from "@/context/AuthContext";
import { useFavorites } from "@/context/favorites-context";
import { LuUserRound } from "react-icons/lu";
import CountdownTimer from '../common/CountdownTimer';
import { userSidebarItems } from "@/fakeDataStore";
import logo from "../../assets/svg/logo.svg";
import sidebarLogo from "../../assets/svg/sidebarlogo.svg";
import { cn } from "@/lib/utils";

import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarMenuButton,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";

const sidebarMenuButtonVariants = {
  default: "flex w-full items-center gap-2 rounded-lg px-3 py-2 hover:bg-accent text-sm font-medium transition-colors",
  active: "bg-accent text-accent-foreground",
};

export function AppSidebar() {
  const location = useLocation();
  const { favorites } = useFavorites();
  const { state } = useSidebar();

  const isExpanded = state === "expanded";

  return (
    <Sidebar collapsible="icon" className="border-r">
      <SidebarHeader className="border-b border-white">
        <div className={cn(
          "flex items-center justify-between py-2",
          isExpanded ? "px-4" : "pl-0 pr-2"
        )}>
          <img 
            src={isExpanded ? logo : sidebarLogo} 
            alt="logo" 
            className={isExpanded ? "w-36" : "w-9 min-w-[2.3rem]"}
          />
          {isExpanded && <SidebarTrigger />}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          {userSidebarItems.map((item) => {
            const isActive = location.pathname.includes(item.activeKey);
            return (
              <Link key={item.path} to={item.path}>
                <SidebarMenuButton
                  isActive={isActive}
                  tooltip={item.title}
                  className={`${sidebarMenuButtonVariants.default} ${
                    isActive ? sidebarMenuButtonVariants.active : ""
                  }`}
                >
                  <img
                    src={isActive && item.activeIcon ? item.activeIcon : item.icon}
                    className="h-5 w-5"
                    alt=""
                  />
                  <span>{item.title}</span>
                  {item.title === "Favorites" && favorites.length > 0 && (
                    <span className="ml-auto rounded-md bg-primary/10 px-2 py-0.5 text-xs">
                      {favorites.length}
                    </span>
                  )}
                </SidebarMenuButton>
              </Link>
            );
          })}
          {!isExpanded && (
            <SidebarMenuButton
              className={`${sidebarMenuButtonVariants.default} mt-4`}
            >
              <SidebarTrigger className="h-5 w-5" />
            </SidebarMenuButton>
          )}
        </SidebarGroup>
      </SidebarContent>

      <div className={cn(
        "transition-opacity duration-200",
        isExpanded ? "opacity-100 delay-150" : "opacity-0"
      )}>
        {isExpanded && (
          <SidebarFooter className="border-t border-white mt-auto">
            <div className="p-4 min-w-[240px]">
              <div className="rounded-lg bg-accent p-4">
                <h3 className="mb-2 text-base font-medium whitespace-nowrap">Try Pro</h3>
                <p className="mb-4 text-sm text-muted-foreground whitespace-normal">
                  You are currently in free plan valid for 3 days. Upgrade now to keep using Global Relocate.
                </p>
                <div className="mb-4">
                  <CountdownTimer />
                </div>
                <Link
                  to="/upgrade"
                  className="flex w-full items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                >
                  Learn More
                </Link>
              </div>
            </div>
          </SidebarFooter>
        )}
      </div>
    </Sidebar>
  );
} 
