import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { LuUserRound } from 'react-icons/lu';
import { BiEdit } from 'react-icons/bi';
import { showToast } from '@/components/ui/toast';
import { updateUserProfile } from '@/services/api';

const STORAGE_KEY = 'profileData';

const ProfileTab = ({ user, setUser, onOpenChange, activeTab, profileData, onProfileUpdate }) => {
  // Initialize state with values from profileData or localStorage
  const [formData, setFormData] = useState(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      return JSON.parse(savedData);
    }
    return {
      fullName: profileData?.fullName || user?.fullName || '',
      username: profileData?.username || user?.username || '',
      bio: profileData?.bio || '',
      country: profileData?.country || user?.country || ''
    };
  });

  // Update form data when profileData changes
  useEffect(() => {
    if (profileData) {
      setFormData({
        fullName: profileData.fullName || '',
        username: profileData.username || '',
        bio: profileData.bio || '',
        country: profileData.country || ''
      });
    }
  }, [profileData]);

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showUnsavedWarning, setShowUnsavedWarning] = useState(false);

  // Check for unsaved changes whenever form data changes or tab switches
  useEffect(() => {
    const hasUnsavedChanges = Object.keys(formData).some(
      key => formData[key] !== (profileData?.[key] || '')
    );
    
    setShowUnsavedWarning(hasUnsavedChanges);
    setIsEditing(hasUnsavedChanges);
  }, [formData, profileData, activeTab]);

  // Save form state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
  }, [formData]);

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateUserProfile(formData);
      
      // Update user context and profile data
      setUser(prev => ({
        ...prev,
        ...formData
      }));
      
      // Fetch updated profile data
      await onProfileUpdate();

      setIsEditing(false);
      setShowUnsavedWarning(false);
      onOpenChange(false);

      showToast({ 
        message: 'Your profile has been updated successfully',
        type: 'success'
      });
    } catch (error) {
      showToast({ 
        message: error.message || 'Failed to update profile',
        type: 'error'
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    // Reset form to profile data
    if (profileData) {
      setFormData({
        fullName: profileData.fullName || '',
        username: profileData.username || '',
        bio: profileData.bio || '',
        country: profileData.country || ''
      });
    }
    setIsEditing(false);
    setShowUnsavedWarning(false);
    onOpenChange(false);
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
            value={formData.fullName}
            onChange={(e) => handleChange('fullName', e.target.value)}
            placeholder="Add name"
            className="focus:border-black"
          />
        </div>

        <div className="space-y-2">
          <h3 className="text-sm text-gray-600">Username</h3>
          <Input
            value={formData.username}
            onChange={(e) => handleChange('username', e.target.value)}
            placeholder="Add username"
            className="focus:border-black"
          />
        </div>

        <div className="space-y-2">
          <h3 className="text-sm text-gray-600">Bio</h3>
          <textarea
            value={formData.bio}
            onChange={(e) => handleChange('bio', e.target.value)}
            className="w-full p-2 border-2 rounded-lg min-h-24 text-sm resize-none focus:border-black focus:outline-none placeholder-gray-500"
            placeholder="Write something about yourself..."
          />
        </div>

        <div className="space-y-2">
          <h3 className="text-sm text-gray-600">Country</h3>
          <Input
            value={formData.country}
            onChange={(e) => handleChange('country', e.target.value)}
            placeholder="Add your country"
            className="focus:border-black placeholder-gray-500"
          />
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white w-full">
        <div className="border-t border-gray-300 w-full" />
        <div className="flex justify-between items-center max-w-2xl mx-auto mb-2 px-8 py-2">
          <div className="flex-grow">
            {showUnsavedWarning && (
              <div className="text-red-500 text-sm">
                You have unsaved changes
              </div>
            )}
          </div>
          <div className="flex gap-3">
            <Button 
              variant="default"
              className={!isEditing ? 'bg-gray-600 cursor-not-allowed' : 'bg-black'}
              disabled={!isEditing || isSaving}
              onClick={handleSave}
            >
              {isSaving ? (
                <div className="flex items-center">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Saving...
                </div>
              ) : (
                'Save changes'
              )}
            </Button>
            <Button
              variant="outline"
              onClick={handleCancel}
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
      <div className="mb-10" />
    </div>
  );
};

ProfileTab.propTypes = {
  user: PropTypes.shape({
    fullName: PropTypes.string,
    username: PropTypes.string,
    country: PropTypes.string
  }),
  setUser: PropTypes.func.isRequired,
  onOpenChange: PropTypes.func.isRequired,
  activeTab: PropTypes.string,
  profileData: PropTypes.shape({
    fullName: PropTypes.string,
    username: PropTypes.string,
    bio: PropTypes.string,
    country: PropTypes.string
  }),
  onProfileUpdate: PropTypes.func.isRequired
};

ProfileTab.defaultProps = {
  user: {},
  activeTab: 'Profile',
  profileData: null
};

export default ProfileTab;
