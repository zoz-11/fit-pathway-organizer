    it('should throw error when used outside of LanguageProvider', () => {
      // Test that useLanguage throws an error when used outside of LanguageProvider
      const originalError = console.error;
      console.error = jest.fn(); // Suppress console.error for this test
      
      expect(() => {
        renderHook(() => useLanguage());
      }).toThrow('useLanguage must be used within a LanguageProvider');
      
      console.error = originalError;
    });