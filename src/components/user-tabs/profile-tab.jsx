import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { LuUserRound } from 'react-icons/lu';
import { BiEdit } from 'react-icons/bi';
import { showToast } from '@/components/ui/toast';
import { updateUserProfile } from '@/services/api';
import { CountryDropdown } from "@/components/ui/country-dropdown";

const ProfileTab = ({ user, setUser, onOpenChange, profileData, onProfileUpdate }) => {
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    bio: '',
    country: '',
    countryCode: '',
    avatar: null
  });
  const [previewImage, setPreviewImage] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showUnsavedWarning, setShowUnsavedWarning] = useState(false);

  // Initialize form with profile data
  useEffect(() => {
    if (profileData || user) {
      setFormData({
        fullName: profileData?.fullName || user?.fullName || '',
        username: profileData?.username || user?.username || '',
        bio: profileData?.bio || '',
        country: profileData?.country || user?.country || '',
        countryCode: profileData?.countryCode || user?.countryCode || '',
        avatar: null
      });
      // If there's an avatar URL from the profile, set it as preview
      if (profileData?.avatarUrl) {
        setPreviewImage(profileData.avatarUrl);
      }
    }
  }, [profileData, user]);

  // Check for unsaved changes
  useEffect(() => {
    const hasUnsavedChanges = Object.keys(formData).some(
      key => key !== 'avatar' && formData[key] !== (profileData?.[key] || user?.[key] || '')
    ) || formData.avatar !== null;
    
    setShowUnsavedWarning(hasUnsavedChanges);
    setIsEditing(hasUnsavedChanges);
  }, [formData, profileData, user]);

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        showToast({
          message: 'Image size should be less than 5MB',
          type: 'error'
        });
        return;
      }

      if (!file.type.startsWith('image/')) {
        showToast({
          message: 'Please select an image file',
          type: 'error'
        });
        return;
      }

      setFormData(prev => ({
        ...prev,
        avatar: file
      }));

      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setPreviewImage(previewUrl);
    }
  };

  const handleCountryChange = (selectedCountry) => {
    setFormData(prev => ({
      ...prev,
      country: selectedCountry.name,
      countryCode: selectedCountry.alpha2
    }));
  };

  const handleSave = async () => {
    if (!formData.fullName.trim()) {
      showToast({
        message: 'Full name is required',
        type: 'error'
      });
      return;
    }

    if (!formData.username.trim()) {
      showToast({
        message: 'Username is required',
        type: 'error'
      });
      return;
    }

    setIsSaving(true);
    try {
      await updateUserProfile(formData);
      
      // Update user context and profile data
      setUser(prev => ({
        ...prev,
        ...formData,
        avatar: undefined // Remove the File object
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
    if (profileData || user) {
      setFormData({
        fullName: profileData?.fullName || user?.fullName || '',
        username: profileData?.username || user?.username || '',
        bio: profileData?.bio || '',
        country: profileData?.country || user?.country || '',
        countryCode: profileData?.countryCode || user?.countryCode || '',
        avatar: null
      });
      setPreviewImage(profileData?.avatarUrl || null);
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
            <div 
              className="h-16 w-16 rounded-full bg-[#8F8F8F] flex items-center justify-center hover:bg-[#7F7F7F] transition-colors duration-200 overflow-hidden"
            >
              {previewImage ? (
                <img 
                  src={previewImage} 
                  alt="Avatar" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <LuUserRound className="h-8 w-8 text-white" />
              )}
            </div>
            <div className="absolute -right-1 -bottom-1">
              <button 
                className="p-1 bg-white rounded-md shadow-md border hover:bg-gray-50"
                onClick={handleAvatarClick}
              >
                <BiEdit className="h-3 w-3" />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
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
          <CountryDropdown
            onChange={handleCountryChange}
            value={formData.countryCode}
            className="focus:border-black hover:border-black"
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
    country: PropTypes.string,
    countryCode: PropTypes.string,
    bio: PropTypes.string,
    avatarUrl: PropTypes.string
  }),
  setUser: PropTypes.func.isRequired,
  onOpenChange: PropTypes.func.isRequired,
  profileData: PropTypes.shape({
    fullName: PropTypes.string,
    username: PropTypes.string,
    bio: PropTypes.string,
    country: PropTypes.string,
    countryCode: PropTypes.string,
    avatarUrl: PropTypes.string
  }),
  onProfileUpdate: PropTypes.func.isRequired
};

ProfileTab.defaultProps = {
  user: null,
  profileData: null
};

export default ProfileTab;
