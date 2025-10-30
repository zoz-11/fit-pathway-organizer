import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Users,
  Calendar,
  Dumbbell,
  BarChart3,
  Plus,
  UserPlus,
  Send,
  PlusCircle,
} from "lucide-react";
import { AiChatAssistant } from "@/components/ai/AiChatAssistant";
import { SubscriptionManager } from "@/components/subscription/SubscriptionManager";
import { ActivityFeed } from "@/components/dashboard/ActivityFeed";
import { useAuth } from "@/hooks/useAuthProvider";
import { toast } from "sonner";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

interface Activity {
  id: number;
  text: string;
  time: string;
  type: "success" | "info" | "warning";
}

const StatCard = ({
  title,
  value,
  icon: Icon,
  description,
}: {
  title: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}) => (
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
export const TrainerDashboard = () => {
  const { profile } = useAuth();
  const [activities, setActivities] = useState<Activity[]>([]);
  const navigate = useNavigate();
  const { t } = useLanguage();

  const handleAddAthlete = () => {
    const newActivity = {
      id: activities.length + 1,
      text: t("dashboard.trainer.activities.athleteAdded", {
        name: t("trainerDashboard.mock.athleteName"),
      }),
      time: t("dashboard.trainer.activities.justNow"),
      type: "success" as const,
    };
    setActivities((prev) => [newActivity, ...prev]);
    toast.success(t("dashboard.trainer.toasts.athleteAdded.title"), {
      description: t("dashboard.trainer.toasts.athleteAdded.description", {
        name: t("trainerDashboard.mock.athleteName"),
      }),
    });
  };

  const handleScheduleWorkout = () => {
    const newActivity = {
      id: activities.length + 1,
      text: t("dashboard.trainer.activities.workoutScheduled", {
        name: "John",
        workout: t("trainerDashboard.mock.workoutName"),
        time: "Tomorrow 10 AM",
      }),
      time: t("dashboard.trainer.activities.justNow"),
      type: "info" as const,
    };
    setActivities((prev) => [newActivity, ...prev]);
    toast.success(t("dashboard.trainer.toasts.workoutScheduled.title"), {
      description: t("dashboard.trainer.toasts.workoutScheduled.description", {
        workout: t("trainerDashboard.mock.workoutName"),
        name: "John",
        time: "tomorrow at 10 AM",
      }),
    });
  };

  const handleSendMessage = () => {
    toast.success(t("dashboard.trainer.toasts.messageSent.title"), {
      description: t("dashboard.trainer.toasts.messageSent.description"),
    });
  };

  const handleCreateExercise = () => {
    const newActivity = {
      id: activities.length + 1,
      text: t("dashboard.trainer.activities.exerciseCreated", {
        exercise: t("trainerDashboard.mock.exerciseName"),
      }),
      time: t("dashboard.trainer.activities.justNow"),
      type: "success" as const,
    };
    setActivities((prev) => [newActivity, ...prev]);
    toast.success(t("dashboard.trainer.toasts.exerciseCreated.title"), {
      description: t("dashboard.trainer.toasts.exerciseCreated.description", {
        exercise: t("trainerDashboard.mock.exerciseName"),
      }),
    });
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "success":
        return "🟢";
      case "info":
        return "🔵";
      case "warning":
        return "🟡";
      default:
        return "⚪";
    }
  };

  return (
    <div className="space-y-6 p-4 md:p-6 animate-fade-in">
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0" style={{ animationDelay: "0.1s" }}>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            {t("dashboard.trainer.title")}
          </h1>
          <p className="text-muted-foreground mt-1">
            {t("dashboard.trainer.welcome")}{" "}
            {profile?.full_name ?? t("dashboard.trainer.defaultName")}!{" "}
            {t("dashboard.trainer.description")}
          </p>
        </div>
      </div>
      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">{[
        {
          title: t("dashboard.trainer.stats.totalAthletes"),
          value: "12",
          icon: Users,
          description: t("dashboard.trainer.stats.athletesChange"),
        },
        {
          title: t("dashboard.trainer.stats.scheduledWorkouts"),
          value: "8",
          icon: Calendar,
          description: t("dashboard.trainer.stats.workoutsThisWeek"),
        },
        {
          title: t("dashboard.trainer.stats.activePrograms"),
          value: "5",
          icon: Dumbbell,
          description: t("dashboard.trainer.stats.runningPrograms"),
        },
        {
          title: t("dashboard.trainer.stats.completionRate"),
          value: "87%",
          icon: BarChart3,
          description: t("dashboard.trainer.stats.rateChange"),
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

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {/* Quick Actions */}
          <Card className="animate-fade-in transition-all duration-300 hover:shadow-lg" style={{ animationDelay: "0.6s" }}>
            <CardHeader>
              <CardTitle>{t("dashboard.trainer.quickActions.title")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">{[
                {
                  onClick: handleScheduleWorkout,
                  icon: Calendar,
                  color: "text-blue-600",
                  title: t("dashboard.trainer.quickActions.scheduleWorkout"),
                  description: t("dashboard.trainer.quickActions.scheduleDescription"),
                },
                {
                  onClick: handleAddAthlete,
                  icon: UserPlus,
                  color: "text-green-600",
                  title: t("dashboard.trainer.quickActions.addAthlete"),
                  description: t("dashboard.trainer.quickActions.expandRoster"),
                },
                {
                  onClick: handleSendMessage,
                  icon: Send,
                  color: "text-purple-600",
                  title: t("dashboard.trainer.quickActions.sendMessage"),
                  description: t("dashboard.trainer.quickActions.communicate"),
                },
                {
                  onClick: handleCreateExercise,
                  icon: PlusCircle,
                  color: "text-orange-600",
                  title: t("dashboard.trainer.quickActions.createExercise"),
                  description: t("dashboard.trainer.quickActions.buildLibrary"),
                },
              ].map((action, index) => (
                <Button
                  key={action.title}
                  size="default"
                  onClick={action.onClick}
                  className="justify-start h-auto p-4 transition-all duration-300 hover:scale-105 hover:shadow-lg animate-fade-in"
                  style={{ animationDelay: `${0.7 + index * 0.05}s` }}
                >
                  <div className="flex items-center space-x-3">
                    <action.icon className={`h-5 w-5 ${action.color}`} aria-hidden="true" />
                    <div className="text-start">
                      <div className="font-medium">{action.title}</div>
                      <div className="text-xs text-muted-foreground">{action.description}</div>
                    </div>
                  </div>
                </Button>
              ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <div className="animate-fade-in" style={{ animationDelay: "0.9s" }}>
            <ActivityFeed />
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* AI Assistant */}
          <div className="animate-fade-in" style={{ animationDelay: "1s" }}>
            <AiChatAssistant />
          </div>

          {/* Subscription Management */}
          <div className="animate-fade-in" style={{ animationDelay: "1.1s" }}>
            <SubscriptionManager />
          </div>
        </div>
      </div>
    </div>
  );
};
