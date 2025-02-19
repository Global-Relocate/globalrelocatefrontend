import { LanguageDropdown } from "@/components/ui/language-dropdown";
import { useLanguage } from "@/context/LanguageContext";

const PreferencesTab = () => {
  const { selectedLanguage, updateLanguage } = useLanguage();

  const handleLanguageChange = (language) => {
    updateLanguage(language);
  };

  return (
    <div className="px-8 py-6">
      <h2 className="text-xl font-medium mb-8 text-left">Preferences</h2>
      
      <div>
        <h3 className="text-sm text-gray-600 mb-2">Language</h3>
        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-600">Choose a language</p>
          <LanguageDropdown
            value={selectedLanguage?.code}
            onChange={handleLanguageChange}
            placeholder={selectedLanguage?.name || "Select language"}
            className="w-[180px]"
            height="h-8"
          />
        </div>
      </div>
    </div>
  );
};

export default PreferencesTab;
