
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Bell, Shield, Palette, Smartphone, LogOut, Globe, Download, HelpCircle } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { useAuth } from "@/hooks/useAuthProvider";
import { useTheme } from "next-themes";
import { toast } from "sonner";
import { handleApiError } from "@/lib/utils";
import { useState, useEffect, useCallback } from "react";
import MfaSetupDialog from "@/components/auth/MfaSetupDialog";
import { supabase } from "@/integrations/supabase/client";

const Settings = () => {
  const { signOut } = useAuth();
  const { theme, setTheme } = useTheme();
  const [language, setLanguage] = useState('en');
  const [units, setUnits] = useState('imperial');
  const [mounted, setMounted] = useState(false);
  const [isTwoFactorEnabled, setIsTwoFactorEnabled] = useState(false);
  const [twoFactorLoading, setTwoFactorLoading] = useState(true);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [secret, setSecret] = useState<string | null>(null);
  const [factorId, setFactorId] = useState<string | null>(null);
  const [showMfaSetupDialog, setShowMfaSetupDialog] = useState(false);

  useEffect(() => {
    setMounted(true);
    const fetchTwoFactorStatus = async () => {
      setTwoFactorLoading(true);
      try {
        const { data, error } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
        if (error) throw error;
        setIsTwoFactorEnabled(data.currentLevel === 'aal2');
      } catch (error) {
        console.error('Error fetching 2FA status:', error);
        handleApiError(error, 'Failed to fetch 2FA status.');
      } finally {
        setTwoFactorLoading(false);
      }
    };
    fetchTwoFactorStatus();
  }, []);

  const handleTwoFactorToggle = useCallback(async (enabled: boolean) => {
    setTwoFactorLoading(true);
    try {
      if (enabled) {
        const { data, error } = await supabase.auth.mfa.enroll({
          factorType: 'totp',
        });
        if (error) throw error;
        if (data.totp) {
          setQrCode(data.totp.qr_code);
          setSecret(data.totp.secret);
          setFactorId(data.id);
          setShowMfaSetupDialog(true);
        }
        toast.info('2FA enrollment initiated. Please complete setup in your authenticator app.');
      } else {
        const { data: factors, error: listError } = await supabase.auth.mfa.listFactors();
        if (listError) throw listError;

        const totpFactor = factors.find(factor => factor.factorType === 'totp');
        if (totpFactor) {
          const { error } = await supabase.auth.mfa.unenroll({
            factorId: totpFactor.id,
          });
          if (error) throw error;
          toast.success('Two-factor authentication disabled.');
          setIsTwoFactorEnabled(false);
        } else {
          toast.info('No TOTP factor found to disable.');
        }
      }
    } catch (error) {
      console.error('Error toggling 2FA:', error);
      handleApiError(error, `Failed to ${enabled ? 'enable' : 'disable'} 2FA.`);
    } finally {
      setTwoFactorLoading(false);
    }
  }, []);

  const handleNotificationToggle = (type: string, enabled: boolean) => {
    toast.success(`${type} notifications ${enabled ? 'enabled' : 'disabled'}`);
  };

  const handleSignOut = async () => {
    await signOut();
    toast.success('Signed out successfully');
  };

  const handleDarkModeToggle = (enabled: boolean) => {
    setTheme(enabled ? 'dark' : 'light');
    toast.info(`Dark mode ${enabled ? 'enabled' : 'disabled'}`);
  };

  const handleExportData = async () => {
    toast.info('Preparing data export... This may take a few minutes.');
    try {
      const { data, error } = await supabase.functions.invoke('export-data');
      if (error) throw error;

      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `fitpathway_data_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success('Data exported successfully!');
    } catch (error) {
      console.error('Error exporting data:', error);
      handleApiError(error, `Failed to export data`);
    }
  };

  const handleContactSupport = () => {
    toast.info('Opening support portal...');
    // In a real app, this would open support chat or email
  };

  if (!mounted) {
    return null;
  }

  return (
    <AppLayout>
      <div className="space-y-6 p-4 md:p-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground mt-1">
            Manage your app preferences and account settings
          </p>
        </div>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Bell className="h-5 w-5 text-blue-600" />
              <CardTitle>Notifications</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="workout-reminders" className="text-base font-medium">Workout Reminders</Label>
                <p className="text-sm text-gray-600 dark:text-gray-400">Get notified before scheduled workouts</p>
              </div>
              <Switch
                id="workout-reminders"
                defaultChecked
                onCheckedChange={(checked) => handleNotificationToggle('Workout reminder', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="progress-updates" className="text-base font-medium">Progress Updates</Label>
                <p className="text-sm text-gray-600 dark:text-gray-400">Weekly progress reports and achievements</p>
              </div>
              <Switch
                id="progress-updates"
                defaultChecked
                onCheckedChange={(checked) => handleNotificationToggle('Progress update', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="meal-reminders" className="text-base font-medium">Meal Reminders</Label>
                <p className="text-sm text-gray-600 dark:text-gray-400">Reminders for meals and hydration</p>
              </div>
              <Switch
                id="meal-reminders"
                onCheckedChange={(checked) => handleNotificationToggle('Meal reminder', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="social-notifications" className="text-base font-medium">Social Notifications</Label>
                <p className="text-sm text-gray-600 dark:text-gray-400">Messages from trainers and community</p>
              </div>
              <Switch
                id="social-notifications"
                defaultChecked
                onCheckedChange={(checked) => handleNotificationToggle('Social', checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Privacy & Security */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-green-600" />
              <CardTitle>Privacy & Security</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="space-y-1">
                <Label className="text-base font-medium">Profile Visibility</Label>
                <p className="text-sm text-gray-600 dark:text-gray-400">Control who can see your profile</p>
              </div>
              <Button variant="outline" size="sm" onClick={() => toast.info('Profile visibility settings opened')}>
                Manage
              </Button>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="space-y-1">
                <Label className="text-base font-medium">Data Sharing</Label>
                <p className="text-sm text-gray-600 dark:text-gray-400">Control how your data is shared</p>
              </div>
              <Button variant="outline" size="sm" onClick={() => toast.info('Data sharing preferences configured')}>
                Configure
              </Button>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="space-y-1">
                <Label className="text-base font-medium">Two-Factor Authentication</Label>
                <p className="text-sm text-gray-600 dark:text-gray-400">Add extra security to your account</p>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => handleTwoFactorToggle(!isTwoFactorEnabled)}
                disabled={twoFactorLoading}
              >
                {twoFactorLoading ? 'Loading...' : (isTwoFactorEnabled ? 'Disable' : 'Enable')}
              </Button>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="space-y-1">
                <Label className="text-base font-medium">Change Password</Label>
                <p className="text-sm text-gray-600 dark:text-gray-400">Update your account password</p>
              </div>
              <Button variant="outline" size="sm" onClick={() => toast.info('Password change form opened')}>
                Update
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* App Preferences */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Palette className="h-5 w-5 text-purple-600" />
              <CardTitle>App Preferences</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="dark-mode" className="text-base font-medium">Dark Mode</Label>
                <p className="text-sm text-gray-600 dark:text-gray-400">Switch to dark theme</p>
              </div>
              <Switch
                id="dark-mode"
                checked={theme === 'dark'}
                onCheckedChange={handleDarkModeToggle}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-base font-medium">Language</Label>
                <p className="text-sm text-gray-600 dark:text-gray-400">Choose your preferred language</p>
              </div>
              <select 
                value={language}
                onChange={(e) => {
                  setLanguage(e.target.value);
                  toast.success(`Language changed to ${e.target.options[e.target.selectedIndex].text}`);
                }}
                className="flex h-10 w-40 rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600"
              >
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="de">German</option>
                <option value="ar">Arabic</option>
              </select>
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-base font-medium">Units</Label>
                <p className="text-sm text-gray-600 dark:text-gray-400">Weight and distance units</p>
              </div>
              <select 
                value={units}
                onChange={(e) => {
                  setUnits(e.target.value);
                  toast.success(`Units changed to ${e.target.value}`);
                }}
                className="flex h-10 w-32 rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600"
              >
                <option value="imperial">Imperial</option>
                <option value="metric">Metric</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Account Actions */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Smartphone className="h-5 w-5 text-orange-600" />
              <CardTitle>Account Management</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="space-y-1">
                <Label className="text-base font-medium flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  Export Data
                </Label>
                <p className="text-sm text-gray-600 dark:text-gray-400">Download your workout and progress data</p>
              </div>
              <Button variant="outline" size="sm" onClick={handleExportData}>
                Export
              </Button>
            </div>
            <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="space-y-1">
                <Label className="text-base font-medium flex items-center gap-2">
                  <HelpCircle className="h-4 w-4" />
                  Support
                </Label>
                <p className="text-sm text-gray-600 dark:text-gray-400">Get help or contact support</p>
              </div>
              <Button variant="outline" size="sm" onClick={handleContactSupport}>
                Contact
              </Button>
            </div>
            <div className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
              <div className="space-y-1">
                <Label className="text-base font-medium text-red-600 dark:text-red-400">Delete Account</Label>
                <p className="text-sm text-gray-600 dark:text-gray-400">Permanently delete your account</p>
              </div>
              <Button 
                variant="destructive" 
                size="sm"
                onClick={() => toast.error('Account deletion requires email confirmation')}
              >
                Delete
              </Button>
            </div>
            <div className="pt-4 border-t">
              <Button onClick={handleSignOut} variant="outline" className="w-full hover:bg-gray-50 dark:hover:bg-gray-800">
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
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
    </AppLayout>
  );
};

export default Settings;
