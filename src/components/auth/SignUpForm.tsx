import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { validatePassword, sanitizeString, sanitizeEmail, RateLimiter } from "@/lib/security";

const signUpLimiter = new RateLimiter({ windowMs: 60 * 60 * 1000, maxRequests: 10 });

export const SignUpForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState<"trainer" | "athlete">("athlete");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);
    setPasswordErrors([]);

    const sanitizedEmail = sanitizeEmail(email);
    const sanitizedFullName = sanitizeString(fullName);

    if (!signUpLimiter.isAllowed(sanitizedEmail)) {
      setError("Too many sign-up attempts. Please try again later.");
      setLoading(false);
      return;
    }

    if (!sanitizedFullName) {
      setError("Full Name cannot be empty.");
      setLoading(false);
      return;
    }
    if (!sanitizedEmail) {
      setError("Please enter a valid email address.");
      setLoading(false);
      return;
    }
    if (!role) {
      setError("Please select a role.");
      setLoading(false);
      return;
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      setPasswordErrors(passwordValidation.errors);
      setError("Please fix the password requirements.");
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
        // Profile is automatically created by the handle_new_user database trigger
        if (!data.user.email_confirmed_at) {
          setMessage("Account created! Please check your email (including spam folder) and click the verification link before signing in.");
        } else {
          window.location.href = "/";
        }
      }
    } catch (error) {
      setError((error as Error).message || "An error occurred during sign up");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    
    if (newPassword.length > 0) {
      const validation = validatePassword(newPassword);
      setPasswordErrors(validation.errors);
    } else {
      setPasswordErrors([]);
    }
  };

  return (
    <form onSubmit={handleSignUp} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="signup-name">Full Name</Label>
        <Input
          id="signup-name"
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
          placeholder="Enter your full name"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="signup-email">Email</Label>
        <Input
          id="signup-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="Enter your email"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="signup-password">Password</Label>
        <Input
          id="signup-password"
          type="password"
          value={password}
          onChange={handlePasswordChange}
          required
          placeholder="Create a password"
          minLength={8}
        />
        {passwordErrors.length > 0 && (
          <div className="text-sm text-red-600 space-y-1">
            <p className="font-medium">Password requirements:</p>
            <ul className="list-disc list-inside space-y-1">
              {passwordErrors.map((error, index) => (
                <li key={index} className="text-xs">{error}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="role">Role</Label>
        <Select value={role} onValueChange={(value: "trainer" | "athlete") => setRole(value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select your role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="athlete">Athlete/Member</SelectItem>
            <SelectItem value="trainer">Trainer/Coach</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button type="submit" size="default" className="w-full" disabled={loading}>
        {loading ? "Creating account..." : "Create Account"}
      </Button>
      {error && (
        <Alert className="mt-4 border-red-200 bg-red-50">
          <AlertDescription className="text-red-700">{error}</AlertDescription>
        </Alert>
      )}
      {message && (
        <Alert className="mt-4 border-green-200 bg-green-50">
          <AlertDescription className="text-green-700">{message}</AlertDescription>
        </Alert>
      )}
    </form>
  );
};