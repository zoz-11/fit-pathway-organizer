import { jsx as _jsx } from "react/jsx-runtime";
jest.mock('@/components/ui/tooltip', () => ({
    TooltipProvider: ({ children }) => (_jsx("div", { "data-testid": "tooltip-provider", children: children })),
}));
jest.mock('next-themes', () => ({
    ThemeProvider: ({ children }) => (_jsx("div", { "data-testid": "theme-provider", children: children })),
}));
jest.mock('@tanstack/react-query', () => ({
    QueryClient: jest.fn().mockImplementation(() => ({
        defaultOptions: {
            queries: {
                retry: 1,
                staleTime: 5 * 60 * 1000,
            },
        },
    })),
    QueryClientProvider: ({ children }) => (_jsx("div", { "data-testid": "query-client-provider", children: children })),
}));
jest.mock('@/contexts/LanguageContext', () => ({
    LanguageProvider: ({ children }) => (_jsx("div", { "data-testid": "language-provider", children: children })),
}));
jest.mock('@/contexts/LanguageContext', () => ({
    LanguageProvider: ({ children }) => (_jsx("div", { "data-testid": "language-provider", children: children })),
}));
jest.mock('@/components/auth/ProtectedRoute', () => ({
    ProtectedRoute: ({ children }) => (_jsx("div", { "data-testid": "protected-route", children: children })),
    // ... existing code ...
}));
jest.mock('next-themes', () => ({
    ThemeProvider: ({ children }) => (_jsx("div", { "data-testid": "theme-provider", children: children })),
}));
jest.mock('@/contexts/LanguageContext', () => ({
    LanguageProvider: ({ children }) => (_jsx("div", { "data-testid": "language-provider", children: children })),
}));
jest.mock('@/hooks/useAuthProvider', () => ({
    AuthProvider: ({ children }) => (_jsx("div", { "data-testid": "auth-provider", children: children })),
}));
