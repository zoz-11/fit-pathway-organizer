import { AppLayout } from "@/components/layout/AppLayout";
import { TrainerDashboard } from "@/components/dashboard/TrainerDashboard";
import { AthleteDashboard } from "@/components/dashboard/AthleteDashboard";
import { useAuth } from "@/hooks/useAuthProvider";
import { useLanguage } from "@/contexts/LanguageContext";

const Index = () => {
  const { profile, role, loading } = useAuth();
  const { t } = useLanguage();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5 flex items-center justify-center animate-fade-in">
        <div className="text-center space-y-4">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary border-t-transparent mx-auto"></div>
            <div className="absolute inset-0 h-16 w-16 border-4 border-primary/20 rounded-full mx-auto animate-pulse" />
          </div>
          <div className="space-y-2 animate-fade-in" style={{ animationDelay: "0.2s" }}>
            <h2 className="text-xl font-semibold">{t("index.title")}</h2>
            <p className="text-muted-foreground">{t("index.loading")}</p>
          </div>
        </div>
      </div>
    );
  }

  // Handle case where profile is null (auth error or not loaded properly)
  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-red-600">{t("index.error")}</h2>
            <p className="text-muted-foreground">{t("index.profileLoadError")}</p>
          </div>
        </div>
      </div>
    );
  }

  // Handle case where role is null or undefined
  if (!role) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-red-600">{t("index.error")}</h2>
            <p className="text-muted-foreground">{t("index.roleLoadError") || "Unable to load user role. Please try refreshing the page."}</p>
          </div>
        </div>
      </div>
    );
  }

  const userRole = role;

  return (
    <AppLayout>
      {userRole === "trainer" ? <TrainerDashboard /> : <AthleteDashboard />}
    </AppLayout>
  );
};

export default Index;