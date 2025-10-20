import { getTranslation, interpolateString, getNestedValue } from '../index';

// Mock translation data
const mockTranslations = {
  en: {
    common: {
      loading: 'Loading...',
      error: 'Error',
      save: 'Save',
      cancel: 'Cancel',
    },
    forms: {
      required: 'This field is required',
      minLength: 'Minimum length is {min}',
      maxLength: 'Maximum length is {max}',
    },
    user: {
      welcome: 'Welcome',
      welcomeBack: 'Welcome back',
    },
  },
  es: {
    common: {
      loading: 'Cargando...',
      error: 'Error',
      save: 'Guardar',
      cancel: 'Cancelar',
    },
    forms: {
      required: 'Este campo es obligatorio',
      minLength: 'La longitud mínima es {min}',
      maxLength: 'La longitud máxima es {max}',
    },
    user: {
      welcome: 'Bienvenido',
      welcomeBack: 'Bienvenido de nuevo',
    },
  },
  ar: {
    common: {
      loading: 'جار التحميل...',
      error: 'خطأ',
      save: 'حفظ',
      cancel: 'إلغاء',
    },
    forms: {
      required: 'هذا الحقل مطلوب',
      minLength: 'الطول الأدنى هو {min}',
      maxLength: 'الطول الأقصى هو {max}',
    },
    user: {
      welcome: 'أهلاً وسهلاً',
      welcomeBack: 'مرحباً بعودتك',
    },
  },
};

// Mock the translation files
jest.mock('../locales/en.json', () => mockTranslations.en);
jest.mock('../locales/es.json', () => mockTranslations.es);
jest.mock('../locales/ar.json', () => mockTranslations.ar);

