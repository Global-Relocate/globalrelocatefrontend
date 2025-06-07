import { useState } from "react";
import DashboardLayout from "@/components/layouts/DashboardLayout";
// import FilterButton from "@/components/user-buttons/FilterButton";
import AllNotificationsTab from "@/components/profile/tabs/AllNotificationsTab";
import MentionsTab from "@/components/profile/tabs/MentionsTab";
import FollowingTab from "@/components/profile/tabs/FollowingTab";
import { Button } from "@/components/ui/button";
import { useNotifications } from "@/context/NotificationsContext";
import { useTranslation } from "react-i18next";
import PageLoader from "@/components/loaders/PageLoader";

function Notifications() {
  const { markAsRead, deleteNotification } = useNotifications();
  const [activeTab, setActiveTab] = useState("all");
  const { t } = useTranslation();

  return (
    <DashboardLayout>
      <div className="w-full flex-wrap gap-y-5 items-center justify-between flex">
        <h1 className="text-3xl font-medium mb-6">
          {t("userDashboard.sidebar.notifications")}
        </h1>

        <div className="flex items-center gap-4 my-5">
          <Button
            className="bg-white text-black hover:bg-[#C2DFFA] rounded-3xl shadow-none border border-[#EDEBE8] transition-colors duration-200"
            onClick={() => markAsRead("all")}
          >
            <i className="fad fa-check"></i>{" "}
            {t("userDashboard.notifications.markAllAsRead")}
          </Button>
          <Button
            className="bg-white text-black hover:bg-[#C2DFFA] rounded-3xl shadow-none border border-[#EDEBE8] transition-colors duration-200"
            onClick={() => deleteNotification("all")}
          >
            <i className="fad fa-trash"></i>
            {t("userDashboard.notifications.deleteAll")}
          </Button>
        </div>

        {/* Tabs
          <div className="flex gap-4 mb-6">
            <FilterButton
              title="All"
              isActive={activeTab === 'all'}
              onClick={() => setActiveTab('all')}
            />
            <FilterButton
              title="Mentions"
              isActive={activeTab === 'mentions'}
              onClick={() => setActiveTab('mentions')}
            />
            <FilterButton
              title="Following"
              isActive={activeTab === 'following'}
              onClick={() => setActiveTab('following')}
            />
          </div> */}

        {/* Tab Content */}
        <div className="w-full">
          {activeTab === "all" && <AllNotificationsTab />}
          {activeTab === "mentions" && <MentionsTab />}
          {activeTab === "following" && <FollowingTab />}
        </div>
      </div>
    </DashboardLayout>
  );
}

export default Notifications;
