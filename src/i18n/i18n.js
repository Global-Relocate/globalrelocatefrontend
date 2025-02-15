import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import HttpBackend from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";

i18n
  .use(HttpBackend) // Load translations from files
  .use(LanguageDetector) // Detect user language
  .use(initReactI18next) // Pass i18n instance to react-i18next
  .init({
    fallbackLng: "en", // Default language
    lng: "en", // Initial language
    debug: true, // Enable debugging for development
    backend: {
      loadPath: "/i18n/{{lng}}.json", // Translation file path
    },
    interpolation: {
      escapeValue: false, // React already escapes values
    },
  });

export default i18n;
