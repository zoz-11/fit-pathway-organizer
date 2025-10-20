import { AppLayout } from "@/components/layout/AppLayout";
import { PageLayout } from "@/components/layout/PageLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAchievements } from "@/hooks/useAchievements";
import { Skeleton } from "@/components/ui/skeleton";
import { Trophy } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const Achievements = () => {
  const { userAchievements, isLoadingUserAchievements } = useAchievements();
  const { t } = useLanguage();

  if (isLoadingUserAchievements) {
    return (
      <AppLayout>
        <PageLayout
          title={t("achievements.title")}
          description={t("achievements.description")}
        >
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
          </div>
        </PageLayout>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <PageLayout
        title={t("achievements.title")}
        description={t("achievements.description")}
      >
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {userAchievements && userAchievements.length > 0 ? (
            userAchievements.map((ua) => (
              <Card key={ua.id}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-yellow-500" />
                    {ua.achievement.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    {ua.achievement.description}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {t("achievements.achievedOn")} {new Date(ua.awarded_at).toLocaleDateString()}
                  </p>
                </CardContent>
              </Card>
            ))
          ) : (
            <p>{t("achievements.noAchievements")}</p>
          )}
        </div>
      </PageLayout>
    </AppLayout>
  );
};

export default Achievements;
