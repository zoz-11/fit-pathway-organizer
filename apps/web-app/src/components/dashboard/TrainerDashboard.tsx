import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Calendar, Dumbbell, BarChart3, Plus, UserPlus, Send, PlusCircle } from "lucide-react";
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

const StatCard = ({ title, value, icon: Icon, description }: {
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
      text: t('dashboard.trainer.activities.athleteAdded', { name: 'Alex Johnson' }),
      time: t('dashboard.trainer.activities.justNow'),
      type: "success" as const
    };
    setActivities(prev => [newActivity, ...prev]);
    toast.success(t('dashboard.trainer.toasts.athleteAdded.title'), {
      description: t('dashboard.trainer.toasts.athleteAdded.description', { name: 'Alex Johnson' })
    });
  };

  const handleScheduleWorkout = () => {
    const newActivity = {
      id: activities.length + 1,
      text: t('dashboard.trainer.activities.workoutScheduled', {
        name: 'John',
        workout: 'Upper Body Strength',
        time: 'Tomorrow 10 AM'
      }),
      time: t('dashboard.trainer.activities.justNow'),
      type: "info" as const
    };
    setActivities(prev => [newActivity, ...prev]);
    toast.success(t('dashboard.trainer.toasts.workoutScheduled.title'), {
      description: t('dashboard.trainer.toasts.workoutScheduled.description', {
        workout: 'Upper Body Strength',
        name: 'John',
        time: 'tomorrow at 10 AM'
      })
    });
  };

  const handleSendMessage = () => {
    toast.success(t('dashboard.trainer.toasts.messageSent.title'), {
      description: t('dashboard.trainer.toasts.messageSent.description')
    });
  };

  const handleCreateExercise = () => {
    const newActivity = {
      id: activities.length + 1,
      text: t('dashboard.trainer.activities.exerciseCreated', { exercise: 'Diamond Push-ups' }),
      time: t('dashboard.trainer.activities.justNow'),
      type: "success" as const
    };
    setActivities(prev => [newActivity, ...prev]);
    toast.success(t('dashboard.trainer.toasts.exerciseCreated.title'), {
      description: t('dashboard.trainer.toasts.exerciseCreated.description', { exercise: 'Diamond Push-ups' })
    });
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'success': return '🟢';
      case 'info': return '🔵';
      case 'warning': return '🟡';
      default: return '⚪';
    }
  };

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">{t('dashboard.trainer.title')}</h1>
          <p className="text-muted-foreground mt-1">
            {t('dashboard.trainer.welcome')} {profile?.full_name ?? t('dashboard.trainer.defaultName')}! {t('dashboard.trainer.description')}
          </p>
        </div>
        <Button
      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title={t('dashboard.trainer.stats.totalAthletes')}
          value="12"
          icon={Users}
          description={t('dashboard.trainer.stats.athletesChange')}
        />
        <StatCard
          title={t('dashboard.trainer.stats.scheduledWorkouts')}
          value="8"
          icon={Calendar}
          description={t('dashboard.trainer.stats.workoutsThisWeek')}
        />
        <StatCard
          title={t('dashboard.trainer.stats.activePrograms')}
          value="5"
          icon={Dumbbell}
          description={t('dashboard.trainer.stats.runningPrograms')}
        />
        <StatCard
          title={t('dashboard.trainer.stats.completionRate')}
          value="87%"
          icon={BarChart3}
          description={t('dashboard.trainer.stats.rateChange')}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>{t('dashboard.trainer.quickActions.title')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Button
                  size="default"
                  onClick={handleScheduleWorkout}
                  className="justify-start h-auto p-4"
                >
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-5 w-5 text-blue-600" />
                    <div className="text-left">
                      <div className="font-medium">{t('dashboard.trainer.quickActions.scheduleWorkout')}</div>
                      <div className="text-xs text-muted-foreground">{t('dashboard.trainer.quickActions.scheduleDescription')}</div>
                    </div>
                  </div>
                </Button>
                <Button
                  size="default"
                  onClick={handleAddAthlete}
                  className="justify-start h-auto p-4"
                >
                  <div className="flex items-center space-x-3">
                    <UserPlus className="h-5 w-5 text-green-600" />
                    <div className="text-left">
                      <div className="font-medium">{t('dashboard.trainer.quickActions.addAthlete')}</div>
                      <div className="text-xs text-muted-foreground">{t('dashboard.trainer.quickActions.expandRoster')}</div>
                    </div>
                  </div>
                </Button>
                <Button
                  size="default"
                  onClick={handleSendMessage}
                  className="justify-start h-auto p-4"
                >
                  <div className="flex items-center space-x-3">
                    <Send className="h-5 w-5 text-purple-600" />
                    <div className="text-left">
                      <div className="font-medium">{t('dashboard.trainer.quickActions.sendMessage')}</div>
                      <div className="text-xs text-muted-foreground">{t('dashboard.trainer.quickActions.communicate')}</div>
                    </div>
                  </div>
                </Button>
                <Button
                  size="default"
                  onClick={handleCreateExercise}
                  className="justify-start h-auto p-4"
                >
                  <div className="flex items-center space-x-3">
                    <PlusCircle className="h-5 w-5 text-orange-600" />
                    <div className="text-left">
                      <div className="font-medium">{t('dashboard.trainer.quickActions.createExercise')}</div>
                      <div className="text-xs text-muted-foreground">{t('dashboard.trainer.quickActions.buildLibrary')}</div>
                    </div>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Button 
                  size="default"
                  onClick={handleScheduleWorkout}
                  className="justify-start h-auto p-4"
                >
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-5 w-5 text-blue-600" />
                    <div className="text-left">
                      <div className="font-medium">Schedule Workout</div>
                      <div className="text-xs text-muted-foreground">Plan training sessions</div>
                    </div>
                  </div>
                </Button>
                <Button 
                  size="default"
                  onClick={handleAddAthlete}
                  className="justify-start h-auto p-4"
                >
                  <div className="flex items-center space-x-3">
                    <UserPlus className="h-5 w-5 text-green-600" />
                    <div className="text-left">
                      <div className="font-medium">Add New Athlete</div>
                      <div className="text-xs text-muted-foreground">Expand your roster</div>
                    </div>
                  </div>
                </Button>
                <Button 
                  size="default"
                  onClick={handleSendMessage}
                  className="justify-start h-auto p-4"
                >
                  <div className="flex items-center space-x-3">
                    <Send className="h-5 w-5 text-purple-600" />
                    <div className="text-left">
                      <div className="font-medium">Send Message</div>
                      <div className="text-xs text-muted-foreground">Communicate with athletes</div>
                    </div>
                  </div>
                </Button>
                <Button 
                  size="default"
                  onClick={handleCreateExercise}
                  className="justify-start h-auto p-4"
                >
                  <div className="flex items-center space-x-3">
                    <PlusCircle className="h-5 w-5 text-orange-600" />
                    <div className="text-left">
                      <div className="font-medium">Create Exercise</div>
                      <div className="text-xs text-muted-foreground">Build exercise library</div>
                    </div>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <ActivityFeed />
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* AI Assistant */}
          <AiChatAssistant />
          
          {/* Subscription Management */}
          <SubscriptionManager />
        </div>
      </div>
    </div>
  );
};
