import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useWorkouts } from "@/hooks/useWorkouts";
import { PlusCircle, MinusCircle } from "lucide-react";

const exerciseSchema = z.object({
  name: z.string().min(1, "Exercise name is required"),
  sets: z.number().min(1, "Sets must be at least 1"),
  reps: z.string().min(1, "Reps are required"),
});

const workoutSchema = z.object({
  name: z.string().min(1, "Workout name is required"),
  description: z.string().optional(),
  exercises: z
    .array(exerciseSchema)
    .min(1, "At least one exercise is required"),
});

type WorkoutFormValues = z.infer<typeof workoutSchema>;

export const CreateWorkoutDialog = () => {
  const [open, setOpen] = useState(false);
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<WorkoutFormValues>({
    resolver: zodResolver(workoutSchema),
    defaultValues: {
      name: "",
      description: "",
      exercises: [{ name: "", sets: 3, reps: "10-12" }],
    },
  });
  const { createWorkout } = useWorkouts();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "exercises",
  });

  const onSubmit = (data: WorkoutFormValues) => {
    createWorkout.mutate({
      name: data.name,
      description: data.description,
      exercises: data.exercises.map(ex => ({
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
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create New Workout</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Workout Name</Label>
            <Input id="name" {...register("name")} />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input id="description" {...register("description")} />
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Exercises</h3>
            {fields.map((field, index) => (
              <Card key={field.id} className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="md:col-span-2 space-y-2">
                    <Label htmlFor={`exercises.${index}.name`}>
                      Exercise Name
                    </Label>
                    <Input
                      id={`exercises.${index}.name`}
                      {...register(`exercises.${index}.name`)}
                    />
                    {errors.exercises?.[index]?.name && (
                      <p className="text-red-500 text-sm">
                        {errors.exercises[index]?.name?.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`exercises.${index}.sets`}>Sets</Label>
                    <Input
                      id={`exercises.${index}.sets`}
                      type="number"
                      {...register(`exercises.${index}.sets`, {
                        valueAsNumber: true,
                      })}
                    />
                    {errors.exercises?.[index]?.sets && (
                      <p className="text-red-500 text-sm">
                        {errors.exercises[index]?.sets?.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`exercises.${index}.reps`}>Reps</Label>
                    <Input
                      id={`exercises.${index}.reps`}
                      {...register(`exercises.${index}.reps`)}
                    />
                    {errors.exercises?.[index]?.reps && (
                      <p className="text-red-500 text-sm">
                        {errors.exercises[index]?.reps?.message}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex justify-end mt-4">
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => remove(index)}
                  >
                    <MinusCircle className="h-4 w-4 mr-2" />
                    Remove Exercise
                  </Button>
                </div>
              </Card>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={() => append({ name: "", sets: 3, reps: "10-12" })}
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Exercise
            </Button>
          </div>

          <Button type="submit" className="w-full">
            Create Workout
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
