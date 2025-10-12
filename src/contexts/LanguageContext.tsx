import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface LanguageContextType {
  language: string;
  setLanguage: (language: string) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

interface LanguageProviderProps {
  children: ReactNode;
}

// Supported languages: English (en) and Arabic (ar) only
const translations: Record<string, Record<string, string>> = {
  en: {
    'settings.title': 'Settings',
    'settings.description': 'Manage your app preferences and account settings',
    'settings.language': 'Language',
    'settings.language.description': 'Choose your preferred language',
    'language.english': 'English',
    'language.arabic': 'Arabic',
    'language.changed': 'Language changed to',
    'settings.notifications': 'Notifications',
    'settings.notifications.description': 'Get notified before scheduled workouts',
    'settings.notifications.progress': 'Progress Updates',
  },
  ar: {
    'settings.title': 'الإعدادات',
    'settings.description': 'إدارة تفضيلات التطبيق وإعدادات الحساب',
    'settings.language': 'اللغة',
    'settings.language.description': 'اختر لغتك المفضلة',
    'language.english': 'الإنجليزية',
    'language.arabic': 'العربية',
    'language.changed': 'تم تغيير اللغة إلى',
    'settings.notifications': 'الإشعارات',
    'settings.notifications.description': 'تلقي إشعارات قبل التمارين المجدولة',
    'settings.notifications.progress': 'تحديثات التقدم',
  },
};

export const LanguageProvider = ({ children }: LanguageProviderProps) => {
  const [language, setLanguage] = useState<string>(() => {
    const stored = localStorage.getItem('language');
    // Fallback to 'en' if stored value is not supported
    return stored === 'en' || stored === 'ar' ? stored : 'en';
  });

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const t = (key: string) => {
    const set = translations[language] || translations.en;
    return set[key] ?? key;
  };

  const value: LanguageContextType = {
    language,
    setLanguage: (lang: string) => {
      // Only allow en or ar
      if (lang === 'en' || lang === 'ar') {
        setLanguage(lang);
      }
    },
    t,
  };

  return (
    <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
  );
};
