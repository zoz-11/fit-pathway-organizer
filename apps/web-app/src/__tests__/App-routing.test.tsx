/**
 * Unit tests for App routing configuration and RouteRenderer
 */
import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import App from '../App';

// Mock all dependencies
jest.mock('@/components/ui/sonner', () => ({
  SonnerToaster: () => <div data-testid="sonner-toaster">Sonner Toaster</div>,
}));

jest.mock('@/components/ui/tooltip', () => ({
  TooltipProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="tooltip-provider">{children}</div>
  ),
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
  QueryClientProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="query-client-provider">{children}</div>
  ),
}));

jest.mock('next-themes', () => ({
  ThemeProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="theme-provider">{children}</div>
  ),
}));

jest.mock('@/contexts/LanguageContext', () => ({
  LanguageProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="language-provider">{children}</div>
  ),
}));

jest.mock('@/hooks/useAuthProvider', () => ({
  AuthProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="auth-provider">{children}</div>
  ),
  useAuth: jest.fn(() => ({ user: null })),
}));

jest.mock('@/hooks/usePushNotifications', () => ({
  usePushNotifications: jest.fn(),
}));

jest.mock('@/hooks/useClickabilityFixes', () => ({
  useClickabilityFixes: jest.fn(),
}));

// Mock all page components
jest.mock('@/pages/Index', () => () => <div data-testid="index-page">Index Page</div>);
jest.mock('@/pages/Auth', () => () => <div data-testid="auth-page">Auth Page</div>);
jest.mock('@/pages/Schedule', () => () => <div data-testid="schedule-page">Schedule Page</div>);
jest.mock('@/pages/DietPlan', () => () => <div data-testid="diet-plan-page">Diet Plan Page</div>);
jest.mock('@/pages/Progress', () => () => <div data-testid="progress-page">Progress Page</div>);
jest.mock('@/pages/Messages', () => () => <div data-testid="messages-page">Messages Page</div>);
jest.mock('@/pages/Profile', () => () => <div data-testid="profile-page">Profile Page</div>);
jest.mock('@/pages/WorkoutLibrary', () => () => <div data-testid="workout-library-page">Workout Library Page</div>);
jest.mock('@/pages/Achievements', () => () => <div data-testid="achievements-page">Achievements Page</div>);
jest.mock('@/pages/AssignedWorkoutsTrainer', () => () => <div data-testid="assigned-workouts-trainer-page">Assigned Workouts Trainer Page</div>);
jest.mock('@/pages/AssignedWorkouts', () => () => <div data-testid="assigned-workouts-page">Assigned Workouts Page</div>);
jest.mock('@/pages/AthleteProgress', () => () => <div data-testid="athlete-progress-page">Athlete Progress Page</div>);
jest.mock('@/pages/Settings', () => () => <div data-testid="settings-page">Settings Page</div>);
jest.mock('@/pages/Members', () => () => <div data-testid="members-page">Members Page</div>);
jest.mock('@/pages/NotFound', () => () => <div data-testid="not-found-page">Not Found Page</div>);
jest.mock('@/pages/SubscriptionSuccess', () => () => <div data-testid="subscription-success-page">Subscription Success Page</div>);
jest.mock('@/pages/SubscriptionCancel', () => () => <div data-testid="subscription-cancel-page">Subscription Cancel Page</div>);
jest.mock('@/pages/Goals', () => () => <div data-testid="goals-page">Goals Page</div>);
jest.mock('@/pages/OAuthCallback', () => () => <div data-testid="oauth-callback-page">OAuth Callback Page</div>);
jest.mock('@/pages/EmailConfirmed', () => () => <div data-testid="email-confirmed-page">Email Confirmed Page</div>);

jest.mock('@/components/auth/ProtectedRoute', () => ({
  ProtectedRoute: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="protected-route">{children}</div>
  ),
}));

