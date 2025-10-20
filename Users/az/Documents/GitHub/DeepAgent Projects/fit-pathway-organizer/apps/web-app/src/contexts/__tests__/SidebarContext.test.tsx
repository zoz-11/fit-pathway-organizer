    it('should throw error when used outside of SidebarProvider', () => {
      // Test that useSidebar throws an error when used outside of SidebarProvider
      const originalError = console.error;
      console.error = jest.fn(); // Suppress console.error for this test
      
      expect(() => {
        renderHook(() => useSidebar());
      }).toThrow('useSidebar must be used within a SidebarProvider');
      
      console.error = originalError;
    });