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
        // The profile is automatically created by the database trigger
        // We don't need to manually create it here

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
        <Label htmlFor="fullName">Full Name</Label>
        <Input
          id="fullName"
          type="text"
          placeholder="Enter your full name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          placeholder="Create a password"
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
        <Label htmlFor="role">I am a</Label>
        <Select value={role} onValueChange={(value) => setRole(value as "trainer" | "athlete")}>
          <SelectTrigger>
            <SelectValue placeholder="Select your role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="athlete">Athlete</SelectItem>
            <SelectItem value="trainer">Trainer</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Creating Account..." : "Sign Up"}
      </Button>
    </form>
  );
};