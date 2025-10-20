import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, Users } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageLayout } from "@/components/layout/PageLayout";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";

interface Workout {
  id: number;
  name: string;
  time: string;
  date: string;
  location: string;
  trainer: string;
  spots: string;
  status: string;
}

const hasGoogleRefreshToken = (profile: any) => {
  return profile?.google_refresh_token;
};

const Schedule: React.FC = () => {
  const { user, profile } = useAuth();
  const { t } = useLanguage();

  const handleAddToCalendar = async (workout: Workout) => {
    if (!user) {
      toast.error(t("schedule.toast.authRequired.title"), {
        description: t("schedule.toast.authRequired.description"),
      });
      return;
    }

    if (!hasGoogleRefreshToken(profile)) {
      // Initiate OAuth flow
      const googleClientId = process.env.VITE_GOOGLE_CLIENT_ID;
      const redirectUri = process.env.VITE_GOOGLE_REDIRECT_URI;
      const scope = "https://www.googleapis.com/auth/calendar.events";

      const authUrl =
        `https://accounts.google.com/o/oauth2/v2/auth?` +
        `client_id=${googleClientId}` +
        `&redirect_uri=${redirectUri}` +
        `&response_type=code` +
        `&scope=${scope}` +
        `&access_type=offline` +
        `&prompt=consent`;

      window.location.href = authUrl;
      return;
    }

    // If refresh token exists, create event
    try {
      const event = {
        summary: workout.name,
        description: `${t("schedule.workout.item.trainer")} ${workout.trainer}, ${t("schedule.workout.item.location")} ${workout.location}`,
        start: {
          dateTime: new Date().toISOString(), // Placeholder, ideally use actual workout date/time
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        },
        end: {
          dateTime: new Date(
            new Date().getTime() + 60 * 60 * 1000,
          ).toISOString(), // Placeholder, 1 hour after start
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        },
      };

      const { data, error } = await supabase.functions.invoke(
        "create-calendar-event",
        {
          body: JSON.stringify(event),
        },
      );

      if (error) {
        console.error("Error creating calendar event:", error);
        toast.error(t("schedule.toast.gcal.addError"));
      } else if (data?.error) {
        console.error("Server-side error creating calendar event:", data.error);
        toast.error(`${t("schedule.toast.gcal.addError")} ${data.error}`);
      } else {
        toast.success(t("schedule.toast.gcal.addSuccess"));
      }
    } catch (err) {
      console.error("Unexpected error adding event to calendar:", err);
      toast.error(t("schedule.toast.gcal.addUnexpectedError"));
    }
  };

  const handleJoinWorkout = (workoutName: string) => {
    toast.success(`${t("schedule.toast.joinSuccess")} ${workoutName}`);
  };

  const handleCancelWorkout = (workoutName: string) => {
    toast.info(`${t("schedule.toast.cancelSuccess")} ${workoutName}`);
  };

  const workouts = [
    {
      id: 1,
      name: t("schedule.workouts.1.name"),
      time: t("schedule.workouts.1.time"),
      date: t("schedule.workouts.1.date"),
      location: t("schedule.workouts.1.location"),
      trainer: t("schedule.workouts.1.trainer"),
      spots: t("schedule.workouts.1.spots"),
      status: t("schedule.workouts.1.status"),
    },
    {
      id: 2,
      name: t("schedule.workouts.2.name"),
      time: t("schedule.workouts.2.time"),
      date: t("schedule.workouts.2.date"),
      location: t("schedule.workouts.2.location"),
      trainer: t("schedule.workouts.2.trainer"),
      spots: t("schedule.workouts.2.spots"),
      status: t("schedule.workouts.2.status"),
    },
    {
      id: 3,
      name: t("schedule.workouts.3.name"),
      time: t("schedule.workouts.3.time"),
      date: t("schedule.workouts.3.date"),
      location: t("schedule.workouts.3.location"),
      trainer: t("schedule.workouts.3.trainer"),
      spots: t("schedule.workouts.3.spots"),
      status: t("schedule.workouts.3.status"),
    },
  ];

  return (
    <AppLayout>
      <PageLayout
        title={t("schedule.title")}
        description={t("schedule.description")}
      >
        <div className="grid gap-6">
          {workouts.map((workout) => (
            <Card key={workout.id} className="w-full">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-5 w-5 text-blue-600" />
                    <div>
                      <CardTitle className="text-lg">{workout.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {workout.date}
                      </p>
                    </div>
                  </div>
                  <div
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      workout.status === "confirmed"
                        ? "bg-green-100 text-green-800"
                        : workout.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {workout.status}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span>{workout.time}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span>{workout.location}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-gray-500" />
                    <span>{`${workout.spots} ${t("schedule.workout.item.spotsAvailable")} `}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-2">
                  <p className="text-sm text-gray-600">
                    {t("schedule.workout.item.trainer")} {workout.trainer}
                  </p>
                  <div className="flex gap-2">
                    {workout.status === "available" && (
                      <Button
                        size="sm"
                        onClick={() => handleJoinWorkout(workout.name)}
                      >
                        {t("schedule.workout.item.joinButton")}
                      </Button>
                    )}
                    {workout.status === "confirmed" && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCancelWorkout(workout.name)}
                      >
                        {t("schedule.workout.item.cancelButton")}
                      </Button>
                    )}
                    {workout.status === "pending" && (
                      <Button variant="secondary" size="sm" disabled>
                        {t("schedule.workout.item.pendingButton")}
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleAddToCalendar(workout)}
                    >
                      {t("schedule.workout.item.addToCalendarButton")}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </PageLayout>
    </AppLayout>
  );
};

export default Schedule;