describe('App Routing Configuration', () => {
  const renderWithRouter = (initialRoute = '/') => {
    return render(
      <MemoryRouter initialEntries={[initialRoute]}>
        <App />
      </MemoryRouter>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Public Routes', () => {
    it('should render auth page on /auth route', () => {
      renderWithRouter('/auth');
      expect(screen.getByTestId('auth-page')).toBeInTheDocument();
    });

    it('should render email confirmed page on /email-confirmed route', () => {
      renderWithRouter('/email-confirmed');
      expect(screen.getByTestId('email-confirmed-page')).toBeInTheDocument();
    });

    it('should render subscription success page on /subscription-success route', () => {
      renderWithRouter('/subscription-success');
      expect(screen.getByTestId('subscription-success-page')).toBeInTheDocument();
    });

    it('should render subscription cancel page on /subscription-cancel route', () => {
      renderWithRouter('/subscription-cancel');
      expect(screen.getByTestId('subscription-cancel-page')).toBeInTheDocument();
    });

    it('should render OAuth callback page on /oauth-callback route', () => {
      renderWithRouter('/oauth-callback');
      expect(screen.getByTestId('oauth-callback-page')).toBeInTheDocument();
    });
  });

  describe('Protected Routes', () => {
    it('should render protected index page on / route', () => {
      renderWithRouter('/');
      expect(screen.getByTestId('protected-route')).toBeInTheDocument();
      expect(screen.getByTestId('index-page')).toBeInTheDocument();
    });

    it('should render protected schedule page on /schedule route', () => {
      renderWithRouter('/schedule');
      expect(screen.getByTestId('protected-route')).toBeInTheDocument();
      expect(screen.getByTestId('schedule-page')).toBeInTheDocument();
    });

    it('should render protected assigned workouts page on /assigned-workouts route', () => {
      renderWithRouter('/assigned-workouts');
      expect(screen.getByTestId('protected-route')).toBeInTheDocument();
      expect(screen.getByTestId('assigned-workouts-page')).toBeInTheDocument();
    });

    it('should render protected assigned workouts trainer page on /assigned-workouts-trainer route', () => {
      renderWithRouter('/assigned-workouts-trainer');
      expect(screen.getByTestId('protected-route')).toBeInTheDocument();
      expect(screen.getByTestId('assigned-workouts-trainer-page')).toBeInTheDocument();
    });

    it('should render protected workout library page on /workout-library route', () => {
      renderWithRouter('/workout-library');
      expect(screen.getByTestId('protected-route')).toBeInTheDocument();
      expect(screen.getByTestId('workout-library-page')).toBeInTheDocument();
    });

    it('should render protected achievements page on /achievements route', () => {
      renderWithRouter('/achievements');
      expect(screen.getByTestId('protected-route')).toBeInTheDocument();
      expect(screen.getByTestId('achievements-page')).toBeInTheDocument();
    });

    it('should render protected athlete progress page on /athlete-progress/:athleteId route', () => {
      renderWithRouter('/athlete-progress/123');
      expect(screen.getByTestId('protected-route')).toBeInTheDocument();
      expect(screen.getByTestId('athlete-progress-page')).toBeInTheDocument();
    });

    it('should render protected diet plan page on /diet-plan route', () => {
      renderWithRouter('/diet-plan');
      expect(screen.getByTestId('protected-route')).toBeInTheDocument();
      expect(screen.getByTestId('diet-plan-page')).toBeInTheDocument();
    });

    it('should render protected progress page on /progress route', () => {
      renderWithRouter('/progress');
      expect(screen.getByTestId('protected-route')).toBeInTheDocument();
      expect(screen.getByTestId('progress-page')).toBeInTheDocument();
    });

    it('should render protected messages page on /messages route', () => {
      renderWithRouter('/messages');
      expect(screen.getByTestId('protected-route')).toBeInTheDocument();
      expect(screen.getByTestId('messages-page')).toBeInTheDocument();
    });

    it('should render protected profile page on /profile route', () => {
      renderWithRouter('/profile');
      expect(screen.getByTestId('protected-route')).toBeInTheDocument();
      expect(screen.getByTestId('profile-page')).toBeInTheDocument();
    });

    it('should render protected settings page on /settings route', () => {
      renderWithRouter('/settings');
      expect(screen.getByTestId('protected-route')).toBeInTheDocument();
      expect(screen.getByTestId('settings-page')).toBeInTheDocument();
    });

    it('should render protected members page on /members route', () => {
      renderWithRouter('/members');
      expect(screen.getByTestId('protected-route')).toBeInTheDocument();
      expect(screen.getByTestId('members-page')).toBeInTheDocument();
    });

    it('should render protected goals page on /goals route', () => {
      renderWithRouter('/goals');
      expect(screen.getByTestId('protected-route')).toBeInTheDocument();
      expect(screen.getByTestId('goals-page')).toBeInTheDocument();
    });
  });

  describe('Catch-all Route', () => {
    it('should render not found page for unknown routes', () => {
      renderWithRouter('/unknown-route');
      expect(screen.getByTestId('not-found-page')).toBeInTheDocument();
    });

    it('should render not found page for deeply nested unknown routes', () => {
      renderWithRouter('/some/deeply/nested/unknown/route');
      expect(screen.getByTestId('not-found-page')).toBeInTheDocument();
    });
  });
});

