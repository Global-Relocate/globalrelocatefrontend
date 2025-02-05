import React, { useEffect } from "react";

const GoogleTranslate = () => {
  useEffect(() => {
    const loadGoogleTranslateScript = () => {
      // Check if the script is already loaded
      if (
        !document.querySelector(
          'script[src="//translate.google.com/translate_a/element.js"]'
        )
      ) {
        const script = document.createElement("script");
        script.type = "text/javascript";
        script.src =
          "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
        document.body.appendChild(script);
      }
    };

    const googleTranslateElementInit = () => {
      // Only initialize if the element is not already initialized
      if (
        !document.getElementById("google_translate_element").childElementCount
      ) {
        new window.google.translate.TranslateElement(
          { pageLanguage: "en" },
          "google_translate_element"
        );
      }
    };

    // Initialize callback for Google Translate
    window.googleTranslateElementInit = googleTranslateElementInit;

    // Load the script if it's not already loaded
    loadGoogleTranslateScript();

    return () => {
      const script = document.querySelector(
        'script[src="//translate.google.com/translate_a/element.js"]'
      );
      if (script) {
        document.body.removeChild(script);
      }
    };
  }, []);

  return <div id="google_translate_element"></div>;
};

export default GoogleTranslate;
