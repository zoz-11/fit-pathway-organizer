import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useWorkouts } from "@/hooks/useWorkouts";
import { CreateWorkoutForm } from "@/components/forms/CreateWorkoutForm";
import { PlusCircle } from "lucide-react";

export const CreateWorkoutDialog = () => {
  const [open, setOpen] = useState(false);
  const { createWorkout } = useWorkouts();

  interface WorkoutFormData {
    title: string;
    description: string;
    exercises: Array<{
      name: string;
      sets: number;
      reps: number;
    }>;
  }

  const handleSubmit = async (data: WorkoutFormData) => {
    await createWorkout.mutateAsync({
      name: data.title,
      description: data.description,
      exercises: data.exercises.map((ex) => ({
        name: ex.name,
        sets: ex.sets,
        reps: ex.reps
      }))
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="h-4 w-4 mr-2" />
          Create New Workout
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Workout</DialogTitle>
        </DialogHeader>
        <CreateWorkoutForm 
          onSubmit={handleSubmit} 
          isLoading={createWorkout.isPending} 
        />
      </DialogContent>
    </Dialog>
  );
};
