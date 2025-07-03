import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAchievements } from "@/hooks/useAchievements";
import { Skeleton } from "@/components/ui/skeleton";
import { Trophy } from "lucide-react";

const Achievements = () => {
  const { userAchievements, isLoadingUserAchievements } = useAchievements();

  if (isLoadingUserAchievements) {
    return (
      <AppLayout>
        <div className="p-6">
          <Skeleton className="h-10 w-48 mb-4" />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-6 p-4 md:p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">My Achievements</h1>
            <p className="text-muted-foreground mt-1">Celebrate your fitness milestones!</p>
          </div>
        </div>

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
                  <p className="text-sm text-muted-foreground">{ua.achievement.description}</p>
                  <p className="text-xs text-muted-foreground">Achieved on: {new Date(ua.achieved_at).toLocaleDateString()}</p>
                </CardContent>
              </Card>
            ))
          ) : (
            <p>No achievements unlocked yet. Keep working out!</p>
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default Achievements;