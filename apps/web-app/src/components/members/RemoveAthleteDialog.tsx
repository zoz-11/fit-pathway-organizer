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
import { useLanguage } from "@/contexts/LanguageContext";

interface RemoveAthleteDialogProps {
  athleteId: string;
  athleteName: string;
}

export const RemoveAthleteDialog = ({ athleteId, athleteName }: RemoveAthleteDialogProps) => {
  const { t } = useLanguage();
  const { removeAthlete } = useTrainerAthletes();

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <span className="flex items-center text-red-600 cursor-pointer">
          <Trash2 className="mr-2 h-4 w-4" />
          {t('removeAthleteDialog.trigger')}
        </span>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t('removeAthleteDialog.title')}</AlertDialogTitle>
          <AlertDialogDescription>
            {t('removeAthleteDialog.description', { athleteName })}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{t('removeAthleteDialog.cancel')}</AlertDialogCancel>
          <AlertDialogAction onClick={() => removeAthlete.mutate(athleteId)}>
            {t('removeAthleteDialog.confirm')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};