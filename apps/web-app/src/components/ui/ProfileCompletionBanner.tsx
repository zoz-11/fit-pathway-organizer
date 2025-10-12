import { useAuth } from "@/hooks/useAuthProvider";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

export const ProfileCompletionBanner = () => {
  const { profile } = useAuth();
  const { t } = useLanguage();

  if (!profile) return null;

  const isProfileIncomplete = !profile.phone || !profile.date_of_birth || !profile.emergency_contact_name || !profile.emergency_contact_phone;

  if (!isProfileIncomplete) return null;

  return (
    <Alert className="mb-4 bg-yellow-50 border-yellow-200">
      <AlertTitle className="mb-2">{t('profile.completion.title')}</AlertTitle>
      <AlertDescription className="mb-3">
        {t('profile.completion.description')}
      </AlertDescription>
      <Button asChild size="sm">
        <Link to="/profile">{t('profile.completion.button')}</Link>
      </Button>
    </Alert>
  );
};