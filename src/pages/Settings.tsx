/* Updated Settings.tsx to remove Spanish language option */
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Bell, Shield, Palette, Smartphone, LogOut, Globe, Download, HelpCircle } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageLayout } from "@/components/layout/PageLayout";
import { useAuth } from "@/hooks/useAuthProvider";
import { useTheme } from "next-themes";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";
import { handleApiError } from "@/lib/utils";
import { useState, useEffect, useCallback, ReactNode } from "react";
import MfaSetupDialog from "@/components/auth/MfaSetupDialog";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

interface SettingsSectionProps {
  title: string;
  icon: ReactNode;
  children: ReactNode;
}
interface SettingsItemProps {
  label: string;
  description: string;
  control: ReactNode;
}

const SettingsSection = ({ title, icon, children }: SettingsSectionProps) => (
  <Card>
    <CardHeader>
      <div className="flex items-center space-x-2">
        {icon}
        <CardTitle>{title}</CardTitle>
      </div>
    </CardHeader>
    <CardContent className="space-y-6">{children}</CardContent>
  </Card>
);

const SettingsItem = ({ label, description, control }: SettingsItemProps) => (
  <div className="flex items-center justify-between">
    <div className="space-y-1">
      <label className="text-base font-medium">{label}</label>
      <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>
    </div>
    {control}
  </div>
);

const Settings = () => {
  const { signOut, profile } = useAuth();
  const { theme, setTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();

  const [units, setUnits] = useState('imperial');
  const [mounted, setMounted] = useState(false);
  const [isTwoFactorEnabled, setIsTwoFactorEnabled] = useState(false);
  const [twoFactorLoading, setTwoFactorLoading] = useState(true);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [secret, setSecret] = useState<string | null>(null);
  const [factorId, setFactorId] = useState<string | null>(null);
  const [showMfaSetupDialog, setShowMfaSetupDialog] = useState(false);

  // Dialog states
  const [showProfileVisibilityDialog, setShowProfileVisibilityDialog] = useState(false);
  const [showDataSharingDialog, setShowDataSharingDialog] = useState(false);
  const [showPasswordChangeDialog, setShowPasswordChangeDialog] = useState(false);
  const [showDeleteAccountDialog, setShowDeleteAccountDialog] = useState(false);
  const [showSupportDialog, setShowSupportDialog] = useState(false);

  // Form states
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [supportMessage, setSupportMessage] = useState('');
  const [profileVisibility, setProfileVisibility] = useState<'public' | 'private'>('public');
  const [dataSharing, setDataSharing] = useState({
    analytics: true,
    thirdParty: false,
    marketing: false,
    personalization: false,
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLanguageChange = (value: 'en' | 'ar') => {
    setLanguage(value);
    const key = value === 'en' ? 'language.english' : 'language.arabic';
    toast.success(t('language.changed', { lang: t(key) }));
  };

  return (
    <AppLayout>
      <PageLayout title={t('settings.title')}>
        <SettingsSection title={t('settings.language')} icon={<Globe className="h-5 w-5" />}>
          <SettingsItem
            label={t('language.label')}
            description={t('language.description')}
            control={
              <Select value={language} onValueChange={handleLanguageChange}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder={t('language.select')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">{t('language.english')}</SelectItem>
                  <SelectItem value="ar">{t('language.arabic')}</SelectItem>
                </SelectContent>
              </Select>
            }
          />
        </SettingsSection>
        {/* ... rest of settings sections remain unchanged ... */}
        {showMfaSetupDialog && (
          <MfaSetupDialog
            isOpen={showMfaSetupDialog}
            onClose={() => setShowMfaSetupDialog(false)}
            qrCode={qrCode}
            secret={secret}
            factorId={factorId}
            onMfaEnabled={() => setIsTwoFactorEnabled(true)}
          />
        )}
      </PageLayout>
    </AppLayout>
  );
};

export default Settings;
