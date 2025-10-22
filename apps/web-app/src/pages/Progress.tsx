import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Target, Calendar, Award } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { ProgressCharts } from "@/components/dashboard/ProgressCharts";
import AdvancedAnalytics from "@/components/dashboard/AdvancedAnalytics";
import { useAuth } from "@/hooks/useAuthProvider";
import { useLanguage } from "@/contexts/LanguageContext";

const Progress = () => {
  const { t } = useLanguage();
  const { user } = useAuth();

  const progressData = [
    { month: "Jan", workouts: 12, weight: 180 },
    { month: "Feb", workouts: 16, weight: 178 },
    { month: "Mar", workouts: 18, weight: 176 },
    { month: "Apr", workouts: 20, weight: 174 },
    { month: "May", workouts: 22, weight: 172 },
    { month: "Jun", workouts: 25, weight: 170 },
  ];

  const achievements = [
    { title: t("progress.achievements.firstWorkout.title"), date: "2024-01-15", icon: "🏃" },
    { title: t("progress.achievements.tenWorkouts.title"), date: "2024-02-10", icon: "💪" },
    { title: t("progress.achievements.weightGoal.title"), date: "2024-04-20", icon: "🎯" },
    { title: t("progress.achievements.consistencyKing.title"), date: "2024-05-15", icon: "👑" },
    { title: t("progress.achievements.monthStreak.title"), date: "2024-06-01", icon: "🔥" },
  ];

  return (
    <AppLayout>
      <div className="space-y-6 p-4 md:p-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            {t("progress.title")}
          </h1>
          <p className="mt-2 text-muted-foreground">
            {t("progress.subtitle")}
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t("progress.cards.totalWorkouts.title")}
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">113</div>
              <p className="text-xs text-muted-foreground">
                {t("progress.cards.totalWorkouts.subtitle")}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t("progress.cards.currentStreak.title")}
              </CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {t("progress.cards.currentStreak.value")}
              </div>
              <p className="text-xs text-muted-foreground">
                {t("progress.cards.currentStreak.subtitle")}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t("progress.cards.lastWorkout.title")}
              </CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {t("progress.cards.lastWorkout.value")}
              </div>
              <p className="text-xs text-muted-foreground">
                {t("progress.cards.lastWorkout.subtitle")}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t("progress.cards.achievements.title")}
              </CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{achievements.length}</div>
              <p className="text-xs text-muted-foreground">
                {t("progress.cards.achievements.subtitle")}
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t("progress.charts.title")}</CardTitle>
          </CardHeader>
          <CardContent>
            <ProgressCharts data={progressData} userId={user?.id || ""} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t("progress.achievements.title")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {achievements.map((achievement, index) => (
                <div
                  key={index}
                  className="flex items-start space-x-4 rounded-lg border p-4"
                >
                  <div className="text-3xl">{achievement.icon}</div>
                  <div className="flex-1">
                    <h3 className="font-semibold">{achievement.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {achievement.date}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <AdvancedAnalytics userId={user?.id || ""} />
      </div>
    </AppLayout>
  );
};

export default Progress;
