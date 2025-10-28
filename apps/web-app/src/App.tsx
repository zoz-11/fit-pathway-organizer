import React, { useEffect } from "react";
import { SonnerToaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuthProvider";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { ThemeProvider } from "next-themes";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { useClickabilityFixes } from "./hooks/useClickabilityFixes";
import "./styles/clickability-fixes.css";
import { usePushNotifications } from "./hooks/usePushNotifications";
import "./apple-hig-styles.css";

// Page imports
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Schedule from "./pages/Schedule";
import DietPlan from "./pages/DietPlan";
import Progress from "./pages/Progress";
import Messages from "./pages/Messages";
import Profile from "./pages/Profile";
import WorkoutLibrary from "./pages/WorkoutLibrary";
import Achievements from "./pages/Achievements";
import AssignedWorkoutsTrainer from "./pages/AssignedWorkoutsTrainer";
import AssignedWorkouts from "./pages/AssignedWorkouts";
import AthleteProgress from "./pages/AthleteProgress";
import Settings from "./pages/Settings";
import Members from "./pages/Members";
import NotFound from "./pages/NotFound";
import SubscriptionSuccess from "./pages/SubscriptionSuccess";
import SubscriptionCancel from "./pages/SubscriptionCancel";
import Goals from "./pages/Goals";
import OAuthCallback from "./pages/OAuthCallback";
import EmailConfirmed from "./pages/EmailConfirmed";

// Route configuration type
interface RouteConfig {
  path: string;
  element: React.ComponentType<any>;
  protected?: boolean;
  exact?: boolean;
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000,
    },
  },
});

// Centralized route configuration
const routes: RouteConfig[] = [
  // Public routes
  { path: "/auth", element: Auth },
  { path: "/email-confirmed", element: EmailConfirmed },
  { path: "/subscription-success", element: SubscriptionSuccess },
  { path: "/subscription-cancel", element: SubscriptionCancel },
  { path: "/oauth-callback", element: OAuthCallback },
  
  // Protected routes
  { path: "/", element: Index, protected: true },
  { path: "/schedule", element: Schedule, protected: true },
  { path: "/assigned-workouts", element: AssignedWorkouts, protected: true },
  { path: "/assigned-workouts-trainer", element: AssignedWorkoutsTrainer, protected: true },
  { path: "/workout-library", element: WorkoutLibrary, protected: true },
  { path: "/achievements", element: Achievements, protected: true },
  { path: "/athlete-progress/:athleteId", element: AthleteProgress, protected: true },
  { path: "/diet-plan", element: DietPlan, protected: true },
  { path: "/progress", element: Progress, protected: true },
  { path: "/messages", element: Messages, protected: true },
  { path: "/profile", element: Profile, protected: true },
  { path: "/settings", element: Settings, protected: true },
  { path: "/members", element: Members, protected: true },
  { path: "/goals", element: Goals, protected: true },
];

// Route renderer component
const RouteRenderer: React.FC<{ config: RouteConfig }> = ({ config }) => {
  const { path, element: Component, protected: isProtected } = config;
  
  return (
    <Route
      path={path}
      element={isProtected ? (
        <ProtectedRoute>
          <Component />
        </ProtectedRoute>
      ) : (
        <Component />
      )}
    />
  );
};

const AppContent: React.FC = () => {
  // Initialize push notifications while inside AuthProvider
  usePushNotifications();
  
  // Initialize clickability fixes using the new hook
  useClickabilityFixes();

  return (
    <TooltipProvider>
      <SonnerToaster />
      <BrowserRouter>
        <Routes>
          {routes.map((route) => (
            <RouteRenderer key={route.path} config={route} />
          ))}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  );
};

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
        <LanguageProvider>
          <AuthProvider>
            <AppContent />
          </AuthProvider>
        </LanguageProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
export { routes };
export type { RouteConfig };
