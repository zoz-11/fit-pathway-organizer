import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Calendar, Dumbbell, PlayCircle, Trophy, Video, Play } from "lucide-react";
import { useAuth } from "@/hooks/useAuthProvider";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { ProgressCharts } from "./ProgressCharts";
import { VideoPlayer } from "@/components/video/VideoPlayer";
import { useTodayWorkouts } from "@/hooks/useWorkouts";

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon: Icon,
  description,
}) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
};

export const AthleteDashboard: React.FC = () => {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [selectedVideoUrl, setSelectedVideoUrl] = useState("");

  const todayWorkouts = useTodayWorkouts(profile?.id);

  const handleViewUpcomingWorkout = () => {
    navigate("/schedule");
  };

  return (
    <div className="space-y-6 p-4 md:p-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col space-y-2 md:flex-row md:items-center md:justify-between" style={{ animationDelay: "0.1s" }}>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            {t("dashboard.athlete.title")}
          </h1>
          <p className="text-muted-foreground mt-1">
            {t("dashboard.athlete.welcome")}{" "}
            {profile?.full_name ?? t("dashboard.athlete.defaultName")}
          </p>
        </div>
        <Button
          onClick={handleViewUpcomingWorkout}
          className="bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 w-full md:w-auto transition-all duration-300 hover:scale-105 hover:shadow-lg"
        >
          {t("dashboard.athlete.viewWorkout")}
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">{[
        {
          title: t("dashboard.athlete.stats.workoutsCompleted"),
          value: "24",
          icon: Dumbbell,
          description: t("dashboard.athlete.stats.workoutsDescription"),
        },
        {
          title: t("dashboard.athlete.stats.nextWorkout"),
          value: t("athleteDashboard.legDay"),
          icon: Calendar,
          description: t("dashboard.athlete.stats.nextWorkoutDescription"),
        },
        {
          title: t("dashboard.athlete.stats.currentProgram"),
          value: t("athleteDashboard.hypertrophy"),
          icon: PlayCircle,
          description: t("dashboard.athlete.stats.programDescription"),
        },
        {
          title: t("dashboard.athlete.stats.achievements"),
          value: "5",
          icon: Trophy,
          description: t("dashboard.athlete.stats.achievementsDescription"),
        },
      ].map((stat, index) => (
        <div
          key={stat.title}
          className="animate-fade-in"
          style={{ animationDelay: `${0.2 + index * 0.1}s` }}
        >
          <Card className="transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        </div>
      ))}
      </div>

      {/* Today's Workouts */}
      <Card className="animate-fade-in transition-all duration-300 hover:shadow-lg" style={{ animationDelay: "0.6s" }}>
        <CardHeader>
          <CardTitle>{t("dashboard.athlete.todaysWorkouts")}</CardTitle>
        </CardHeader>
        <CardContent>
          {todayWorkouts.data && todayWorkouts.data.length > 0 ? (
            <div className="space-y-4">
              {todayWorkouts.data.map((workout: any) => (
                <div key={workout.id} className="p-4 border rounded-lg space-y-2">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold">{workout.title}</h4>
                      <p className="text-sm text-muted-foreground">{workout.description}</p>
                    </div>
                    {workout.workout_exercises?.some((we: any) => we.exercises?.youtube_link) && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          const firstVideoExercise = workout.workout_exercises.find((we: any) => we.exercises?.youtube_link);
                          if (firstVideoExercise?.exercises?.youtube_link) {
                            setSelectedVideoUrl(firstVideoExercise.exercises.youtube_link);
                            setVideoModalOpen(true);
                          }
                        }}
                      >
                        <Play className="h-4 w-4 mr-1" />
                        {t("assignedWorkouts.watchVideos")}
                      </Button>
                    )}
                  </div>
                  {workout.workout_exercises && workout.workout_exercises.length > 0 && (
                    <div className="text-xs text-muted-foreground">
                      {workout.workout_exercises.length} {t("createWorkoutForm.exercises")}
                      {workout.workout_exercises.filter((we: any) => we.exercises?.youtube_link).length > 0 && (
                        <span className="ml-2">
                          <Video className="inline h-3 w-3 mr-1" />
                          {workout.workout_exercises.filter((we: any) => we.exercises?.youtube_link).length} {t("workoutLibrary.videoAvailable")}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              ))}
              <Button 
                onClick={() => navigate("/assigned-workouts")}
                className="w-full"
              >
                {t("dashboard.viewAllWorkouts")}
              </Button>
            </div>
          ) : (
            <p className="text-muted-foreground">{t("dashboard.noWorkoutsToday")}</p>
          )}
        </CardContent>
      </Card>

      {/* Progress Charts */}
      <Card className="animate-fade-in transition-all duration-300 hover:shadow-lg" style={{ animationDelay: "0.7s" }}>
        <CardHeader>
          <CardTitle>{t("dashboard.athlete.progress.title")}</CardTitle>
        </CardHeader>
        <CardContent>
          <ProgressCharts userId={profile?.id || ""} />
        </CardContent>
      </Card>

      {/* Video Modal */}
      <Dialog open={videoModalOpen} onOpenChange={setVideoModalOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>{t("assignedWorkouts.videoTutorials")}</DialogTitle>
          </DialogHeader>
          {selectedVideoUrl && (
            <VideoPlayer
              videoUrl={selectedVideoUrl}
              title={t("assignedWorkouts.videoTutorials")}
              isOpen={videoModalOpen}
              onClose={() => setVideoModalOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AthleteDashboard;
