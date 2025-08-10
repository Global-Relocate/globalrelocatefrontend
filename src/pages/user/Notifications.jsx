import { useState } from "react";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import AllNotificationsTab from "@/components/profile/tabs/AllNotificationsTab";
import { Button } from "@/components/ui/button";
import { useNotifications } from "@/context/NotificationsContext";
import { useTranslation } from "react-i18next";
import NewsTab from "@/components/profile/tabs/NewsTab";

function Notifications() {
  const { markAsRead, deleteNotification } = useNotifications();
  const [activeTab, setActiveTab] = useState("all");
  const { t } = useTranslation();

  const toggleNews = () => {
    setActiveTab((prev) => (prev === "news" ? "all" : "news"));
  };

  return (
    <DashboardLayout>
      <div className="w-full flex flex-wrap gap-y-5 items-center justify-between">
        <div className="flex items-center justify-between gap-x-4 w-full">
          <h1 className="text-3xl font-medium">
            {activeTab === "all"
              ? t("userDashboard.sidebar.notifications")
              : t("userDashboard.news.title")}
          </h1>

          <div className="flex items-center gap-x-4">
            <Button
              className={`bg-white text-black ${
                activeTab === "news" ? "bg-[#C2DFFA]" : "hover:bg-[#C2DFFA]"
              } rounded-3xl shadow-none border border-[#EDEBE8] transition-colors duration-200`}
              onClick={() => toggleNews()}
            >
              <i className="fad fa-newspaper"></i>{" "}
              {t("userDashboard.news.title")}
            </Button>
            {activeTab === "all" && (
              <>
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
              </>
            )}
          </div>
        </div>

        {/* <div className="flex gap-4 mb-6">
          <FilterButton
            title="News"
            isActive={activeTab === "news"}
            onClick={() => setActiveTab("news")}
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
          {activeTab === "news" && <NewsTab />}
        </div>
      </div>
    </DashboardLayout>
  );
}

export default Notifications;
