import React, { useState, useContext } from 'react';
import { AuthContext } from '@/context/AuthContext';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { LuUserRound } from 'react-icons/lu';
import { BiEdit } from 'react-icons/bi';
import FilterButton from '@/components/utils/FilterButton';
import { ChevronDown } from "lucide-react";
import DeleteAccountModal from '@/components/modals/DeleteAccountModal';

// Profile Tab Component
const ProfileTab = ({ user, setUser, onOpenChange }) => {
  const [editedName, setEditedName] = useState(user?.name || '');
  const [editedUsername, setEditedUsername] = useState(user?.username || '');
  const [editedBio, setEditedBio] = useState('');
  const [editedLocation, setEditedLocation] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [originalValues, setOriginalValues] = useState({
    name: user?.name || '',
    username: user?.username || '',
    bio: '',
    location: ''
  });

  const handleChange = (e, setter) => {
    const newValue = e.target.value;
    setter(newValue);
    // Only set isEditing to true if any field is different from its original value
    const currentValues = {
      name: setter === setEditedName ? newValue : editedName,
      username: setter === setEditedUsername ? newValue : editedUsername,
      bio: setter === setEditedBio ? newValue : editedBio,
      location: setter === setEditedLocation ? newValue : editedLocation
    };
    
    setIsEditing(
      currentValues.name !== originalValues.name ||
      currentValues.username !== originalValues.username ||
      currentValues.bio !== originalValues.bio ||
      currentValues.location !== originalValues.location
    );
  };

  return (
    <div className="flex flex-col h-full relative">
      <div className="flex-1 space-y-8 px-8 py-6 overflow-y-auto pb-20">
        <h2 className="text-xl font-medium text-left">Profile</h2>
        
        <div className="flex items-center justify-between">
          <h3 className="text-sm text-gray-600">Avatar</h3>
          <div className="relative">
            <div className="h-16 w-16 rounded-full bg-[#8F8F8F] flex items-center justify-center hover:bg-[#7F7F7F] transition-colors duration-200">
              <LuUserRound className="h-8 w-8 text-white" />
            </div>
            <div className="absolute -right-1 -bottom-1">
              <button className="p-1 bg-white rounded-md shadow-md border hover:bg-gray-50">
                <BiEdit className="h-3 w-3" />
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-sm text-gray-600">Full Name</h3>
          <Input
            value={editedName}
            onChange={(e) => handleChange(e, setEditedName)}
            placeholder="Add name"
            className="focus:border-black"
          />
        </div>

        <div className="space-y-2">
          <h3 className="text-sm text-gray-600">Username</h3>
          <Input
            value={editedUsername}
            onChange={(e) => handleChange(e, setEditedUsername)}
            placeholder="Add username"
            className="focus:border-black"
          />
        </div>

        <div className="space-y-2">
          <h3 className="text-sm text-gray-600">Bio</h3>
          <textarea
            value={editedBio}
            onChange={(e) => handleChange(e, setEditedBio)}
            className="w-full p-2 border-2 rounded-lg min-h-24 text-sm resize-none focus:border-black focus:outline-none placeholder-gray-500"
            placeholder="Write something about yourself..."
          />
        </div>

        <div className="space-y-2">
          <h3 className="text-sm text-gray-600">Location</h3>
          <Input
            value={editedLocation}
            onChange={(e) => handleChange(e, setEditedLocation)}
            placeholder="Change your location"
            className="focus:border-black placeholder-gray-500"
          />
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white w-full">
        <div className="border-t border-gray-300 w-full" />
        <div className="flex justify-end gap-3 max-w-2xl mx-auto mb-2 px-8 py-2">
          <Button 
            variant="default"
            className={!isEditing ? 'bg-gray-300 cursor-not-allowed' : 'bg-black'}
            disabled={!isEditing}
            onClick={() => {
              // Handle save logic here
              setIsEditing(false);
              setOriginalValues({
                name: editedName,
                username: editedUsername,
                bio: editedBio,
                location: editedLocation
              });
            }}
          >
            Save changes
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              setEditedName(originalValues.name);
              setEditedUsername(originalValues.username);
              setEditedBio(originalValues.bio);
              setEditedLocation(originalValues.location);
              setIsEditing(false);
              onOpenChange(false);
            }}
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};

// Account Tab Component
const AccountTab = ({ user, showDeleteModal, setShowDeleteModal }) => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  return (
    <div className="px-8 py-6 h-full">
      <h2 className="text-xl font-medium mb-8 text-left">Account</h2>
      
      <div className="space-y-8 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 5rem)' }}>
        <div>
          <h3 className="text-sm text-gray-600 mb-2">Email Address</h3>
          <div className="flex items-center">
            <span className="text-sm">{user?.email}</span>
            <span className="ml-2 text-green-600 text-sm">(verified)</span>
          </div>
        </div>

        <div>
          <h3 className="text-sm text-gray-600 mb-2">Subscription</h3>
          <div className="flex justify-between items-start">
            <p className="text-sm text-gray-600 max-w-md p-2">
              You are currently in free plan valid for 3 days. Upgrade now to keep using Global Relocate.
            </p>
            <Button variant="default" className="bg-black">
              Learn more
            </Button>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div className="space-y-1">
            <h3 className="text-sm text-red-600">Delete account</h3>
            <p className="text-sm text-gray-600 p-2">
              Permanently delete your account and data
            </p>
          </div>
          <Button 
            variant="destructive"
            onClick={() => setIsDeleteModalOpen(true)}
          >
            Delete account
          </Button>
        </div>
      </div>

      <DeleteAccountModal 
        isOpen={isDeleteModalOpen} 
        onClose={() => setIsDeleteModalOpen(false)}
      />
    </div>
  );
};

// Preferences Tab Component
const PreferencesTab = () => (
  <div className="px-8 py-6">
    <h2 className="text-xl font-medium mb-8 text-left">Preferences</h2>
    
    <div>
      <h3 className="text-sm text-gray-600 mb-2">Language</h3>
      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-600">Choose a language</p>
        <div className="inline-flex items-center bg-gray-50 border rounded-lg px-4 py-2 cursor-pointer">
          <span className="text-sm mr-2">English</span>
          <ChevronDown className="h-4 w-4 text-gray-600" />
        </div>
      </div>
    </div>
  </div>
);

// Main Account Settings Component
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
