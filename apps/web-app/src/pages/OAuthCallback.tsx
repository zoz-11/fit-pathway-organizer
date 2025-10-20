import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "../components/ui/use-toast";
import { supabase } from "../integrations/supabase/client";
import { useLanguage } from "../contexts/LanguageContext";

const OAuthCallback = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  useEffect(() => {
    const handleOAuthCallback = async () => {
      const params = new URLSearchParams(window.location.search);
      const code = params.get("code");

      if (code) {
        try {
          // Call a Supabase Edge Function to exchange the code for tokens
          const { data, error } = await supabase.functions.invoke(
            "exchange-google-token",
            {
              body: JSON.stringify({ code }),
            },
          );

          if (error) {
            console.error("Error exchanging code:", error);
            toast({
              title: t("oAuthCallback.toast.error.title"),
              description: t("oAuthCallback.toast.error.failedToConnect"),
              variant: "destructive",
            });
          } else if (data?.error) {
            console.error("Server-side error exchanging code:", data.error);
            toast({
              title: t("oAuthCallback.toast.error.title"),
              description: `${t("oAuthCallback.toast.error.failedToConnect")} ${data.error}`,
              variant: "destructive",
            });
          } else {
            toast({
              title: t("oAuthCallback.toast.success.title"),
              description: t("oAuthCallback.toast.success.description"),
            });
            // Redirect to a relevant page, e.g., schedule or settings
            navigate("/schedule");
          }
        } catch (err) {
          console.error("Unexpected error during OAuth callback:", err);
          toast({
            title: t("oAuthCallback.toast.error.title"),
            description: t("oAuthCallback.toast.error.unexpected"),
            variant: "destructive",
          });
        }
      } else {
        toast({
          title: t("oAuthCallback.toast.error.title"),
          description: t("oAuthCallback.toast.error.noCode"),
          variant: "destructive",
        });
        navigate("/settings"); // Redirect if no code is present
      }
    };

    handleOAuthCallback();
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p>{t("oAuthCallback.connecting")}</p>
    </div>
  );
};

export default OAuthCallback;
