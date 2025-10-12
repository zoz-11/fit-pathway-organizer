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
import { useLanguage } from "@/contexts/LanguageContext";

const assignWorkoutSchema = z.object({
  workoutId: z.string(),
  athleteId: z.string(),
  dueDate: z.string(),
  title: z.string().min(1, "Workout title is required"),
});

type AssignWorkoutFormValues = z.infer<typeof assignWorkoutSchema>;
export const AssignWorkoutDialog = () => {
  const { t } = useLanguage();
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
      toast.success(t('assignWorkoutDialog.toasts.success'));
      setOpen(false);
    } catch (error) {
      toast.error(t('assignWorkoutDialog.toasts.error'));
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="default">{t('assignWorkoutDialog.trigger')}</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('assignWorkoutDialog.title')}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">{t('assignWorkoutDialog.form.title.label')}</Label>
            <Input
              id="title"
              {...register("title")}
              placeholder={t('assignWorkoutDialog.form.title.placeholder')}
            />
            {errors.title && (
              <p className="text-sm text-red-600">{errors.title.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label>{t('assignWorkoutDialog.form.athlete.label')}</Label>
            <Select onValueChange={(value) => setValue("athleteId", value)}>
              <SelectTrigger>
                <SelectValue placeholder={t('assignWorkoutDialog.form.athlete.placeholder')} />
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
            <Label htmlFor="dueDate">{t('assignWorkoutDialog.form.dueDate.label')}</Label>
            <Input id="dueDate" type="date" {...register("dueDate")} />
            {errors.dueDate && (
              <p className="text-sm text-red-600">{errors.dueDate.message}</p>
            )}
          </div>
          <Button type="submit" size="default" className="w-full" disabled={assignWorkout.isPending}>
            {assignWorkout.isPending ? t('assignWorkoutDialog.form.submit.assigning') : t('assignWorkoutDialog.form.submit.assign')}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};