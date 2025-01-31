import { AppSidebar } from "@/components/navigation/AppSidebar";
import { SidebarInset } from "@/components/ui/sidebar";
import { Outlet } from "react-router-dom";
import { useState } from "react";
import SidebarNav from "@/components/navigation/SidebarNav";
import AccountSettings from "@/pages/user/AccountSettings";
import { useSidebar } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

export default function DashboardLayout() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const { state } = useSidebar();
  const isExpanded = state === "expanded";

  return (
    <>
      <AppSidebar />
      <SidebarInset>
        <SidebarNav onSettingsOpen={setIsSettingsOpen} />
        <div className="flex-1 overflow-y-auto">
          <div 
            className={cn(
              "container mx-auto py-8 max-w-7xl transition-all duration-200",
              isExpanded ? "px-8" : "px-4"
            )}
          >
            <Outlet />
          </div>
        </div>
      </SidebarInset>
      <AccountSettings open={isSettingsOpen} onOpenChange={setIsSettingsOpen} />
    </>
  );
}
