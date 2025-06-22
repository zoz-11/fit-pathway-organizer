
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, Clock, Target, Flame } from "lucide-react";
import { toast } from "sonner";

interface Exercise {
  name: string;
  sets: number;
  reps: string;
  duration?: string;
  image: string;
  description: string;
}

interface WorkoutDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartWorkout: () => void;
}

export const WorkoutDetailsModal = ({ isOpen, onClose, onStartWorkout }: WorkoutDetailsModalProps) => {
  const exercises: Exercise[] = [
    {
      name: "Push-ups",
      sets: 3,
      reps: "10-15",
      image: "💪",
      description: "Classic bodyweight exercise targeting chest, shoulders, and triceps"
    },
    {
      name: "Pull-ups",
      sets: 3,
      reps: "5-10",
      image: "🏃",
      description: "Upper body strength exercise focusing on back and biceps"
    },
    {
      name: "Bench Press",
      sets: 4,
      reps: "8-12",
      image: "🏋️",
      description: "Compound exercise for chest, shoulders, and triceps development"
    },
    {
      name: "Shoulder Press",
      sets: 3,
      reps: "10-12",
      image: "💪",
      description: "Overhead pressing movement for shoulder and arm strength"
    },
    {
      name: "Bicep Curls",
      sets: 3,
      reps: "12-15",
      image: "💪",
      description: "Isolation exercise targeting the biceps muscles"
    },
    {
      name: "Tricep Dips",
      sets: 3,
      reps: "8-12",
      image: "🏃",
      description: "Bodyweight exercise focusing on triceps and chest"
    }
  ];

  const handleStartWorkout = () => {
    onStartWorkout();
    onClose();
  };

  const handleWatchDemo = (exerciseName: string) => {
    toast.info(`Opening video demo for ${exerciseName}`);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Upper Body Strength Workout</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Workout Summary */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <Clock className="h-6 w-6 text-blue-600 mx-auto mb-1" />
              <p className="text-sm font-medium">Duration</p>
              <p className="text-lg font-bold text-blue-600">45 min</p>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <Target className="h-6 w-6 text-green-600 mx-auto mb-1" />
              <p className="text-sm font-medium">Exercises</p>
              <p className="text-lg font-bold text-green-600">6</p>
            </div>
            <div className="text-center p-3 bg-orange-50 rounded-lg">
              <Flame className="h-6 w-6 text-orange-600 mx-auto mb-1" />
              <p className="text-sm font-medium">Difficulty</p>
              <p className="text-lg font-bold text-orange-600">Medium</p>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <Target className="h-6 w-6 text-purple-600 mx-auto mb-1" />
              <p className="text-sm font-medium">Target</p>
              <p className="text-lg font-bold text-purple-600">Upper</p>
            </div>
          </div>

          {/* Exercise List */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Exercises</h3>
            {exercises.map((exercise, index) => (
              <div key={index} className="border rounded-lg p-4 hover:bg-gray-50">
                <div className="flex items-start space-x-4">
                  <div className="text-3xl">{exercise.image}</div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-lg">{exercise.name}</h4>
                      <div className="flex space-x-2">
                        <Badge variant="secondary">{exercise.sets} sets</Badge>
                        <Badge variant="outline">{exercise.reps} reps</Badge>
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm mb-3">{exercise.description}</p>
                    <div className="flex space-x-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleWatchDemo(exercise.name)}
                      >
                        <Play className="h-4 w-4 mr-1" />
                        Watch Demo
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4 border-t">
            <Button onClick={handleStartWorkout} className="flex-1">
              <Play className="h-4 w-4 mr-2" />
              Start Workout
            </Button>
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
