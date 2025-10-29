import "@testing-library/jest-dom";

import "./__mocks__/importMeta";

// Polyfill for TextEncoder/TextDecoder (needed for react-router-dom v7)
import { TextEncoder, TextDecoder } from 'util';
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder as any;

// Setup DOM environment for testing
global.window = window as any;
global.document = document as any;
global.navigator = {
  userAgent: 'node.js',
} as Navigator;

// Mock localStorage
global.localStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
  length: 0,
  key: jest.fn(),
} as Storage;

jest.mock("@/integrations/supabase/client", () => ({
  supabase: {
    auth: {
      onAuthStateChange: jest.fn(() => ({
        subscription: { unsubscribe: jest.fn() },
      })),
      getSession: jest.fn(() => Promise.resolve({ data: { session: null } })),
    },
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          single: jest.fn(() => Promise.resolve({ data: null, error: null })),
        })),
      })),
    })),
  },
}));

jest.mock("next-themes", () => ({
  useTheme: () => ({ theme: "light", setTheme: jest.fn() }),
}));