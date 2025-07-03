import { useAuth } from "@/hooks/useAuth";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export const ProfileCompletionBanner = () => {
  const { profile } = useAuth();

  if (!profile) return null;

  const isProfileIncomplete = !profile.phone || !profile.location || !profile.fitness_level;

  if (!isProfileIncomplete) return null;

  return (
    <Alert className="mb-4 bg-yellow-50 border-yellow-200">
      <AlertTitle>Complete Your Profile</AlertTitle>
      <AlertDescription>
        Your profile is incomplete. Please update it to get the most out of FitPathway Organizer.
      </AlertDescription>
      <Button asChild className="mt-2">
        <Link to="/profile">Complete Profile</Link>
      </Button>
    </Alert>
  );
};