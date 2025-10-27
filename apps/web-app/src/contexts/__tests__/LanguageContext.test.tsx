import React from 'react';
import { render, renderHook, act } from '@testing-library/react';
import { LanguageProvider, useLanguage, LanguageContextType } from '../LanguageContext';

 // Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

// Mock window and document for Node.js environment
if (typeof window !== 'undefined') {
  Object.defineProperty(window, 'localStorage', {
    value: localStorageMock,
  });
}

if (typeof document !== 'undefined') {
  Object.defineProperty(document, 'documentElement', {
    value: {
      setAttribute: jest.fn(),
      dir: 'ltr',
    },
  });
}

describe('LanguageContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
  });

  describe('useLanguage', () => {
    it('should throw error when used outside of LanguageProvider', () => {
      const { result } = renderHook(() => useLanguage());
      expect(result.error).toEqual(
        new Error('useLanguage must be used within a LanguageProvider')
      );
    });

    it('should return context when used within LanguageProvider', () => {
      let contextValue: LanguageContextType | undefined;
      
      const TestComponent = () => {
        contextValue = useLanguage();
        return null;
      };

      render(
        <LanguageProvider>
          <TestComponent />
        </LanguageProvider>
      );

      expect(contextValue).toBeDefined();
      expect(contextValue?.language).toBe('en');
      expect(typeof contextValue?.setLanguage).toBe('function');
      expect(typeof contextValue?.t).toBe('function');
    });
  });

  describe('LanguageProvider', () => {
    it('should initialize with default language (en)', () => {
      let contextValue: LanguageContextType | undefined;
      
      const TestComponent = () => {
        contextValue = useLanguage();
        return null;
      };

      render(
        <LanguageProvider>
          <TestComponent />
        </LanguageProvider>
      );

      expect(contextValue?.language).toBe('en');
    });

    it('should load language from localStorage if available', () => {
      localStorageMock.getItem.mockReturnValue('ar');
      
      let contextValue: LanguageContextType | undefined;
      
      const TestComponent = () => {
        contextValue = useLanguage();
        return null;
      };

      render(
        <LanguageProvider>
          <TestComponent />
        </LanguageProvider>
      );

      expect(contextValue?.language).toBe('ar');
      expect(localStorageMock.getItem).toHaveBeenCalledWith('language');
    });

    it('should update language and save to localStorage', () => {
      let contextValue: LanguageContextType | undefined;
      
      const TestComponent = () => {
        contextValue = useLanguage();
        return null;
      };

      render(
        <LanguageProvider>
          <TestComponent />
        </LanguageProvider>
      );

      act(() => {
        contextValue?.setLanguage('ar');
      });

      expect(contextValue?.language).toBe('ar');
      expect(localStorageMock.setItem).toHaveBeenCalledWith('language', 'ar');
    });

    it('should update document direction for RTL languages', () => {
      let contextValue: LanguageContextType | undefined;
      
      const TestComponent = () => {
        contextValue = useLanguage();
        return null;
      };

      render(
        <LanguageProvider>
          <TestComponent />
        </LanguageProvider>
      );

      act(() => {
        contextValue?.setLanguage('ar');
      });

      expect(document.documentElement.setAttribute).toHaveBeenCalledWith('dir', 'rtl');
    });

    it('should update document direction for LTR languages', () => {
      let contextValue: LanguageContextType | undefined;
      
      const TestComponent = () => {
        contextValue = useLanguage();
        return null;
      };

      render(
        <LanguageProvider>
          <TestComponent />
        </LanguageProvider>
      );

      act(() => {
        contextValue?.setLanguage('en');
      });

      expect(document.documentElement.setAttribute).toHaveBeenCalledWith('dir', 'ltr');
    });
  });

  describe('translation function (t)', () => {
    it('should return translation for existing key', () => {
      let contextValue: LanguageContextType | undefined;
      
      const TestComponent = () => {
        contextValue = useLanguage();
        return null;
      };

      render(
        <LanguageProvider>
          <TestComponent />
        </LanguageProvider>
      );

      const translation = contextValue?.t('settings.title');
      expect(translation).toBe('Settings');
    });

    it('should return key for non-existing translation', () => {
      let contextValue: LanguageContextType | undefined;
      
      const TestComponent = () => {
        contextValue = useLanguage();
        return null;
      };

      render(
        <LanguageProvider>
          <TestComponent />
        </LanguageProvider>
      );

      const translation = contextValue?.t('non.existing.key');
      expect(translation).toBe('non.existing.key');
    });

    it('should return nested translation using dot notation', () => {
      let contextValue: LanguageContextType | undefined;
      
      const TestComponent = () => {
        contextValue = useLanguage();
        return null;
      };

      render(
        <LanguageProvider>
          <TestComponent />
        </LanguageProvider>
      );

      const translation = contextValue?.t('settings.notifications.description');
      expect(translation).toBe('Get notified before scheduled workouts');
    });

    it('should handle language switching and return correct translations', () => {
      let contextValue: LanguageContextType | undefined;
      
      const TestComponent = () => {
        contextValue = useLanguage();
        return null;
      };

      render(
        <LanguageProvider>
          <TestComponent />
        </LanguageProvider>
      );

      // Initially in English
      expect(contextValue?.t('settings.title')).toBe('Settings');

      // Switch to Arabic (assuming Arabic translations exist)
      act(() => {
        contextValue?.setLanguage('ar');
      });

      // The translation function should handle the language change
      // The language state should be updated
      expect(contextValue?.language).toBe('ar');
    });
  });

  describe('provider props', () => {
    it('should render children correctly', () => {
      const TestChild = () => <div>Test Child</div>;
      
      const { getByText } = render(
        <LanguageProvider>
          <TestChild />
        </LanguageProvider>
      );

      expect(getByText('Test Child')).toBeInTheDocument();
    });
  });
});