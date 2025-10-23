import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  sanitizeEmail,
  checkAccountLockout,
  recordLoginAttempt,
  RateLimiter,
  validatePassword,
} from "@/lib/security";
import { useLanguage } from "@/contexts/LanguageContext";

const signInLimiter = new RateLimiter({
  windowMs: 15 * 60 * 1000,
  maxRequests: 5,
});

export const SignInForm = () => {
  const { t } = useLanguage();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const sanitizedEmail = sanitizeEmail(email);
    if (!sanitizedEmail) {
      setError(t("signIn.error.invalidEmail"));
      setLoading(false);
      return;
    }

    if (!signInLimiter.isAllowed(sanitizedEmail)) {
      setError(t("signIn.error.tooManyAttempts"));
      setLoading(false);
      return;
    }

    const lockoutStatus = checkAccountLockout(sanitizedEmail);
    if (lockoutStatus.isLocked) {
      const remainingMinutes = Math.ceil(
        (lockoutStatus.remainingTime || 0) / (1000 * 60),
      );
      setError(
        t("signIn.error.accountLocked", { minutes: remainingMinutes }),
      );
      setLoading(false);
      return;
    }

    // Additional password validation
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      setError(t("signIn.error.passwordRequirements"));
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: sanitizedEmail,
        password,
      });

      if (error) {
        recordLoginAttempt(sanitizedEmail, false);
        if (error.message === "Email not confirmed") {
          setError(
            t("signIn.error.emailNotConfirmed"),
          );
        } else if (error.message.includes("Failed to fetch")) {
          setError(
            t("signIn.error.connectionError"),
          );
        } else {
          setError(error.message || t("signIn.error.generic"));
        }
        return;
      }

      if (data.user) {
        recordLoginAttempt(sanitizedEmail, true);
        window.location.href = "/";
      }
    } catch (error) {
      setError((error as Error).message || t("signIn.error.generic"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSignIn} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="signin-email">{t("signIn.label.email")}</Label>
        <Input
          id="signin-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder={t("signIn.placeholder.email")}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="signin-password">{t("signIn.label.password")}</Label>
        <Input
          id="signin-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          placeholder={t("signIn.placeholder.password")}
        />
      </div>
      <Button
        type="submit"
        size="default"
        className="w-full"
        disabled={loading}
      >
        {loading ? t("signIn.button.signingIn") : t("signIn.button.signIn")}
      </Button>
      {error && (
        <Alert className="mt-4 border-red-200 bg-red-50">
          <AlertDescription className="text-red-700">{error}</AlertDescription>
        </Alert>
      )}
    </form>
  );
};
