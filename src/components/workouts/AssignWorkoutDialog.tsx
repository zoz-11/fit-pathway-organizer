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
import { toast } from "sonner";

const assignWorkoutSchema = z.object({
  workoutId: z.string(),
  athleteId: z.string(),
  dueDate: z.string(),
  title: z.string().min(1, "Workout title is required"),
});

type AssignWorkoutFormValues = z.infer<typeof assignWorkoutSchema>;

export const AssignWorkoutDialog = () => {
  const [open, setOpen] = useState(false);
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<AssignWorkoutFormValues>({
    resolver: zodResolver(assignWorkoutSchema),
  });
  const { assignWorkout } = useWorkoutAssignments();
  const { workouts } = useWorkouts();
  const { athletes } = useTrainerAthletes();

  const onSubmit = async (data: AssignWorkoutFormValues) => {
    try {
      await assignWorkout.mutateAsync({
        workoutId: 1, // Using a placeholder since we're creating a new workout
        athleteId: data.athleteId,
        dueDate: data.dueDate,
        title: data.title
      });
      toast.success("Workout assigned successfully!");
      setOpen(false);
    } catch (error) {
      toast.error("Failed to assign workout. Please try again.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="default">Assign Workout</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Assign a Workout</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Workout Title</Label>
            <Input 
              id="title" 
              {...register("title")} 
              placeholder="Enter workout title"
            />
            {errors.title && (
              <p className="text-sm text-red-600">{errors.title.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label>Athlete</Label>
            <Select onValueChange={(value) => setValue("athleteId", value)}>
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
            {errors.athleteId && (
              <p className="text-sm text-red-600">{errors.athleteId.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="dueDate">Due Date</Label>
            <Input id="dueDate" type="date" {...register("dueDate")} />
            {errors.dueDate && (
              <p className="text-sm text-red-600">{errors.dueDate.message}</p>
            )}
          </div>
          <Button type="submit" size="default" className="w-full" disabled={assignWorkout.isPending}>
            {assignWorkout.isPending ? "Assigning..." : "Assign Workout"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};