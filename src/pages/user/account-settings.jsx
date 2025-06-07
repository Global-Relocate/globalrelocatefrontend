import { useState, useContext, useEffect } from "react";
import PropTypes from "prop-types";
import { AuthContext } from "@/context/AuthContextExport";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import ProfileTab from "../../components/user-tabs/profile-tab";
import AccountTab from "../../components/user-tabs/account-tab";
// import PreferencesTab from "../../components/user-tabs/preferences-tab";
import FilterButton from "@/components/user-buttons/FilterButton";
import { getUserProfile } from "@/services/api";
import { useTranslation } from "react-i18next";

const AccountSettings = ({ open, onOpenChange }) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("profile");
  const { user, setUser } = useContext(AuthContext);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [profileData, setProfileData] = useState(null);

  const fetchProfileData = async () => {
    try {
      const response = await getUserProfile();
      if (response.success) {
        setProfileData(response.data);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  useEffect(() => {
    if (open && activeTab === t("userDashboard.settings.profile")) {
      fetchProfileData();
    }
  }, [open, activeTab]);

  const tabs = ["profile", "account"]; // "preferences"];

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className="h-[90vh] rounded-t-[40px] p-0 shadow-[0_-4px_25px_-5px_rgba(0,0,0,0.3)]"
      >
        <SheetHeader className="px-8 pt-6 pb-4 border-b">
          <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0">
            <SheetTitle className="font-medium text-md text-left md:mr-8">
              {t("userDashboard.settings.accountSettings")}
            </SheetTitle>
            <div className="flex max-[350px]:flex-col max-[350px]:space-y-2 flex-row justify-center gap-2 md:mx-auto">
              {tabs.map((tab) => (
                <FilterButton
                  key={tab}
                  title={t(`userDashboard.settings.${tab}`)}
                  isActive={activeTab === tab}
                  onClick={() => setActiveTab(tab)}
                />
              ))}
            </div>
          </div>
        </SheetHeader>

        <div className="h-[calc(90vh-5rem)] overflow-y-auto">
          <div className="max-w-2xl mx-auto py-6">
            {activeTab === "profile" && (
              <ProfileTab
                user={user}
                setUser={setUser}
                onOpenChange={onOpenChange}
                profileData={profileData}
                onProfileUpdate={fetchProfileData}
              />
            )}
            {activeTab === "account" && (
              <AccountTab
                user={user}
                showDeleteModal={showDeleteModal}
                setShowDeleteModal={setShowDeleteModal}
              />
            )}
            {/*activeTab === "preferences" && <PreferencesTab />*/}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

AccountSettings.propTypes = {
  open: PropTypes.bool.isRequired,
  onOpenChange: PropTypes.func.isRequired,
};

export default AccountSettings;
