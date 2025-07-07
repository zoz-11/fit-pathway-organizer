import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, MinusCircle } from "lucide-react";
import { toast } from "sonner";

const exerciseSchema = z.object({
  name: z.string().min(1, "Exercise name is required"),
  sets: z.number().min(1, "Sets must be at least 1"),
  reps: z.string().min(1, "Reps are required"),
  rest: z.number().min(0, "Rest time must be 0 or more").optional(),
});

const workoutSchema = z.object({
  title: z.string().min(1, "Workout title is required"),
  description: z.string().optional(),
  exercises: z.array(exerciseSchema).min(1, "At least one exercise is required"),
});

type WorkoutFormValues = z.infer<typeof workoutSchema>;

interface CreateWorkoutFormProps {
  onSubmit: (data: WorkoutFormValues) => Promise<void>;
  isLoading?: boolean;
}

export const CreateWorkoutForm = ({ onSubmit, isLoading }: CreateWorkoutFormProps) => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<WorkoutFormValues>({
    resolver: zodResolver(workoutSchema),
    defaultValues: {
      title: "",
      description: "",
      exercises: [{ name: "", sets: 3, reps: "10-12", rest: 60 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "exercises",
  });

  const handleFormSubmit = async (data: WorkoutFormValues) => {
    try {
      await onSubmit(data);
      reset();
      toast.success("Workout created successfully!");
    } catch (error) {
      toast.error("Failed to create workout. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div className="space-y-4">
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
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            {...register("description")}
            placeholder="Enter workout description (optional)"
            rows={3}
          />
          {errors.description && (
            <p className="text-sm text-red-600">{errors.description.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Exercises</h3>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => append({ name: "", sets: 3, reps: "10-12", rest: 60 })}
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Exercise
          </Button>
        </div>

        {fields.map((field, index) => (
          <Card key={field.id}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Exercise {index + 1}</CardTitle>
                {fields.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => remove(index)}
                  >
                    <MinusCircle className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor={`exercises.${index}.name`}>
                    Exercise Name
                  </Label>
                  <Input
                    id={`exercises.${index}.name`}
                    {...register(`exercises.${index}.name`)}
                    placeholder="e.g., Push-ups, Squats"
                  />
                  {errors.exercises?.[index]?.name && (
                    <p className="text-sm text-red-600">
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
                    placeholder="3"
                  />
                  {errors.exercises?.[index]?.sets && (
                    <p className="text-sm text-red-600">
                      {errors.exercises[index]?.sets?.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`exercises.${index}.reps`}>Reps</Label>
                  <Input
                    id={`exercises.${index}.reps`}
                    {...register(`exercises.${index}.reps`)}
                    placeholder="10-12 or 30 seconds"
                  />
                  {errors.exercises?.[index]?.reps && (
                    <p className="text-sm text-red-600">
                      {errors.exercises[index]?.reps?.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`exercises.${index}.rest`}>Rest (seconds)</Label>
                  <Input
                    id={`exercises.${index}.rest`}
                    type="number"
                    {...register(`exercises.${index}.rest`, {
                      valueAsNumber: true,
                    })}
                    placeholder="60"
                  />
                  {errors.exercises?.[index]?.rest && (
                    <p className="text-sm text-red-600">
                      {errors.exercises[index]?.rest?.message}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {errors.exercises && (
          <p className="text-sm text-red-600">{errors.exercises.message}</p>
        )}
      </div>

      <Button type="submit" size="default" className="w-full" disabled={isLoading}>
        {isLoading ? "Creating..." : "Create Workout"}
      </Button>
    </form>
  );
};