import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import enTranslations from "./translations/en.json";
import arTranslations from "./translations/ar.json";

interface LanguageContextType {
  language: string;
  setLanguage: (language: string) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
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

const translations: Record<string, Record<string, any>> = {
  en: enTranslations,
  ar: arTranslations,
};

export const LanguageProvider: React.FC<LanguageProviderProps> = ({
  children,
}) => {
  const [language, setLanguage] = useState<string>("en");

  // Load language from localStorage on initial render
  useEffect(() => {
    const savedLanguage = localStorage.getItem("language");
    if (
      savedLanguage &&
      (savedLanguage === "en" ||
        savedLanguage === "ar")
    ) {
      setLanguage(savedLanguage);
    }
  }, []);

  // Save language to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("language", language);
    // Update document direction for RTL languages
    if (language === "ar") {
      document.documentElement.setAttribute("dir", "rtl");
      document.documentElement.setAttribute("lang", "ar");
    } else {
      document.documentElement.setAttribute("dir", "ltr");
      document.documentElement.setAttribute("lang", language);
    }
  }, [language]);

  const t = (key: string, params?: Record<string, string | number>): string => {
    // Support nested keys with dot notation
    const keys = key.split('.');
    let value: any = translations[language];
    
    for (const k of keys) {
      if (value && typeof value === 'object') {
        value = value[k];
      } else {
        value = undefined;
        break;
      }
    }
    
    // Fallback to English if not found
    if (!value) {
      let enValue: any = translations["en"];
      for (const k of keys) {
        if (enValue && typeof enValue === 'object') {
          enValue = enValue[k];
        } else {
          enValue = undefined;
          break;
        }
      }
      value = enValue;
    }
    
    // If still not found, return the key
    if (!value) {
      return key;
    }
    
    // Interpolate parameters if provided
    if (params && typeof value === 'string') {
      return value.replace(/\{([^}]+)\}/g, (match, paramKey) => {
        const paramValue = params[paramKey];
        return paramValue !== undefined ? String(paramValue) : match;
      });
    }
    
    return String(value);
  };

  const value = {
    language,
    setLanguage: (newLanguage: string) => {
      if (
        newLanguage === "en" ||
        newLanguage === "ar"
      ) {
        setLanguage(newLanguage);
      }
    },
    t,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};
