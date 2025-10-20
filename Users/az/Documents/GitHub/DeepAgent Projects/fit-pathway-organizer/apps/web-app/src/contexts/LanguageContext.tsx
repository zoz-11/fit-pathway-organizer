export interface LanguageContextType {
  language: string;
  setLanguage: (language: string) => void;
  t: (key: string) => string;
}

// Re-export the interface as a type to make importing in test files explicit and convenient
export type { LanguageContextType };