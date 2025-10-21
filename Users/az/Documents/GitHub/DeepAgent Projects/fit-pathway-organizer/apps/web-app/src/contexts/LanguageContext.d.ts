export interface LanguageContextType {
    language: string;
    setLanguage: (language: string) => void;
    t: (key: string) => string;
}
export type { LanguageContextType };
