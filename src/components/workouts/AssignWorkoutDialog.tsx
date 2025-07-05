import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useWorkoutAssignments } from "@/hooks/useWorkoutAssignments";
import { useWorkouts } from "@/hooks/useWorkouts";
import { useTrainerAthletes } from "@/hooks/useTrainerAthletes";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const assignWorkoutSchema = z.object({
  workoutId: z.number(),
  athleteId: z.string(),
  dueDate: z.string(),
});

type AssignWorkoutFormValues = z.infer<typeof assignWorkoutSchema>;

export const AssignWorkoutDialog = () => {
  const [open, setOpen] = useState(false);
  const { register, handleSubmit } = useForm<AssignWorkoutFormValues>({
    resolver: zodResolver(assignWorkoutSchema),
  });
  const { assignWorkout } = useWorkoutAssignments();
  const { workouts } = useWorkouts();
  const { athletes } = useTrainerAthletes();

  const onSubmit = (data: AssignWorkoutFormValues) => {
    assignWorkout.mutate(data);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Assign Workout</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Assign a Workout</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label>Workout</Label>
            <Select {...register("workoutId")}>
              <SelectTrigger>
                <SelectValue placeholder="Select a workout" />
              </SelectTrigger>
              <SelectContent>
                {workouts?.map((workout) => (
                  <SelectItem key={workout.id} value={workout.id}>
                    {workout.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Athlete</Label>
            <Select {...register("athleteId")}>
              <SelectTrigger>
                <SelectValue placeholder="Select an athlete" />
              </SelectTrigger>
              <SelectContent>
                {athletes?.map((athlete) => (
                  <SelectItem key={athlete.id} value={athlete.id}>
                    {athlete.full_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="dueDate">Due Date</Label>
            <Input id="dueDate" type="date" {...register("dueDate")} />
          </div>
          <Button type="submit" className="w-full">Assign Workout</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};