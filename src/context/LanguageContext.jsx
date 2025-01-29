import { createContext, useState, useContext, useEffect } from 'react';

const STORAGE_KEY = 'selectedLanguage';

const defaultLanguage = {
  code: 'eng',
  name: 'English',
  country: 'US'
};

export const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [selectedLanguage, setSelectedLanguage] = useState(() => {
    const savedLanguage = localStorage.getItem(STORAGE_KEY);
    return savedLanguage ? JSON.parse(savedLanguage) : defaultLanguage;
  });

  const updateLanguage = (language) => {
    setSelectedLanguage(language);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(language));
  };

  return (
    <LanguageContext.Provider value={{ selectedLanguage, updateLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
