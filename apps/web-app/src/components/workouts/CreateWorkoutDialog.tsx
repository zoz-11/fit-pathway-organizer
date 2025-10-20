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
import { useLanguage } from "@/contexts/LanguageContext";

export const CreateWorkoutDialog = () => {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const { createWorkout } = useWorkouts();

  const handleSubmit = async (data: any) => {
    await createWorkout.mutateAsync({
      name: data.title,
      description: data.description,
      exercises: data.exercises.map((ex: any) => ({
        name: ex.name,
        sets: ex.sets,
        reps: ex.reps,
      })),
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="h-4 w-4 me-2" />
          {t("createWorkoutDialog.createWorkout")}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t("createWorkoutDialog.title")}</DialogTitle>
        </DialogHeader>
        <CreateWorkoutForm
          onSubmit={handleSubmit}
          isLoading={createWorkout.isPending}
        />
      </DialogContent>
    </Dialog>
  );
};
