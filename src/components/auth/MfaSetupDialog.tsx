import React, { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { handleApiError } from "@/lib/utils";

interface MfaSetupDialogProps {
  isOpen: boolean;
  onClose: () => void;
  qrCode: string | null;
  secret: string | null;
  factorId: string | null;
  onMfaEnabled: () => void;
}

const MfaSetupDialog: React.FC<MfaSetupDialogProps> = ({
  isOpen,
  onClose,
  qrCode,
  secret,
  factorId,
  onMfaEnabled,
}) => {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVerify = async () => {
    if (!factorId || !code) {
      handleApiError(new Error("Factor ID or code is missing."), "Factor ID or code is missing.");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.mfa.verify({
        factorId,
        code,
        challengeId: factorId,
      });

      if (error) {
        throw error;
      }

      toast.success("Two-factor authentication enabled successfully!");
      onMfaEnabled();
      onClose();
    } catch (error) {
      console.error("Error verifying 2FA:", error);
      handleApiError(error, `Failed to verify 2FA`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Set up Two-Factor Authentication</AlertDialogTitle>
          <AlertDialogDescription>
            Scan the QR code with your authenticator app (e.g., Google Authenticator, Authy) or manually enter the secret key. Then, enter the 6-digit code from the app to verify.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="space-y-4">
          {qrCode && (
            <div className="flex justify-center">
              <img src={qrCode} alt="QR Code" className="w-48 h-48" />
            </div>
          )}
          {secret && (
            <div className="text-center">
              <Label htmlFor="secret-key">Secret Key:</Label>
              <Input id="secret-key" type="text" value={secret} readOnly className="text-center font-mono" />
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="verification-code">Verification Code</Label>
            <Input
              id="verification-code"
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Enter 6-digit code"
              maxLength={6}
              className="text-center text-lg tracking-widest"
            />
          </div>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose}>Cancel</AlertDialogCancel>
          <Button size="default" onClick={handleVerify} disabled={loading || code.length !== 6}>
            {loading ? "Verifying..." : "Verify Code"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default MfaSetupDialog;
