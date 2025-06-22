
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, Users } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { toast } from "sonner";

const Schedule = () => {
  const handleJoinWorkout = (workoutName: string) => {
    toast.success(`Joined ${workoutName}!`);
  };

  const handleCancelWorkout = (workoutName: string) => {
    toast.info(`Cancelled ${workoutName}`);
  };

  const workouts = [
    {
      id: 1,
      name: "Upper Body Strength",
      time: "9:00 AM - 10:00 AM",
      date: "Today",
      location: "Gym Floor A",
      trainer: "Mike Johnson",
      spots: "3/10",
      status: "confirmed"
    },
    {
      id: 2,
      name: "Cardio Blast",
      time: "6:00 PM - 6:30 PM",
      date: "Tomorrow",
      location: "Cardio Room",
      trainer: "Sarah Smith",
      spots: "5/12",
      status: "pending"
    },
    {
      id: 3,
      name: "Yoga Flow",
      time: "7:00 AM - 8:00 AM",
      date: "Sunday",
      location: "Studio B",
      trainer: "Emma Wilson",
      spots: "8/15",
      status: "available"
    }
  ];

  return (
    <AppLayout>
      <div className="space-y-6 p-4 md:p-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">My Schedule</h1>
          <p className="text-muted-foreground mt-1">
            Manage your upcoming workouts and training sessions
          </p>
        </div>

        <div className="grid gap-6">
          {workouts.map((workout) => (
            <Card key={workout.id} className="w-full">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-5 w-5 text-blue-600" />
                    <div>
                      <CardTitle className="text-lg">{workout.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">{workout.date}</p>
                    </div>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                    workout.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                    workout.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
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
                    <span>{workout.spots} spots available</span>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-2">
                  <p className="text-sm text-gray-600">Trainer: {workout.trainer}</p>
                  <div className="flex gap-2">
                    {workout.status === 'available' && (
                      <Button 
                        size="sm" 
                        onClick={() => handleJoinWorkout(workout.name)}
                      >
                        Join Workout
                      </Button>
                    )}
                    {workout.status === 'confirmed' && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleCancelWorkout(workout.name)}
                      >
                        Cancel
                      </Button>
                    )}
                    {workout.status === 'pending' && (
                      <Button 
                        variant="secondary" 
                        size="sm"
                        disabled
                      >
                        Pending Approval
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AppLayout>
  );
};

export default Schedule;
