import { Loader2 } from "lucide-react";

interface LoadingScreenProps {
  message?: string;
}

export const LoadingScreen = ({
  message = "Loading...",
}: LoadingScreenProps) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-accent/5">
      <div className="text-center space-y-4">
        <div className="relative">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
          <div className="absolute inset-0 h-12 w-12 border-2 border-primary/20 rounded-full mx-auto animate-pulse" />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-foreground">
            FitPathway Organizer
          </h2>
          <p className="text-muted-foreground">{message}</p>
        </div>
      </div>
    </div>
  );
};
