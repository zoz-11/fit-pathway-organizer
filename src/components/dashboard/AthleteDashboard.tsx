
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Trophy, Target, Flame, Play, Clock, Dumbbell } from "lucide-react";
import { AiChatAssistant } from "@/components/ai/AiChatAssistant";
import { SubscriptionManager } from "@/components/subscription/SubscriptionManager";
import { WorkoutDetailsModal } from "@/components/workout/WorkoutDetailsModal";
import { useAuth } from "@/hooks/useAuth";
import { useStreaks } from "@/hooks/useStreaks";
import { toast } from "sonner";
import { useState } from "react";

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

export const AthleteDashboard = () => {
  const { profile } = useAuth();
  const { data: streakData, isLoading: isLoadingStreaks } = useStreaks();
  const [workoutInProgress, setWorkoutInProgress] = useState(false);
  const [workoutTime, setWorkoutTime] = useState(0);
  const [showWorkoutModal, setShowWorkoutModal] = useState(false);
  const [workoutCompleted, setWorkoutCompleted] = useState(false);

  const handleStartWorkout = () => {
    if (!workoutInProgress && !workoutCompleted) {
      setWorkoutInProgress(true);
      setWorkoutTime(0);
      toast.success("Workout started! Timer is now running.");
      
      const timer = setInterval(() => {
        setWorkoutTime(prev => prev + 1);
      }, 1000);

      interface CustomWindow extends Window {
        workoutTimer?: NodeJS.Timeout;
      }

      (window as CustomWindow).workoutTimer = timer;
    } else if (workoutInProgress) {
      setWorkoutInProgress(false);
      setWorkoutCompleted(true);
      clearInterval((window as CustomWindow).workoutTimer);
      const minutes = Math.floor(workoutTime / 60);
      const seconds = workoutTime % 60;
      toast.success(`Workout completed! Duration: ${minutes}m ${seconds}s`);
    }
  };

  const handleViewDetails = () => {
    setShowWorkoutModal(true);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">My Fitness Journey</h1>
          <p className="text-muted-foreground">
            Welcome back, Athlete! Ready to crush your fitness goals?
          </p>
        </div>
        <Button 
          onClick={() => toast.success("Starting new workout session!")}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium"
        >
          <Dumbbell className="mr-2 h-4 w-4" />
          Start Workout
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Workouts This Week"
          value="4"
          icon={Calendar}
          description="2 more to go!"
        />
        <StatCard
          title="Streak"
          value={isLoadingStreaks ? "..." : `${streakData?.currentStreak || 0} days`}
          icon={Flame}
          description="Current streak!"
        />
        <StatCard
          title="Goals Achieved"
          value="3/5"
          icon={Target}
          description="60% complete"
        />
        <StatCard
          title="Total Workouts"
          value="42"
          icon={Trophy}
          description="This month"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Today's Workout */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Dumbbell className="h-5 w-5 text-blue-600" />
              Today's Workout
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-green-800 dark:text-green-200">Upper Body Strength</h3>
                  <span className="text-sm text-green-600 dark:text-green-400">45 minutes • 6 exercises</span>
                </div>
                <p className="text-sm text-green-700 dark:text-green-300 mb-3">
                  Focus on building upper body strength with compound movements
                </p>
                {workoutInProgress && (
                  <div className="mb-3 p-2 bg-blue-100 dark:bg-blue-900/30 rounded text-center">
                    <span className="text-blue-800 dark:text-blue-200 font-mono text-lg">
                      {formatTime(workoutTime)}
                    </span>
                  </div>
                )}
                <div className="flex gap-2">
                  <Button 
                    onClick={handleStartWorkout}
                    className={`flex-1 sm:flex-none ${
                      workoutCompleted 
                        ? 'bg-green-600 hover:bg-green-700' 
                        : workoutInProgress 
                          ? 'bg-red-600 hover:bg-red-700' 
                          : 'bg-blue-600 hover:bg-blue-700'
                    }`}
                    disabled={workoutCompleted}
                  >
                    {workoutCompleted ? (
                      <>
                        <Trophy className="mr-2 h-4 w-4" />
                        Completed
                      </>
                    ) : workoutInProgress ? (
                      <>
                        <Clock className="mr-2 h-4 w-4" />
                        End Workout
                      </>
                    ) : (
                      <>
                        <Play className="mr-2 h-4 w-4" />
                        Start Now
                      </>
                    )}
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleViewDetails}
                    className="flex-1 sm:flex-none"
                  >
                    View Details
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* AI Chat Assistant */}
        <div className="mb-6">
          <AiChatAssistant />
        </div>
      </div>

      {/* Weekly Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Weekly Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { day: 'Mon', completed: true },
              { day: 'Tue', completed: true },
              { day: 'Wed', completed: true },
              { day: 'Thu', completed: true },
              { day: 'Fri', completed: false },
              { day: 'Sat', completed: false },
              { day: 'Sun', completed: false }
            ].map((day, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                <span className="font-medium">{day.day}</span>
                <span className={`text-sm px-2 py-1 rounded ${
                  day.completed 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' 
                    : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                }`}>
                  {day.completed ? '✓ Completed' : 'Pending'}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <SubscriptionManager />
      
      {showWorkoutModal && (
        <WorkoutDetailsModal 
          isOpen={showWorkoutModal}
          onClose={() => setShowWorkoutModal(false)}
          onStartWorkout={() => {
            console.log("Starting workout from dashboard");
            setShowWorkoutModal(false);
          }}
        />
      )}
    </div>
  );
};
