import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Trophy, Target, Flame, Play, Clock, Dumbbell } from "lucide-react";
import { AiChatAssistant } from "@/components/ai/AiChatAssistant";
import { SubscriptionManager } from "@/components/subscription/SubscriptionManager";
import { WorkoutDetailsModal } from "@/components/workout/WorkoutDetailsModal";
import { useAuth } from "@/hooks/useAuth";
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
  const [workoutInProgress, setWorkoutInProgress] = useState(false);
  const [workoutTime, setWorkoutTime] = useState(0);
  const [showWorkoutModal, setShowWorkoutModal] = useState(false);

  const handleStartWorkout = () => {
    if (!workoutInProgress) {
      setWorkoutInProgress(true);
      setWorkoutTime(0);
      toast.success("Workout started! Timer is now running.");
      
      const timer = setInterval(() => {
        setWorkoutTime(prev => prev + 1);
      }, 1000);
      
      (window as any).workoutTimer = timer;
    } else {
      setWorkoutInProgress(false);
      clearInterval((window as any).workoutTimer);
      const minutes = Math.floor(workoutTime / 60);
      const seconds = workoutTime % 60;
      toast.success(`Workout completed! Duration: ${minutes}m ${seconds}s`);
      setWorkoutTime(0);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleViewDetails = () => {
    setShowWorkoutModal(true);
  };

  const handleScheduleWorkout = () => {
    toast.success("Workout scheduled!", {
      description: "Your workout has been added to your calendar"
    });
  };

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">My Fitness Journey</h1>
          <p className="text-muted-foreground mt-1">
            Welcome back, {profile?.full_name || 'Athlete'}! Ready to crush your fitness goals?
          </p>
        </div>
        <Button 
          onClick={handleStartWorkout}
          className={`${
            workoutInProgress 
              ? 'bg-red-500 hover:bg-red-600' 
              : 'bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600'
          } w-full md:w-auto px-6 py-2`}
        >
          {workoutInProgress ? (
            <>
              <Clock className="mr-2 h-4 w-4" />
              End Workout ({formatTime(workoutTime)})
            </>
          ) : (
            <>
              <Play className="mr-2 h-4 w-4" />
              Start Workout
            </>
          )}
        </Button>
      </div>

      {workoutInProgress && (
        <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <div>
                  <h3 className="font-semibold text-lg">Workout In Progress</h3>
                  <p className="text-sm text-muted-foreground">Upper Body Strength</p>
                </div>
              </div>
              <div className="text-2xl font-bold text-green-600">
                {formatTime(workoutTime)}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Workouts This Week"
          value="4"
          icon={Calendar}
          description="2 more to go!"
        />
        <StatCard
          title="Streak"
          value="7 days"
          icon={Flame}
          description="Personal best!"
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

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Today's Workout</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg">
                <div className="flex items-center space-x-3 mb-2">
                  <Dumbbell className="h-5 w-5 text-blue-600" />
                  <h3 className="font-semibold text-lg">Upper Body Strength</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-3">45 minutes • 6 exercises</p>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button 
                    size="sm" 
                    onClick={handleStartWorkout}
                    className="flex-1 sm:flex-none"
                    variant={workoutInProgress ? "destructive" : "default"}
                  >
                    {workoutInProgress ? (
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
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Weekly Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
                  <div key={day} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50">
                    <span className="font-medium">{day}</span>
                    <div className="flex items-center space-x-2">
                      {index < 4 && <span className="text-green-600 font-semibold">✓ Completed</span>}
                      {index === 4 && <span className="text-blue-600 font-semibold">Today</span>}
                      {index > 4 && <span className="text-gray-400">Planned</span>}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Upcoming Workouts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { name: 'Cardio Blast', time: 'Tomorrow • 30 min', icon: '🏃' },
                  { name: 'Leg Day', time: 'Sunday • 60 min', icon: '🦵' },
                  { name: 'Core & Flexibility', time: 'Monday • 20 min', icon: '🧘' }
                ].map((workout, index) => (
                  <div key={index} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 bg-gray-50 rounded-lg gap-2">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{workout.icon}</span>
                      <div>
                        <p className="font-medium">{workout.name}</p>
                        <p className="text-sm text-muted-foreground">{workout.time}</p>
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={handleScheduleWorkout}
                      className="w-full sm:w-auto"
                    >
                      Schedule
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <AiChatAssistant />
          <SubscriptionManager />
        </div>
      </div>

      <WorkoutDetailsModal
        isOpen={showWorkoutModal}
        onClose={() => setShowWorkoutModal(false)}
        onStartWorkout={handleStartWorkout}
      />
    </div>
  );
};
