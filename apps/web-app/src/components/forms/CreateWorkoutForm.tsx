import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, MinusCircle, Youtube } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";

const YOUTUBE_URL_REGEX = /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)[\w-]+(&.*)?$/;

const exerciseSchema = z.object({
  name: z.string().min(1, "Exercise name is required"),
  sets: z.number().min(1, "Sets must be at least 1"),
  reps: z.string().min(1, "Reps are required"),
  rest: z.number().min(0, "Rest time must be 0 or more").optional(),
  workoutType: z.string().optional(),
  youtubeLink: z.string().regex(YOUTUBE_URL_REGEX, "Invalid YouTube URL").optional().or(z.literal("")),
});

const workoutSchema = z.object({
  title: z.string().min(1, "Workout title is required"),
  description: z.string().optional(),
  exercises: z
    .array(exerciseSchema)
    .min(1, "At least one exercise is required"),
});

type WorkoutFormValues = z.infer<typeof workoutSchema>;

interface CreateWorkoutFormProps {
  onSubmit: (data: WorkoutFormValues) => Promise<void>;
  isLoading?: boolean;
}

export const CreateWorkoutForm = ({
  onSubmit,
  isLoading,
}: CreateWorkoutFormProps) => {
  const { t } = useLanguage();
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
      exercises: [{ name: "", sets: 3, reps: "10-12", rest: 60, workoutType: "", youtubeLink: "" }],
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
      toast.success(t("createWorkoutForm.toasts.success"));
    } catch (error) {
      toast.error(t("createWorkoutForm.toasts.error"));
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">{t("createWorkoutForm.titleLabel")}</Label>
          <Input
            id="title"
            {...register("title")}
            placeholder={t("createWorkoutForm.titlePlaceholder")}
          />
          {errors.title && (
            <p className="text-sm text-red-600">{errors.title.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">{t("createWorkoutForm.descriptionLabel")}</Label>
          <Textarea
            id="description"
            {...register("description")}
            placeholder={t("createWorkoutForm.descriptionPlaceholder")}
            rows={3}
          />
          {errors.description && (
            <p className="text-sm text-red-600">{errors.description.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">
            {t("createWorkoutForm.exercises.title")}
          </h3>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              append({ name: "", sets: 3, reps: "10-12", rest: 60, workoutType: "", youtubeLink: "" })
            }
          >
            <PlusCircle className="h-4 w-4 me-2" />
            {t("createWorkoutForm.exercises.add")}
          </Button>
        </div>

        {fields.map((field, index) => (
          <Card key={field.id}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">
                  {t("createWorkoutForm.exercises.exerciseNumber", {
                    number: index + 1,
                  })}
                </CardTitle>
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
                    {t("createWorkoutForm.exercises.name.label")}
                  </Label>
                  <Input
                    id={`exercises.${index}.name`}
                    {...register(`exercises.${index}.name`)}
                    placeholder={t(
                      "createWorkoutForm.exercises.name.placeholder",
                    )}
                  />
                  {errors.exercises?.[index]?.name && (
                    <p className="text-sm text-red-600">
                      {errors.exercises[index]?.name?.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`exercises.${index}.sets`}>
                    {t("createWorkoutForm.exercises.sets.label")}
                  </Label>
                  <Input
                    id={`exercises.${index}.sets`}
                    type="number"
                    {...register(`exercises.${index}.sets`, {
                      valueAsNumber: true,
                    })}
                    placeholder={t(
                      "createWorkoutForm.exercises.sets.placeholder",
                    )}
                  />
                  {errors.exercises?.[index]?.sets && (
                    <p className="text-sm text-red-600">
                      {errors.exercises[index]?.sets?.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`exercises.${index}.reps`}>
                    {t("createWorkoutForm.exercises.reps.label")}
                  </Label>
                  <Input
                    id={`exercises.${index}.reps`}
                    {...register(`exercises.${index}.reps`)}
                    placeholder={t(
                      "createWorkoutForm.exercises.reps.placeholder",
                    )}
                  />
                  {errors.exercises?.[index]?.reps && (
                    <p className="text-sm text-red-600">
                      {errors.exercises[index]?.reps?.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`exercises.${index}.rest`}>
                    {t("createWorkoutForm.exercises.rest.label")}
                  </Label>
                  <Input
                    id={`exercises.${index}.rest`}
                    type="number"
                    {...register(`exercises.${index}.rest`, {
                      valueAsNumber: true,
                    })}
                    placeholder={t(
                      "createWorkoutForm.exercises.rest.placeholder",
                    )}
                  />
                  {errors.exercises?.[index]?.rest && (
                    <p className="text-sm text-red-600">
                      {errors.exercises[index]?.rest?.message}
                    </p>
                  )}
                </div>

                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor={`exercises.${index}.workoutType`}>
                    {t("createWorkoutForm.exercises.workoutType.label")}
                  </Label>
                  <Select
                    value={fields[index].workoutType}
                    onValueChange={(value) => {
                      const currentValues = fields[index];
                      const updatedExercise = { ...currentValues, workoutType: value };
                      // Update the form value
                      const exercises = [...(control._formValues.exercises || [])];
                      exercises[index] = updatedExercise;
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t("createWorkoutForm.exercises.workoutType.placeholder")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bodyweight">{t("exerciseLibrary.workoutTypes.bodyweight")}</SelectItem>
                      <SelectItem value="machine">{t("exerciseLibrary.workoutTypes.machine")}</SelectItem>
                      <SelectItem value="barbell">{t("exerciseLibrary.workoutTypes.barbell")}</SelectItem>
                      <SelectItem value="dumbbell">{t("exerciseLibrary.workoutTypes.dumbbell")}</SelectItem>
                      <SelectItem value="cable">{t("exerciseLibrary.workoutTypes.cable")}</SelectItem>
                      <SelectItem value="resistance_band">{t("exerciseLibrary.workoutTypes.resistance_band")}</SelectItem>
                      <SelectItem value="other">{t("exerciseLibrary.workoutTypes.other")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor={`exercises.${index}.youtubeLink`}>
                    {t("createWorkoutForm.exercises.youtubeLink.label")}
                  </Label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Youtube className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-red-600" />
                      <Input
                        id={`exercises.${index}.youtubeLink`}
                        {...register(`exercises.${index}.youtubeLink`)}
                        placeholder={t("createWorkoutForm.exercises.youtubeLink.placeholder")}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  {errors.exercises?.[index]?.youtubeLink && (
                    <p className="text-sm text-red-600">
                      {t("createWorkoutForm.exercises.youtubeLink.invalid")}
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

      <Button
        type="submit"
        size="default"
        className="w-full"
        disabled={isLoading}
      >
        {isLoading ? t("createWorkoutForm.creatingButton") : t("createWorkoutForm.createButton")}
      </Button>
    </form>
  );
};
