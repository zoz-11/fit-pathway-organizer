import { AppLayout } from "@/components/layout/AppLayout";
import { TrainerDashboard } from "@/components/dashboard/TrainerDashboard";
import { AthleteDashboard } from "@/components/dashboard/AthleteDashboard";
import { useAuth } from "@/hooks/useAuthProvider";

const Index = () => {
  const { profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="relative">
            <div className="animate-spin rounded-full h-12 w-12 border-2 border-primary border-t-transparent mx-auto"></div>
            <div className="absolute inset-0 h-12 w-12 border-2 border-primary/20 rounded-full mx-auto animate-pulse" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-semibold">FitPathway Organizer</h2>
            <p className="text-muted-foreground">Loading your dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  const userRole = profile?.role || 'athlete';

  return (
    <AppLayout>
      {userRole === 'trainer' ? <TrainerDashboard /> : <AthleteDashboard />}
    </AppLayout>
  );
};

export default Index;
