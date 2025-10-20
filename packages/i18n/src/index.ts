/**
 * i18n Translation System
 * Provides functions for internationalization and localization
 */

// Translation data structure
export type TranslationData = Record<string, any>;

// Available languages
export type LanguageCode = 'en' | 'es' | 'ar';

// Translation parameters for interpolation
export type TranslationParams = Record<string, string | number>;

/**
 * Get a nested value from an object using dot notation
 * @param obj - The object to search in
 * @param key - The dot-separated key path
 * @returns The value at the specified path, or undefined if not found
 */
export function getNestedValue(obj: any, key: string): any {
  if (!obj || !key) {
    return undefined;
  }

  const keys = key.split('.');
  let current = obj;

  for (const k of keys) {
    if (current === null || current === undefined) {
      return undefined;
    }
    current = current[k];
  }

  return current;
}

/**
 * Interpolate string template with parameters
 * @param template - The template string with placeholders like {param}
 * @param params - Object containing parameter values
 * @returns The interpolated string
 */
export function interpolateString(template: string, params: TranslationParams): string {
  if (!template || !params) {
    return template;
  }

  return template.replace(/\{([^}]+)\}/g, (match, key) => {
    const value = params[key];
    return value !== undefined ? String(value) : match;
  });
}

/**
 * Get a translation for a specific language and key
 * @param lang - The language code
 * @param key - The translation key (can use dot notation)
 * @param translations - The translations object
 * @param params - Optional parameters for interpolation
 * @returns The translated string, or the key if translation not found
 */
export function getTranslation(
  lang: LanguageCode,
  key: string,
  translations: Record<LanguageCode, TranslationData>,
  params?: TranslationParams
): string {
  const translationData = translations[lang];
  if (!translationData) {
    // Fallback to English if language not found
    const enData = translations.en;
    if (enData) {
      const enValue = getNestedValue(enData, key);
      if (enValue) {
        return params ? interpolateString(enValue, params) : enValue;
      }
    }
    return key; // Return key as fallback
  }

  const value = getNestedValue(translationData, key);
  if (!value) {
    // Fallback to English if key not found in current language
    const enData = translations.en;
    if (enData && lang !== 'en') {
      const enValue = getNestedValue(enData, key);
      if (enValue) {
        return params ? interpolateString(enValue, params) : enValue;
      }
    }
    return key; // Return key as fallback
  }

  return params ? interpolateString(value, params) : value;
}