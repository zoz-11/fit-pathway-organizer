/// <reference types="@testing-library/jest-dom" />
import "@testing-library/jest-dom";
import "./__mocks__/importMeta";
// Setup DOM environment for testing
global.document = document;
global.navigator = {
    userAgent: 'node.js',
};
// Mock localStorage
global.localStorage = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
    length: 0,
    key: jest.fn(),
};
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
