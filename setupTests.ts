import '@testing-library/jest-dom';

import './__mocks__/importMeta';

import { TextEncoder, TextDecoder } from 'util';
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

jest.mock('@/integrations/supabase/client', () => ({
  supabase: {
    auth: {
      onAuthStateChange: jest.fn(() => ({ 
        data: { 
          subscription: { unsubscribe: jest.fn() } 
        } 
      })),
      getSession: jest.fn(() => Promise.resolve({ data: { session: null } })),
    },
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({ single: jest.fn(() => Promise.resolve({ data: null, error: null })) })),
      })),
    })),
  },
}));

jest.mock('next-themes', () => ({
  ThemeProvider: ({ children }: { children: React.ReactNode }) => children,
  useTheme: () => ({ theme: 'light', setTheme: jest.fn() }),
}));

