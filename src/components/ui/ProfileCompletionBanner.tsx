import { useAuth } from "@/hooks/useAuthProvider";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export const ProfileCompletionBanner = () => {
  const { profile } = useAuth();

  if (!profile) return null;

  const isProfileIncomplete = !profile.phone || !profile.date_of_birth || !profile.emergency_contact_name || !profile.emergency_contact_phone;

  if (!isProfileIncomplete) return null;

  return (
    <Alert className="mb-4 bg-yellow-50 border-yellow-200">
      <AlertTitle className="mb-2">Complete Your Profile</AlertTitle>
      <AlertDescription className="mb-3">
        Your profile is incomplete. Please update it to get the most out of FitPathway Organizer.
      </AlertDescription>
      <Button asChild size="sm">
        <Link to="/profile">Complete Profile</Link>
      </Button>
    </Alert>
  );
};