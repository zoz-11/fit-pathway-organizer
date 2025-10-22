import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";

interface ResendConfirmationProps {
  email: string;
}

export const ResendConfirmation = ({ email }: ResendConfirmationProps) => {
  const { t } = useLanguage();
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
        toast.success(t("resendConfirmation.toast.success"));
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
      toast.error(t("resendConfirmation.toast.error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 mt-4">
      <Alert>
        <AlertDescription>
          {t("resendConfirmation.checkEmail")}
          <p className="text-sm mt-1">
            {t("resendConfirmation.confirmationLink", { email })}
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            {t("resendConfirmation.checkSpam")}
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
          ? t("resendConfirmation.resendIn", { count: countdown })
          : loading
            ? t("resendConfirmation.sending")
            : t("resendConfirmation.resendButton")}
      </Button>
    </div>
  );
};
