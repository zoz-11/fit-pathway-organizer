import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useTrainerAthletes } from "@/hooks/useTrainerAthletes";

interface RemoveAthleteDialogProps {
  athleteId: string;
  athleteName: string;
}

export const RemoveAthleteDialog = ({ athleteId, athleteName }: RemoveAthleteDialogProps) => {
  const { removeAthlete } = useTrainerAthletes();

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <span className="flex items-center text-red-600 cursor-pointer">
          <Trash2 className="mr-2 h-4 w-4" />
          Remove Athlete
        </span>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently remove {athleteName} from your roster. This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={() => removeAthlete.mutate(athleteId)}>
            Yes, remove
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};