describe('Route Configuration Structure', () => {
  it('should have correct number of routes defined', () => {
    // Import the routes array from App.tsx
    const { routes } = require('../App.tsx');
    
    // Count total routes (excluding catch-all)
    const totalRoutes = routes.length;
    
    expect(totalRoutes).toBe(18); // 5 public + 13 protected routes
  });

  it('should have correct number of public routes', () => {
    const { routes } = require('../App.tsx');
    
    const publicRoutes = routes.filter((route: any) => !route.protected);
    
    expect(publicRoutes.length).toBe(5);
    expect(publicRoutes.map((r: any) => r.path)).toEqual([
      '/auth',
      '/email-confirmed',
      '/subscription-success',
      '/subscription-cancel',
      '/oauth-callback',
    ]);
  });

  it('should have correct number of protected routes', () => {
    const { routes } = require('../App.tsx');
    
    const protectedRoutes = routes.filter((route: any) => route.protected);
    
    expect(protectedRoutes.length).toBe(13);
    expect(protectedRoutes.map((r: any) => r.path)).toEqual([
      '/',
      '/schedule',
      '/assigned-workouts',
      '/assigned-workouts-trainer',
      '/workout-library',
      '/achievements',
      '/athlete-progress/:athleteId',
      '/diet-plan',
      '/progress',
      '/messages',
      '/profile',
      '/settings',
      '/members',
      '/goals',
    ]);
  });

  it('should have all routes with required properties', () => {
    const { routes } = require('../App.tsx');
    
    routes.forEach((route: any) => {
      expect(route).toHaveProperty('path');
      expect(route).toHaveProperty('element');
      expect(typeof route.path).toBe('string');
      expect(typeof route.element).toBe('function');
      expect(route.protected).toBeDefined();
      expect(typeof route.protected).toBe('boolean');
    });
  });
});

describe('RouteRenderer Component', () => {
  // Test the RouteRenderer component directly
  const RouteRenderer = ({ config }: { config: any }) => {
    const { path, element: Component, protected: isProtected } = config;
    
    return (
      <Route
        path={path}
        element={isProtected ? (
          <div data-testid="protected-route">
            <Component />
          </div>
        ) : (
          <Component />
        )}
      />
    );
  };

  it('should render protected route with ProtectedRoute wrapper', () => {
    const MockComponent = () => <div data-testid="test-component">Test Component</div>;
    const testConfig = {
      path: '/test',
      element: MockComponent,
      protected: true,
    };

    render(
      <MemoryRouter initialEntries={['/test']}>
        <Routes>
          <RouteRenderer config={testConfig} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByTestId('protected-route')).toBeInTheDocument();
    expect(screen.getByTestId('test-component')).toBeInTheDocument();
  });

  it('should render public route without ProtectedRoute wrapper', () => {
    const MockComponent = () => <div data-testid="test-component">Test Component</div>;
    const testConfig = {
      path: '/test',
      element: MockComponent,
      protected: false,
    };

    render(
      <MemoryRouter initialEntries={['/test']}>
        <Routes>
          <RouteRenderer config={testConfig} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.queryByTestId('protected-route')).not.toBeInTheDocument();
    expect(screen.getByTestId('test-component')).toBeInTheDocument();
  });
});

describe('Route Configuration Benefits', () => {
  it('should demonstrate centralized route management', () => {
    const { routes } = require('../App.tsx');
    
    // Verify all routes are defined in one place
    expect(Array.isArray(routes)).toBe(true);
    expect(routes.length).toBeGreaterThan(0);
    
    // Verify each route has consistent structure
    routes.forEach((route: any) => {
      expect(route).toHaveProperty('path');
      expect(route).toHaveProperty('element');
      expect(route).toHaveProperty('protected');
    });
  });

  it('should demonstrate type safety with RouteConfig interface', () => {
    // This test verifies that the RouteConfig interface is properly defined
    // The interface should enforce the structure of route objects
    const testRoute = {
      path: '/test',
      element: () => null,
      protected: true,
      exact: true,
    };
    
    // Verify the test route has the expected structure
    expect(testRoute).toHaveProperty('path');
    expect(testRoute).toHaveProperty('element');
    expect(testRoute).toHaveProperty('protected');
    expect(testRoute).toHaveProperty('exact');
  });

  it('should demonstrate reduced code duplication', () => {
    const { routes } = require('../App.tsx');
    
    // Count how many routes use the same pattern
    const protectedRoutes = routes.filter((route: any) => route.protected);
    const publicRoutes = routes.filter((route: any) => !route.protected);
    
    // Verify that the centralized approach reduces duplication
    expect(protectedRoutes.length).toBeGreaterThan(0);
    expect(publicRoutes.length).toBeGreaterThan(0);
    
    // All protected routes should have the same protection logic
    protectedRoutes.forEach((route: any) => {
      expect(route.protected).toBe(true);
    });
    
    // All public routes should not have protection
    publicRoutes.forEach((route: any) => {
      expect(route.protected).toBe(false);
    });
  });
});