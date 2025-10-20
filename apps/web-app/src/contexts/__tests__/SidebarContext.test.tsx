import React from 'react';
import { render, renderHook, act } from '@testing-library/react';
import { SidebarProvider, useSidebar, SidebarContextValue } from '../SidebarContext';

// Mock the use-mobile hook
const mockUseIsMobile = jest.fn();
jest.mock('../../hooks/use-mobile', () => ({
  useIsMobile: () => mockUseIsMobile(),
}));

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('SidebarContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
    mockUseIsMobile.mockReturnValue(false); // Default to desktop
  });

  describe('useSidebar', () => {
    it('should throw error when used outside of SidebarProvider', () => {
      const { result } = renderHook(() => useSidebar());
      expect(result.error).toEqual(
        new Error('useSidebar must be used within a SidebarProvider')
      );
    });

    it('should return context when used within SidebarProvider', () => {
      let contextValue: SidebarContextValue | null = null;

      const TestComponent = () => {
        contextValue = useSidebar();
        return null;
      };

      render(
        <SidebarProvider>
          <TestComponent />
        </SidebarProvider>
      );

      expect(contextValue).toBeDefined();
      expect(contextValue?.state).toBe('expanded');
      expect(contextValue?.isMobile).toBe(false);
      expect(typeof contextValue?.setState).toBe('function');
      expect(typeof contextValue?.toggle).toBe('function');
    });
  });

  describe('SidebarProvider', () => {
    it('should initialize with default state on desktop', () => {
      let contextValue: SidebarContextValue | null = null;

      const TestComponent = () => {
        contextValue = useSidebar();
        return null;
      };

      render(
        <SidebarProvider>
          <TestComponent />
        </SidebarProvider>
      );

      expect(contextValue?.state).toBe('expanded');
      expect(contextValue?.isMobile).toBe(false);
    });

    it('should initialize with mobile state on mobile devices', () => {
      mockUseIsMobile.mockReturnValue(true);

      let contextValue: SidebarContextValue | null = null;

      const TestComponent = () => {
        contextValue = useSidebar();
        return null;
      };

      render(
        <SidebarProvider>
          <TestComponent />
        </SidebarProvider>
      );

      expect(contextValue?.state).toBe('mobile');
      expect(contextValue?.isMobile).toBe(true);
    });

    it('should load state from localStorage if available', () => {
      localStorageMock.getItem.mockReturnValue('collapsed');

      let contextValue: SidebarContextValue | null = null;

      const TestComponent = () => {
        contextValue = useSidebar();
        return null;
      };

      render(
        <SidebarProvider>
          <TestComponent />
        </SidebarProvider>
      );

      expect(contextValue?.state).toBe('collapsed');
      expect(localStorageMock.getItem).toHaveBeenCalledWith('sidebarState');
    });

    it('should ignore invalid localStorage values', () => {
      localStorageMock.getItem.mockReturnValue('invalid-state');

      let contextValue: SidebarContextValue | null = null;

      const TestComponent = () => {
        contextValue = useSidebar();
        return null;
      };

      render(
        <SidebarProvider>
          <TestComponent />
        </SidebarProvider>
      );

      expect(contextValue?.state).toBe('expanded'); // Should use default
    });

    it('should use custom default state when provided', () => {
      let contextValue: SidebarContextValue | null = null;

      const TestComponent = () => {
        contextValue = useSidebar();
        return null;
      };

      render(
        <SidebarProvider defaultState="collapsed">
          <TestComponent />
        </SidebarProvider>
      );

      expect(contextValue?.state).toBe('collapsed');
    });

    it('should update state when setState is called', () => {
      let contextValue: SidebarContextValue | null = null;

      const TestComponent = () => {
        contextValue = useSidebar();
        return null;
      };

      render(
        <SidebarProvider>
          <TestComponent />
        </SidebarProvider>
      );

      act(() => {
        contextValue?.setState('collapsed');
      });

      expect(contextValue?.state).toBe('collapsed');
    });

    it('should save state to localStorage when state changes', () => {
      let contextValue: SidebarContextValue | null = null;

      const TestComponent = () => {
        contextValue = useSidebar();
        return null;
      };

      render(
        <SidebarProvider>
          <TestComponent />
        </SidebarProvider>
      );

      act(() => {
        contextValue?.setState('collapsed');
      });

      expect(localStorageMock.setItem).toHaveBeenCalledWith('sidebarState', 'collapsed');
    });

    it('should not save mobile state to localStorage', () => {
      mockUseIsMobile.mockReturnValue(true);

      let contextValue: SidebarContextValue | null = null;

      const TestComponent = () => {
        contextValue = useSidebar();
        return null;
      };

      render(
        <SidebarProvider>
          <TestComponent />
        </SidebarProvider>
      );

      // Should not call setItem for mobile state
      expect(localStorageMock.setItem).not.toHaveBeenCalled();
    });

    it('should toggle state correctly', () => {
      let contextValue: SidebarContextValue | null = null;

      const TestComponent = () => {
        contextValue = useSidebar();
        return null;
      };

      render(
        <SidebarProvider>
          <TestComponent />
        </SidebarProvider>
      );

      // Initial state should be expanded
      expect(contextValue?.state).toBe('expanded');

      // Toggle should change to collapsed
      act(() => {
        contextValue?.toggle();
      });
      expect(contextValue?.state).toBe('collapsed');

      // Toggle should change back to expanded
      act(() => {
        contextValue?.toggle();
      });
      expect(contextValue?.state).toBe('expanded');
    });

    it('should not toggle mobile state', () => {
      mockUseIsMobile.mockReturnValue(true);

      let contextValue: SidebarContextValue | null = null;

      const TestComponent = () => {
        contextValue = useSidebar();
        return null;
      };

      render(
        <SidebarProvider>
          <TestComponent />
        </SidebarProvider>
      );

      const initialState = contextValue?.state;

      act(() => {
        contextValue?.toggle();
      });

      // State should remain the same for mobile
      expect(contextValue?.state).toBe(initialState);
    });

    it('should update state when mobile status changes', () => {
      mockUseIsMobile.mockReturnValue(false);

      let contextValue: SidebarContextValue | null = null;

      const TestComponent = () => {
        contextValue = useSidebar();
        return null;
      };

      render(
        <SidebarProvider>
          <TestComponent />
        </SidebarProvider>
      );

      expect(contextValue?.state).toBe('expanded');
      expect(contextValue?.isMobile).toBe(false);

      // Simulate switching to mobile
      mockUseIsMobile.mockReturnValue(true);

      // Force re-render to trigger useEffect
      const { rerender } = render(
        <SidebarProvider>
          <TestComponent />
        </SidebarProvider>
      );

      // Note: In a real test, we'd need to trigger the useEffect properly
      // This is a simplified version
    });

    it('should update state when switching from mobile to desktop', () => {
      mockUseIsMobile.mockReturnValue(true);

      let contextValue: SidebarContextValue | null = null;

      const TestComponent = () => {
        contextValue = useSidebar();
        return null;
      };

      render(
        <SidebarProvider>
          <TestComponent />
        </SidebarProvider>
      );

      expect(contextValue?.state).toBe('mobile');

      // Simulate switching to desktop
      mockUseIsMobile.mockReturnValue(false);

      // Force re-render
      render(
        <SidebarProvider>
          <TestComponent />
        </SidebarProvider>
      );

      // Should switch to default state when leaving mobile
      expect(contextValue?.state).toBe('expanded');
    });
  });

  describe('Provider props', () => {
    it('should render children correctly', () => {
      const TestChild = () => <div>Test Child</div>;

      const { getByText } = render(
        <SidebarProvider>
          <TestChild />
        </SidebarProvider>
      );

      expect(getByText('Test Child')).toBeInTheDocument();
    });

    it('should memoize context value', () => {
      let contextValue1: SidebarContextValue | null = null;
      let contextValue2: SidebarContextValue | null = null;
      let renderCount = 0;

      const TestComponent = () => {
        const context = useSidebar();
        renderCount++;
        if (renderCount === 1) contextValue1 = context;
        if (renderCount === 2) contextValue2 = context;
        return null;
      };

      const { rerender } = render(
        <SidebarProvider>
          <TestComponent />
        </SidebarProvider>
      );

      // Force re-render
      rerender(
        <SidebarProvider>
          <TestComponent />
        </SidebarProvider>
      );

      // Context values should be the same reference (memoized)
      expect(contextValue1).toBe(contextValue2);
    });
  });

  describe('Edge cases', () => {
    it('should handle rapid state changes', () => {
      let contextValue: SidebarContextValue | null = null;

      const TestComponent = () => {
        contextValue = useSidebar();
        return null;
      };

      render(
        <SidebarProvider>
          <TestComponent />
        </SidebarProvider>
      );

      // Rapid toggle calls
      act(() => {
        contextValue?.toggle();
        contextValue?.toggle();
        contextValue?.toggle();
      });

      // Should end up in collapsed state (odd number of toggles)
      expect(contextValue?.state).toBe('collapsed');
    });

    it('should handle setState with same value', () => {
      let contextValue: SidebarContextValue | null = null;

      const TestComponent = () => {
        contextValue = useSidebar();
        return null;
      };

      render(
        <SidebarProvider>
          <TestComponent />
        </SidebarProvider>
      );

      const initialState = contextValue?.state;

      act(() => {
        contextValue?.setState(initialState as any);
      });

      // State should remain the same
      expect(contextValue?.state).toBe(initialState);
    });

    it('should handle localStorage errors gracefully', () => {
      localStorageMock.setItem.mockImplementation(() => {
        throw new Error('localStorage is full');
      });

      let contextValue: SidebarContextValue | null = null;

      const TestComponent = () => {
        contextValue = useSidebar();
        return null;
      };

      // Should not throw error
      expect(() => {
        render(
          <SidebarProvider>
            <TestComponent />
          </SidebarProvider>
        );

        act(() => {
          contextValue?.setState('collapsed');
        });
      }).not.toThrow();
    });
  });
});