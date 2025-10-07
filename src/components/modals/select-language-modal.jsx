import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/context/LanguageContext";
import { CircleFlag } from "react-circle-flags";
import { LanguageDropdown } from "../ui/language-dropdown";

const SelectLanguageModal = () => {
  const { t, i18n } = useTranslation();
  const { selectedLanguage, updateLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const handleLanguageChange = (language) => {
    updateLanguage(language);
    i18n.changeLanguage(language.code);
    setIsOpen(false);
  };

  useEffect(() => {
    if (selectedLanguage) {
      i18n.changeLanguage(selectedLanguage.code);
    }
  }, []);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <div className="flex items-center space-x-2 cursor-pointer">
          <div className="w-5 h-5 rounded-full overflow-hidden">
            <CircleFlag
              countryCode={selectedLanguage?.country?.toLowerCase() || "de"}
              height={20}
            />
          </div>
          <span className="text-sm">
            {selectedLanguage?.code?.toUpperCase() || "DEU"}
          </span>
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {t("userDashboard.settings.selectLanguage")}
          </DialogTitle>
        </DialogHeader>

        <div className="mt-10">
          <p className="text-sm text-gray-700 mb-2">
            {t("userDashboard.settings.chooseLanguage")}
          </p>
          <LanguageDropdown
            value={selectedLanguage?.code}
            onChange={handleLanguageChange}
            placeholder={selectedLanguage?.name || "Select language"}
            className="focus:border-[#FCA311] hover:border-[#FCA311] h-10"
          />
        </div>
        <div className="mt-6">
          <Button
            onClick={() => setIsOpen(false)}
            className="w-full h-[40px] bg-[#FCA311] text-black hover:text-white"
          >
            {t("drawers.selectLanguages.confirm")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SelectLanguageModal;
