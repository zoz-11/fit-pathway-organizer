import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";

const EmailConfirmed = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading",
  );
  const [message, setMessage] = useState("");

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        // Check if user is authenticated after email confirmation
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error) {
          setStatus("error");
          setMessage(error.message || "Failed to verify email");
          return;
        }

        if (session) {
          setStatus("success");
          setMessage(
            "Email confirmed successfully! Redirecting to dashboard...",
          );

          // Redirect after 3 seconds
          setTimeout(() => {
            navigate("/");
          }, 3000);
        } else {
          setStatus("error");
          setMessage("Session expired. Please sign in again.");
          setTimeout(() => {
            navigate("/auth");
          }, 3000);
        }
      } catch (error) {
        setStatus("error");
        setMessage("An unexpected error occurred");
      }
    };

    verifyEmail();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Email Confirmation</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-4">
          {status === "loading" && (
            <>
              <Loader2 className="h-16 w-16 animate-spin text-primary" />
              <p className="text-center text-muted-foreground">
                Verifying your email...
              </p>
            </>
          )}

          {status === "success" && (
            <>
              <CheckCircle2 className="h-16 w-16 text-green-600" />
              <p className="text-center text-lg font-medium text-green-600">
                {message}
              </p>
            </>
          )}

          {status === "error" && (
            <>
              <XCircle className="h-16 w-16 text-destructive" />
              <p className="text-center text-lg font-medium text-destructive">
                {message}
              </p>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EmailConfirmed;
