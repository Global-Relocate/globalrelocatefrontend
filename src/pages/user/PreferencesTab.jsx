import { useState, useEffect } from 'react';
import { LanguageDropdown } from "@/components/ui/language-dropdown";
import { useLanguage } from "@/context/LanguageContext";
import { getUserPreferences, updateUserPreferences } from '@/services/api';
import { showToast } from '@/components/ui/toast';

const PreferencesTab = () => {
  const { selectedLanguage, updateLanguage } = useLanguage();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchUserPreferences();
  }, []);

  const fetchUserPreferences = async () => {
    try {
      const response = await getUserPreferences();
      if (response.data?.language) {
        updateLanguage(response.data.language);
      }
    } catch (error) {
      showToast({
        message: error.message || 'Failed to fetch language preferences',
        type: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLanguageChange = async (language) => {
    setIsSaving(true);
    try {
      await updateUserPreferences({ language });
      updateLanguage(language);
      showToast({
        message: 'Language preferences updated successfully',
        type: 'success'
      });
    } catch (error) {
      showToast({
        message: error.message || 'Failed to update language preferences',
        type: 'error'
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="px-8 py-6">
        <h2 className="text-xl font-medium mb-8 text-left">Preferences</h2>
        <div className="flex justify-center">
          <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="px-8 py-6">
      <h2 className="text-xl font-medium mb-8 text-left">Preferences</h2>
      
      <div>
        <h3 className="text-sm text-gray-600 mb-2">Language</h3>
        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-600">Choose a language</p>
          <div className="relative">
            <LanguageDropdown
              value={selectedLanguage?.code}
              onChange={handleLanguageChange}
              placeholder={selectedLanguage?.name || "Select language"}
              className="w-[180px]"
              height="h-8"
              disabled={isSaving}
            />
            {isSaving && (
              <div className="absolute right-10 top-1/2 transform -translate-y-1/2">
                <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreferencesTab;
