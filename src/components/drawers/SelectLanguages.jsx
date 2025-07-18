import { LanguageDropdown } from "@/components/ui/language-dropdown";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { CircleFlag } from "react-circle-flags";
import { useLanguage } from "@/context/LanguageContext";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";

const SelectLanguages = () => {
  const { t, i18n } = useTranslation();
  const { selectedLanguage, updateLanguage } = useLanguage();
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const handleLanguageChange = (language) => {
    updateLanguage(language);
    i18n.changeLanguage(language.code);
    setIsSheetOpen(false);
  };

  useEffect(() => {
    if (selectedLanguage) {
      i18n.changeLanguage(selectedLanguage.code);
    }
  }, []);

  return (
    <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
      <SheetTrigger onClick={() => setIsSheetOpen(true)}>
        <div className="flex items-center space-x-2 cursor-pointer">
          <div className="w-5 h-5 rounded-full overflow-hidden">
            <CircleFlag
              countryCode={selectedLanguage?.country?.toLowerCase() || "us"}
              height={20}
            />
          </div>
          <span className="text-sm">
            {selectedLanguage?.code?.toUpperCase() || "ENG"}
          </span>
        </div>
      </SheetTrigger>
      <SheetContent>
        <div className="pt-2">
          <SheetHeader className=" pb-4">
            <SheetTitle className="text-left">
              {t("userDashboard.settings.selectLanguage")}
            </SheetTitle>
          </SheetHeader>
        </div>
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
            onClick={() => setIsSheetOpen(false)}
            className="w-full h-[40px] bg-[#FCA311] text-black hover:text-white"
          >
            {t("drawers.selectLanguages.confirm")}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default SelectLanguages;
