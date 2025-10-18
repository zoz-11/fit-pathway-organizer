import React, { useEffect } from "react";
import { SonnerToaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuthProvider";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { ThemeProvider } from "next-themes";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { initializeClickabilityFixes } from "./fix-app-issues";
import { usePushNotifications } from "./hooks/usePushNotifications";
import "./apple-hig-styles.css";

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

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000,
    },
  },
});

const AppContent: React.FC = () => {
  // Initialize push notifications while inside AuthProvider
  usePushNotifications();

  useEffect(() => {
    // Fixes for clickability issues on some browsers/devices
    initializeClickabilityFixes();
  }, []);

  return (
    <TooltipProvider>
      <SonnerToaster />
      <BrowserRouter>
        <Routes>
          <Route path="/auth" element={<Auth />} />
          <Route path="/email-confirmed" element={<EmailConfirmed />} />
          <Route
            path="/subscription-success"
            element={<SubscriptionSuccess />}
          />
          <Route path="/subscription-cancel" element={<SubscriptionCancel />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Index />
              </ProtectedRoute>
            }
          />
          <Route
            path="/schedule"
            element={
              <ProtectedRoute>
                <Schedule />
              </ProtectedRoute>
            }
          />
          <Route
            path="/assigned-workouts"
            element={
              <ProtectedRoute>
                <AssignedWorkouts />
              </ProtectedRoute>
            }
          />
          <Route
            path="/assigned-workouts-trainer"
            element={
              <ProtectedRoute>
                <AssignedWorkoutsTrainer />
              </ProtectedRoute>
            }
          />
          <Route
            path="/workout-library"
            element={
              <ProtectedRoute>
                <WorkoutLibrary />
              </ProtectedRoute>
            }
          />
          <Route
            path="/achievements"
            element={
              <ProtectedRoute>
                <Achievements />
              </ProtectedRoute>
            }
          />
          <Route
            path="/athlete-progress/:athleteId"
            element={
              <ProtectedRoute>
                <AthleteProgress />
              </ProtectedRoute>
            }
          />
          <Route
            path="/diet-plan"
            element={
              <ProtectedRoute>
                <DietPlan />
              </ProtectedRoute>
            }
          />
          <Route
            path="/progress"
            element={
              <ProtectedRoute>
                <Progress />
              </ProtectedRoute>
            }
          />
          <Route
            path="/messages"
            element={
              <ProtectedRoute>
                <Messages />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/members"
            element={
              <ProtectedRoute>
                <Members />
              </ProtectedRoute>
            }
          />
          <Route
            path="/goals"
            element={
              <ProtectedRoute>
                <Goals />
              </ProtectedRoute>
            }
          />
          <Route path="/oauth-callback" element={<OAuthCallback />} />
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
