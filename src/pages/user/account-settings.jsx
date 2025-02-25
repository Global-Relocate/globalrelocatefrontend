import React, { useState, useContext } from 'react';
import { AuthContext } from '@/context/AuthContext';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import ProfileTab from '../../components/user-tabs/profile-tab';
import AccountTab from '../../components/user-tabs/account-tab';
import PreferencesTab from '../../components/user-tabs/preferences-tab';
import FilterButton from '@/components/user-buttons/FilterButton';

const AccountSettings = ({ open, onOpenChange }) => {
  const [activeTab, setActiveTab] = useState('Profile');
  const { user, setUser } = useContext(AuthContext);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const tabs = ['Profile', 'Account', 'Preferences'];

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent 
        side="bottom" 
        className="h-[90vh] rounded-t-[40px] p-0 shadow-[0_-4px_25px_-5px_rgba(0,0,0,0.3)]"
      >
        <SheetHeader className="px-8 pt-6 pb-4 border-b">
          <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0">
            <SheetTitle className="font-medium text-md text-left md:mr-8">Account settings</SheetTitle>
            <div className="flex max-[350px]:flex-col max-[350px]:space-y-2 flex-row justify-center gap-2 md:mx-auto">
              {tabs.map((tab) => (
                <FilterButton
                  key={tab}
                  title={tab}
                  isActive={activeTab === tab}
                  onClick={() => setActiveTab(tab)}
                />
              ))}
            </div>
          </div>
        </SheetHeader>
        
        <div className="h-[calc(90vh-5rem)] overflow-y-auto">
          <div className="max-w-2xl mx-auto py-6">
            {activeTab === 'Profile' && <ProfileTab user={user} setUser={setUser} onOpenChange={onOpenChange} />}
            {activeTab === 'Account' && (
              <AccountTab 
                user={user} 
                showDeleteModal={showDeleteModal}
                setShowDeleteModal={setShowDeleteModal}
              />
            )}
            {activeTab === 'Preferences' && <PreferencesTab />}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default AccountSettings;
