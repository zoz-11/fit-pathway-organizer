import { AppLayout } from "@/components/layout/AppLayout";
import { TrainerDashboard } from "@/components/dashboard/TrainerDashboard";
import { AthleteDashboard } from "@/components/dashboard/AthleteDashboard";
import { useAuth } from "@/hooks/useAuthProvider";

const Index = () => {
  const { profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading your dashboard...</p>
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
