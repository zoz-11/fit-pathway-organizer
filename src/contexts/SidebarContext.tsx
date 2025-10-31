import React, { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

export type SidebarState = 
  | 'expanded'
  | 'collapsed'
  | 'mobile';

export type SidebarContextValue = {
  /**
   * The current state of the sidebar.
   */
  state: SidebarState;
  /**
   * Whether the sidebar is on mobile view.
   */
  isMobile: boolean;
  /**
   * Set the state of the sidebar.
   */
  setState: (state: SidebarState) => void;
  /**
   * Toggle the state of the sidebar.
   * - If the sidebar is expanded, it will be collapsed.
   * - If the sidebar is collapsed, it will be expanded.
   * - If the sidebar is mobile, it will be closed.
   */
  toggle: () => void;
};

export const SidebarContext = createContext<SidebarContextValue | null>(
  null
);

export const useSidebar = () => {
  const context = useContext(SidebarContext);

  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }

  return context;
};

interface SidebarProviderProps {
  /**
   * The children to render.
   */
  children: React.ReactNode;
  /**
   * The default state of the sidebar.
   * @default 'expanded'
   */
  defaultState?: SidebarState;
}

export const SidebarProvider: React.FC<SidebarProviderProps> = ({
  children,
  defaultState = 'expanded',
}) => {
  const isMobileView = useIsMobile();
  const [state, setState] = useState<SidebarState>(() => {
    // On mobile devices, default to 'mobile' state
    if (isMobileView) return 'mobile';
    
    // Check localStorage for saved preference
    const savedState = localStorage.getItem('sidebarState');
    if (savedState && (savedState === 'expanded' || savedState === 'collapsed')) {
      return savedState;
    }
    
    return defaultState;
  });

  // Update state when mobile status changes
  useEffect(() => {
    if (isMobileView && state !== 'mobile') {
      setState('mobile');
    } else if (!isMobileView && state === 'mobile') {
      setState(defaultState);
    }
  }, [isMobileView, defaultState, state]);

  // Save state to localStorage when it changes
  useEffect(() => {
    if (state !== 'mobile') {
      localStorage.setItem('sidebarState', state);
    }
  }, [state]);

  const toggle = useCallback(() => {
    setState((prevState) => {
      if (prevState === 'expanded') return 'collapsed';
      if (prevState === 'collapsed') return 'expanded';
      return prevState;
    });
  }, []);

  const value = useMemo(
    () => ({
      state,
      isMobile: isMobileView,
      setState,
      toggle,
    }),
    [state, isMobileView, toggle]
  );

  return <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>;
}; 