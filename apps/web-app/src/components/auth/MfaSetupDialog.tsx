import React, { useState } from "react";
import {
  AlertDialog,
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
import { useLanguage } from "@/contexts/LanguageContext";

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
  const { t } = useLanguage();
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVerify = async () => {
    if (!factorId || !code) {
      handleApiError(
        new Error(t("mfaSetup.error.missingFactorOrCode")),
        t("mfaSetup.error.missingFactorOrCode"),
      );
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

      toast(t("mfaSetup.toast.success"), { type: 'success' });
      onMfaEnabled();
      onClose();
    } catch (error) {
      console.error("Error verifying 2FA:", error);
      handleApiError(error, t("mfaSetup.toast.error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t("mfaSetup.title")}</AlertDialogTitle>
          <AlertDialogDescription>
            {t("mfaSetup.description")}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-4">
          {qrCode && (
            <div className="flex justify-center">
              <img
                src={qrCode}
                alt={t("mfaSetup.qrCodeAlt")}
                className="w-48 h-48"
              />
            </div>
          )}

          {secret && (
            <div className="text-center">
              <Label htmlFor="secret-key">{t("mfaSetup.secretKeyLabel")}</Label>
              <Input
                id="secret-key"
                type="text"
                value={secret}
                readOnly
                className="text-center font-mono"
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="verification-code">{t("mfaSetup.verificationCodeLabel")}</Label>
            <Input
              id="verification-code"
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder={t("mfaSetup.verificationCodePlaceholder")}
              maxLength={6}
              className="text-center text-lg tracking-widest"
            />
          </div>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose}>{t("mfaSetup.cancelButton")}</AlertDialogCancel>
          <Button
            size="default"
            onClick={handleVerify}
            disabled={loading || code.length !== 6}
          >
            {loading ? t("mfaSetup.verifyingButton") : t("mfaSetup.verifyButton")}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default MfaSetupDialog;
