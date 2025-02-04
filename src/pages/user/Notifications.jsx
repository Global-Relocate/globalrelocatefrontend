import { useState } from "react";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import FilterButton from "@/components/utils/FilterButton";
import AllNotificationsTab from "@/components/profile/tabs/AllNotificationsTab";
import MentionsTab from "@/components/profile/tabs/MentionsTab";
import FollowingTab from "@/components/profile/tabs/FollowingTab";

function Notifications() {
  const [activeTab, setActiveTab] = useState('all');

  const renderContent = () => {
    switch (activeTab) {
      case 'all':
        return <AllNotificationsTab />;
      case 'mentions':
        return <MentionsTab />;
      case 'following':
        return <FollowingTab />;
      default:
        return null;
    }
  };

  return (
    <DashboardLayout>
      <div className="w-full flex-wrap gap-y-5 items-center justify-between flex mb-6">
        <h2 className="text-3xl font-medium">Notifications</h2>
      </div>

      {/* Tabs */}
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
      </div>

      {/* Content */}
      {renderContent()}
    </DashboardLayout>
  );
}

export default Notifications;
