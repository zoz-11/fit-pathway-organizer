/**
 * i18n Translation System
 * Provides functions for internationalization and localization
 */
export type TranslationData = Record<string, any>;
export type LanguageCode = 'en' | 'es' | 'ar';
export type TranslationParams = Record<string, string | number>;
/**
 * Get a nested value from an object using dot notation
 * @param obj - The object to search in
 * @param key - The dot-separated key path
 * @returns The value at the specified path, or undefined if not found
 */
export declare function getNestedValue(obj: any, key: string): any;
/**
 * Interpolate string template with parameters
 * @param template - The template string with placeholders like {param}
 * @param params - Object containing parameter values
 * @returns The interpolated string
 */
export declare function interpolateString(template: string, params: TranslationParams): string;
/**
 * Get a translation for a specific language and key
 * @param lang - The language code
 * @param key - The translation key (can use dot notation)
 * @param translations - The translations object
 * @param params - Optional parameters for interpolation
 * @returns The translated string, or the key if translation not found
 */
export declare function getTranslation(lang: LanguageCode, key: string, translations: Record<LanguageCode, TranslationData>, params?: TranslationParams): string;
