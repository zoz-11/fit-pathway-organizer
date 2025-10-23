import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import enTranslations from "./translations/en.json";
import arTranslations from "./translations/ar.json";

interface LanguageContextType {
  language: string;
  setLanguage: (language: string) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined,
);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};

interface LanguageProviderProps {
  children: ReactNode;
}

const translations: Record<string, Record<string, string | Record<string, string>>> = {
  en: enTranslations,
  ar: arTranslations,
};

export const LanguageProvider: React.FC<LanguageProviderProps> = ({
  children,
}) => {
  const [language, setLanguage] = useState<string>("en");
  const [isRTL, setIsRTL] = useState<boolean>(false);

  useEffect(() => {
    const savedLanguage = localStorage.getItem("language") || "en";
    setLanguage(savedLanguage);
    setIsRTL(savedLanguage === "ar");
  }, []);

  useEffect(() => {
    localStorage.setItem("language", language);
    setIsRTL(language === "ar");
    document.documentElement.lang = language;
    document.documentElement.dir = isRTL ? "rtl" : "ltr";
  }, [language, isRTL]);

  const t = (key: string): string => {
    // Support nested keys with dot notation (e.g., "common.welcome")
    const keys = key.split('.');
    let value: any = translations[language];
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        return key; // Return key if translation not found
      }
    }
    
    return typeof value === 'string' ? value : key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
