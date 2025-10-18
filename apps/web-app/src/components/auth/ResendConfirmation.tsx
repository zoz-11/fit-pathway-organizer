import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";

interface ResendConfirmationProps {
  email: string;
}

export const ResendConfirmation = ({ email }: ResendConfirmationProps) => {
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const handleResend = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.resend({
        type: "signup",
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
        },
      });

      if (error) {
        toast.error(error.message);
      } else {
        toast.success("Confirmation email sent! Check your inbox.");
        setCountdown(60); // 60 second cooldown

        const timer = setInterval(() => {
          setCountdown((prev) => {
            if (prev <= 1) {
              clearInterval(timer);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      }
    } catch (error) {
      toast.error("Failed to resend confirmation email");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 mt-4">
      <Alert>
        <AlertDescription>
          <strong>Check your email</strong>
          <p className="text-sm mt-1">
            We sent a confirmation link to <strong>{email}</strong>
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            Don't forget to check your spam folder!
          </p>
        </AlertDescription>
      </Alert>

      <Button
        variant="outline"
        onClick={handleResend}
        disabled={loading || countdown > 0}
        className="w-full"
      >
        {countdown > 0
          ? `Resend in ${countdown}s`
          : loading
            ? "Sending..."
            : "Resend Confirmation Email"}
      </Button>
    </div>
  );
};