describe('i18n Translation System', () => {
  describe('getNestedValue', () => {
    it('should get nested value using dot notation', () => {
      const obj = {
        common: {
          loading: 'Loading...',
          error: 'Error',
        },
        user: {
          welcome: 'Welcome',
        },
      };

      expect(getNestedValue(obj, 'common.loading')).toBe('Loading...');
      expect(getNestedValue(obj, 'common.error')).toBe('Error');
      expect(getNestedValue(obj, 'user.welcome')).toBe('Welcome');
    });

    it('should return undefined for non-existent keys', () => {
      const obj = {
        common: {
          loading: 'Loading...',
        },
      };

      expect(getNestedValue(obj, 'non.existent.key')).toBeUndefined();
      expect(getNestedValue(obj, 'common.nonexistent')).toBeUndefined();
    });

    it('should handle empty key', () => {
      const obj = { test: 'value' };
      expect(getNestedValue(obj, '')).toBeUndefined();
    });

    it('should handle null/undefined object', () => {
      expect(getNestedValue(null, 'key')).toBeUndefined();
      expect(getNestedValue(undefined, 'key')).toBeUndefined();
    });
  });

  describe('interpolateString', () => {
    it('should interpolate variables in string', () => {
      const template = 'Minimum length is {min}';
      const params = { min: 5 };

      expect(interpolateString(template, params)).toBe('Minimum length is 5');
    });

    it('should interpolate multiple variables', () => {
      const template = 'Length must be between {min} and {max}';
      const params = { min: 5, max: 20 };

      expect(interpolateString(template, params)).toBe('Length must be between 5 and 20');
    });

    it('should handle missing parameters gracefully', () => {
      const template = 'Minimum length is {min}';
      const params = {};

      expect(interpolateString(template, params)).toBe('Minimum length is {min}');
    });

    it('should handle null/undefined template', () => {
      expect(interpolateString(null, {})).toBe('');
      expect(interpolateString(undefined, {})).toBe('');
    });

    it('should handle special characters in parameters', () => {
      const template = 'Welcome {name}!';
      const params = { name: 'John & Jane' };

      expect(interpolateString(template, params)).toBe('Welcome John & Jane!');
    });

    it('should handle numeric parameters', () => {
      const template = 'You have {count} new messages';
      const params = { count: 3 };

      expect(interpolateString(template, params)).toBe('You have 3 new messages');
    });
  });

  describe('getTranslation', () => {
    it('should return translation for existing key in English', () => {
      const result = getTranslation('en', 'common.loading', mockTranslations);
      expect(result).toBe('Loading...');
    });

    it('should return translation for existing key in Spanish', () => {
      const result = getTranslation('es', 'common.loading', mockTranslations);
      expect(result).toBe('Cargando...');
    });

    it('should return translation for existing key in Arabic', () => {
      const result = getTranslation('ar', 'common.loading', mockTranslations);
      expect(result).toBe('جار التحميل...');
    });

    it('should return translation with interpolation', () => {
      const result = getTranslation('en', 'forms.minLength', mockTranslations, { min: 5 });
      expect(result).toBe('Minimum length is 5');
    });

    it('should return key for non-existent translation', () => {
      const result = getTranslation('en', 'non.existent.key', mockTranslations);
      expect(result).toBe('non.existent.key');
    });

    it('should return key for unsupported language', () => {
      const result = getTranslation('fr', 'common.loading', mockTranslations);
      expect(result).toBe('common.loading');
    });

    it('should handle nested keys correctly', () => {
      const result = getTranslation('en', 'forms.required', mockTranslations);
      expect(result).toBe('This field is required');
    });

    it('should handle complex interpolation in Spanish', () => {
      const result = getTranslation('es', 'forms.minLength', mockTranslations, { min: 10 });
      expect(result).toBe('La longitud mínima es 10');
    });

    it('should handle complex interpolation in Arabic', () => {
      const result = getTranslation('ar', 'forms.maxLength', mockTranslations, { max: 50 });
      expect(result).toBe('الطول الأقصى هو 50');
    });

    it('should handle multiple interpolation parameters', () => {
      // Create a mock translation with multiple parameters
      const multiParamTranslations = {
        en: {
          test: 'Range is {min} to {max} with {count} items',
        },
      };

      const result = getTranslation('en', 'test', multiParamTranslations, { min: 1, max: 10, count: 5 });
      expect(result).toBe('Range is 1 to 10 with 5 items');
    });

    it('should handle RTL languages correctly', () => {
      const result = getTranslation('ar', 'common.save', mockTranslations);
      expect(result).toBe('حفظ');
    });

    it('should handle special characters in translation keys', () => {
      const specialTranslations = {
        en: {
          'special.key-with-dashes': 'Special translation',
          'key.with.dots': 'Another translation',
        },
      };

      expect(getTranslation('en', 'special.key-with-dashes', specialTranslations)).toBe('Special translation');
      expect(getTranslation('en', 'key.with.dots', specialTranslations)).toBe('Another translation');
    });
  });

  describe('Translation edge cases', () => {
    it('should handle empty translation object', () => {
      const emptyTranslations = {};
      const result = getTranslation('en', 'any.key', emptyTranslations);
      expect(result).toBe('any.key');
    });

    it('should handle null/undefined translations', () => {
      expect(getTranslation('en', 'key', null as any)).toBe('key');
      expect(getTranslation('en', 'key', undefined as any)).toBe('key');
    });

    it('should handle deeply nested keys', () => {
      const deepTranslations = {
        en: {
          level1: {
            level2: {
              level3: {
                deep: 'Deep value',
              },
            },
          },
        },
      };

      const result = getTranslation('en', 'level1.level2.level3.deep', deepTranslations);
      expect(result).toBe('Deep value');
    });

    it('should handle interpolation with special characters', () => {
      const template = 'Hello {name}, welcome to {place}!';
      const params = { name: 'John & Mary', place: 'New York' };

      expect(interpolateString(template, params)).toBe('Hello John & Mary, welcome to New York!');
    });

    it('should handle interpolation with empty parameters', () => {
      const template = 'Value: {empty}';
      const params = { empty: '' };

      expect(interpolateString(template, params)).toBe('Value: ');
    });
  });
});