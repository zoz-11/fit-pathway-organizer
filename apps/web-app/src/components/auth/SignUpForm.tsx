import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  validatePassword,
  sanitizeString,
  sanitizeEmail,
  RateLimiter,
} from "@/lib/security";
import { ResendConfirmation } from "./ResendConfirmation";
import { useLanguage } from "@/contexts/LanguageContext";

const signUpLimiter = new RateLimiter({
  windowMs: 60 * 60 * 1000,
  maxRequests: 10,
});

export const SignUpForm = () => {
  const { t } = useLanguage();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState<"trainer" | "athlete">("athlete");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);
  const [showResend, setShowResend] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState("");

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);
    setPasswordErrors([]);

    const sanitizedEmail = sanitizeEmail(email);
    const sanitizedFullName = sanitizeString(fullName);

    if (!signUpLimiter.isAllowed(sanitizedEmail)) {
      setError(t("signUp.error.tooManyAttempts"));
      setLoading(false);
      return;
    }

    if (!sanitizedFullName) {
      setError(t("signUp.error.fullNameRequired"));
      setLoading(false);
      return;
    }
    if (!sanitizedEmail) {
      setError(t("signUp.error.invalidEmail"));
      setLoading(false);
      return;
    }
    if (!role) {
      setError(t("signUp.error.roleRequired"));
      setLoading(false);
      return;
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      setPasswordErrors(passwordValidation.errors);
      setError(t("signUp.error.passwordRequirements"));
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email: sanitizedEmail,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            full_name: sanitizedFullName,
            role: role,
          },
        },
      });

      if (error) {
        setError((error as Error).message);
        return;
      }

      if (data.user) {
        // The profile is automatically created by the database trigger
        // We don't need to manually create it here

        if (!data.user.email_confirmed_at) {
          setRegisteredEmail(sanitizedEmail);
          setShowResend(true);
          setMessage(
            t("signUp.message.accountCreated"),
          );
        } else {
          window.location.href = "/";
        }
      }
    } catch (error) {
      setError((error as Error).message || t("signUp.error.generic"));
    } finally {
      setLoading(false);
    }
  };

  if (showResend && registeredEmail) {
    return <ResendConfirmation email={registeredEmail} />;
  }

  return (
    <form onSubmit={handleSignUp} className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      {message && (
        <Alert>
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Label htmlFor="fullName">{t("signUp.label.fullName")}</Label>
        <Input
          id="fullName"
          type="text"
          placeholder={t("signUp.placeholder.fullName")}
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">{t("signUp.label.email")}</Label>
        <Input
          id="email"
          type="email"
          placeholder={t("signUp.placeholder.email")}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">{t("signUp.label.password")}</Label>
        <Input
          id="password"
          type="password"
          placeholder={t("signUp.placeholder.password")}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {passwordErrors.length > 0 && (
          <div className="text-sm text-red-500">
            {passwordErrors.map((err, index) => (
              <div key={index}>• {err}</div>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="role">{t("signUp.label.role")}</Label>
        <Select
          value={role}
          onValueChange={(value) => setRole(value as "trainer" | "athlete")}
        >
          <SelectTrigger>
            <SelectValue placeholder={t("signUp.placeholder.role")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="athlete">{t("signUp.role.athlete")}</SelectItem>
            <SelectItem value="trainer">{t("signUp.role.trainer")}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? t("signUp.button.creatingAccount") : t("signUp.button.signUp")}
      </Button>
    </form>
  );
};
