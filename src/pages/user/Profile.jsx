import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
// import FilterButton from "@/components/user-buttons/FilterButton";
import { ArrowLeft, MapPin } from "lucide-react";
import { LuUserRound } from "react-icons/lu";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import AccountSettings from "./account-settings";
// import PostsTab from '@/components/profile/tabs/PostsTab';
// import CommentsTab from '@/components/profile/tabs/CommentsTab';
// import BookmarksTab from '@/components/profile/tabs/BookmarksTab';
import { getUserProfile } from "@/services/api";
import { showToast } from "@/components/ui/toast";
import { useTranslation } from "react-i18next";
import PageLoader from "@/components/loaders/PageLoader";

const Profile = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("posts");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [subscriptionMessage, setSubscriptionMessage] = useState("");

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await getUserProfile();
      if (!response.success && response.message) {
        setSubscriptionMessage(response.message);
        setProfileData(null);
      } else {
        setProfileData(response.data);
        setSubscriptionMessage("");
      }
    } catch (error) {
      showToast({
        message: error.message || "Failed to fetch profile data",
        type: "error",
      });
      setProfileData(null);
    } finally {
      setIsLoading(false);
    }
  };

  // const renderContent = () => {
  //   switch (activeTab) {
  //     case 'posts':
  //       return <PostsTab />;
  //     case 'comments':
  //       return <CommentsTab />;
  //     case 'bookmarks':
  //       return <BookmarksTab />;
  //     default:
  //       return null;
  //   }
  // };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto px-4">
        {isLoading ? (
          <PageLoader />
        ) : (
          <>
            <div className="flex items-center gap-4 py-6">
              <button onClick={() => navigate(-1)}>
                <ArrowLeft className="h-6 w-6" />
              </button>
              <h1 className="text-2xl font-semibold">
                {t("userDashboard.settings.profile")}
              </h1>
            </div>

            {/* Profile Card */}
            <div className="bg-[#F8F7F7] rounded-2xl p-6 mb-8 border border-[#D4D4D4]">
              <div className="flex justify-between items-start mb-6">
                <div className="flex flex-col items-start gap-4">
                  {/* Avatar Section */}
                  <div className="relative">
                    <div className="h-16 w-16 rounded-full bg-[#8F8F8F] flex items-center justify-center hover:bg-[#7F7F7F] transition-colors overflow-hidden">
                      {profileData?.profilePic ? (
                        <img
                          src={profileData.profilePic}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <LuUserRound className="h-8 w-8 text-white" />
                      )}
                    </div>
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold">
                      {profileData?.fullName ??
                        t("userDashboard.settings.addName")}
                    </h2>
                    <p className="text-gray-600">
                      @
                      {profileData?.username ??
                        t("userDashboard.settings.addUsername")}
                    </p>
                  </div>
                </div>
                <Button
                  variant="outlineBlack"
                  size="md"
                  onClick={() => setIsSettingsOpen(true)}
                >
                  {t("userDashboard.settings.editProfile")}
                </Button>
              </div>
              {subscriptionMessage && (
                <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-800">
                  {subscriptionMessage}
                </div>
              )}
              <p className="mb-4">
                {profileData?.bio || t("userDashboard.settings.addBio")}
              </p>
              <div className="flex items-center gap-2 text-gray-600">
                <MapPin className="h-4 w-4" />
                <span>
                  {profileData?.country ||
                    t("userDashboard.settings.addLocation")}
                </span>
              </div>
            </div>

            {/* Tabs */}
            {/* <div className="flex gap-4 mb-6">
          <FilterButton
            title="Posts"
            isActive={activeTab === 'posts'}
            onClick={() => setActiveTab('posts')}
          />
          <FilterButton
            title="Comments"
            isActive={activeTab === 'comments'}
            onClick={() => setActiveTab('comments')}
          />
          <FilterButton
            title="Bookmarks"
            isActive={activeTab === 'bookmarks'}
            onClick={() => setActiveTab('bookmarks')}
          />
        </div> */}

            {/* Content */}
            {/* {renderContent()} */}

            {/* Account Settings Modal */}
            <AccountSettings
              open={isSettingsOpen}
              onOpenChange={setIsSettingsOpen}
              onProfileUpdate={fetchUserProfile}
              profileData={profileData}
            />
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Profile;
