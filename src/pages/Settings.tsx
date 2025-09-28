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
      <Label className="text-base font-medium">{label}</Label>
      <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>
    </div>
    {control}
  </div>
);

const Settings = () => {
  const { signOut, profile } = useAuth();
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
  const [profileVisibility, setProfileVisibility] = useState('public');
  const [dataSharing, setDataSharing] = useState({
    analytics: true,
    thirdParty: false,
    marketing: false
  });

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
        const { data, error } = await supabase.auth.mfa.enroll({ factorType: 'totp' });
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

        const totpFactor = factors?.totp?.find((factor: any) => factor.factorType === 'totp');
        if (totpFactor) {
          const { error } = await supabase.auth.mfa.unenroll({ factorId: totpFactor.id });
          if (error) throw error;
          toast.success('Two-factor authentication disabled.');
          setIsTwoFactorEnabled(false);
        } else {
          toast.info('No TOTP factor found to disable.');
        }
      }
    } catch (error) {
      handleApiError(error, `Failed to ${enabled ? 'enable' : 'disable'} 2FA.`);
    } finally {
      setTwoFactorLoading(false);
    }
  }, []);

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      toast.success('Password updated successfully');
      setShowPasswordChangeDialog(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      handleApiError(error, 'Failed to update password');
    }
  };
  
  const handleExportData = async () => {
    try {
      // In a real app, this would call an API endpoint to generate the export
      toast.success('Data export requested', {
        description: 'Your data will be emailed to you shortly.'
      });
    } catch (error) {
      handleApiError(error, 'Failed to export data');
    }
  };
  
  const handleSendSupportRequest = () => {
    if (!supportMessage.trim()) {
      toast.error('Please enter a message');
      return;
    }
    
    // In a real app, this would send the message to a support system
    toast.success('Support request sent', {
      description: 'We will respond to your inquiry within 24 hours.'
    });
    setShowSupportDialog(false);
    setSupportMessage('');
  };
  
  const handleDeleteAccount = async () => {
    try {
      // In a real app, this would initiate account deletion
      toast.success('Account deletion initiated', {
        description: 'Your account will be deleted within 30 days.'
      });
      setShowDeleteAccountDialog(false);
      await signOut();
    } catch (error) {
      handleApiError(error, 'Failed to delete account');
    }
  };

  const handleSignOut = async () => {
    await signOut();
    toast.success('Signed out successfully');
  };

  if (!mounted) return null;

  return (
    <AppLayout>
      <PageLayout title="Settings" description="Manage your app preferences and account settings">
        <div className="grid gap-6 lg:grid-cols-2">
          <SettingsSection title="Notifications" icon={<Bell className="h-5 w-5 text-blue-600" />}>
            <SettingsItem label="Workout Reminders" description="Get notified before scheduled workouts" control={<Switch defaultChecked onCheckedChange={(checked) => toast.success(`Workout reminders ${checked ? 'enabled' : 'disabled'}`)} />} />
            <SettingsItem label="Progress Updates" description="Weekly progress reports and achievements" control={<Switch defaultChecked onCheckedChange={(checked) => toast.success(`Progress updates ${checked ? 'enabled' : 'disabled'}`)} />} />
            <SettingsItem label="Meal Reminders" description="Reminders for meals and hydration" control={<Switch onCheckedChange={(checked) => toast.success(`Meal reminders ${checked ? 'enabled' : 'disabled'}`)} />} />
            <SettingsItem label="Social Notifications" description="Messages from trainers and community" control={<Switch defaultChecked onCheckedChange={(checked) => toast.success(`Social notifications ${checked ? 'enabled' : 'disabled'}`)} />} />
          </SettingsSection>

          <SettingsSection title="Privacy & Security" icon={<Shield className="h-5 w-5 text-green-600" />}>
            <SettingsItem label="Profile Visibility" description="Control who can see your profile" control={<Button variant="outline" size="sm" onClick={() => setShowProfileVisibilityDialog(true)}>Manage</Button>} />
            <SettingsItem label="Data Sharing" description="Control how your data is shared" control={<Button variant="outline" size="sm" onClick={() => setShowDataSharingDialog(true)}>Configure</Button>} />
            <SettingsItem label="Two-Factor Authentication" description="Add extra security to your account" control={<Button variant="outline" size="sm" onClick={() => handleTwoFactorToggle(!isTwoFactorEnabled)} disabled={twoFactorLoading}>{twoFactorLoading ? 'Loading...' : (isTwoFactorEnabled ? 'Disable' : 'Enable')}</Button>} />
            <SettingsItem label="Change Password" description="Update your account password" control={<Button variant="outline" size="sm" onClick={() => setShowPasswordChangeDialog(true)}>Update</Button>} />
          </SettingsSection>

          <SettingsSection title="App Preferences" icon={<Palette className="h-5 w-5 text-purple-600" />}>
            <SettingsItem label="Dark Mode" description="Switch to dark theme" control={<Switch checked={theme === 'dark'} onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')} />} />
            <SettingsItem label="Language" description="Choose your preferred language" control={
              <Select value={language} onValueChange={(value) => {
                setLanguage(value);
                toast.success(`Language changed to ${value === 'en' ? 'English' : value === 'es' ? 'Spanish' : 'Arabic'}`);
              }}>
                <SelectTrigger className="w-[180px]"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Spanish</SelectItem>
                  <SelectItem value="ar">Arabic</SelectItem>
                </SelectContent>
              </Select>
            } />
            <SettingsItem label="Units" description="Weight and distance units" control={
              <Select value={units} onValueChange={(value) => {
                setUnits(value);
                toast.success(`Units changed to ${value}`);
              }}>
                <SelectTrigger className="w-[180px]"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="imperial">Imperial</SelectItem>
                  <SelectItem value="metric">Metric</SelectItem>
                </SelectContent>
              </Select>
            } />
          </SettingsSection>

          <SettingsSection title="Account Management" icon={<Smartphone className="h-5 w-5 text-orange-600" />}>
            <SettingsItem 
              label="Export Data" 
              description="Download your workout and progress data" 
              control={<Button variant="outline" size="sm">Export</Button>} 
            />
            <SettingsItem 
              label="Support" 
              description="Get help or contact support" 
              control={<Button variant="outline" size="sm">Contact</Button>} 
            />
            <SettingsItem 
              label="Delete Account" 
              description="Permanently delete your account" 
              control={<Button variant="destructive" size="sm">Delete</Button>} 
            />
            <div className="pt-4 mt-2 border-t">
              <Button onClick={handleSignOut} variant="outline" size="default" className="w-full">
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </SettingsSection>
        </div>
      </PageLayout>
      
      {/* Profile Visibility Dialog */}
      <Dialog open={showProfileVisibilityDialog} onOpenChange={setShowProfileVisibilityDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Profile Visibility</DialogTitle>
            <DialogDescription>Control who can see your profile information</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Visibility Level</Label>
              <Select value={profileVisibility} onValueChange={setProfileVisibility}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="public">Public - Anyone can see your profile</SelectItem>
                  <SelectItem value="connections">Connections Only - Only your connections can see your profile</SelectItem>
                  <SelectItem value="private">Private - Only you can see your profile</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" size="default" onClick={() => setShowProfileVisibilityDialog(false)}>Cancel</Button>
            <Button size="default" onClick={() => {
              toast.success('Profile visibility updated');
              setShowProfileVisibilityDialog(false);
            }}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Data Sharing Dialog */}
      <Dialog open={showDataSharingDialog} onOpenChange={setShowDataSharingDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Data Sharing Preferences</DialogTitle>
            <DialogDescription>Control how your data is shared</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base font-medium">Analytics Data</Label>
                <p className="text-sm text-gray-600 dark:text-gray-400">Share anonymous usage data to improve the app</p>
              </div>
              <Switch checked={dataSharing.analytics} onCheckedChange={(checked) => setDataSharing({...dataSharing, analytics: checked})} />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base font-medium">Third-Party Integration</Label>
                <p className="text-sm text-gray-600 dark:text-gray-400">Share data with connected third-party services</p>
              </div>
              <Switch checked={dataSharing.thirdParty} onCheckedChange={(checked) => setDataSharing({...dataSharing, thirdParty: checked})} />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base font-medium">Marketing Communications</Label>
                <p className="text-sm text-gray-600 dark:text-gray-400">Receive personalized offers and updates</p>
              </div>
              <Switch checked={dataSharing.marketing} onCheckedChange={(checked) => setDataSharing({...dataSharing, marketing: checked})} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" size="default" onClick={() => setShowDataSharingDialog(false)}>Cancel</Button>
            <Button size="default" onClick={() => {
              toast.success('Data sharing preferences updated');
              setShowDataSharingDialog(false);
            }}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Change Password Dialog */}
      <Dialog open={showPasswordChangeDialog} onOpenChange={setShowPasswordChangeDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Password</DialogTitle>
            <DialogDescription>Update your account password</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="current-password">Current Password</Label>
              <Input id="current-password" type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-password">New Password</Label>
              <Input id="new-password" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm New Password</Label>
              <Input id="confirm-password" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" size="default" onClick={() => setShowPasswordChangeDialog(false)}>Cancel</Button>
            <Button size="default" onClick={handleChangePassword}>Update Password</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Support Dialog */}
      <Dialog open={showSupportDialog} onOpenChange={setShowSupportDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Contact Support</DialogTitle>
            <DialogDescription>Get help with your account or app issues</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="support-message">Message</Label>
              <Textarea 
                id="support-message" 
                placeholder="Describe your issue or question..." 
                value={supportMessage} 
                onChange={(e) => setSupportMessage(e.target.value)} 
                rows={5}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" size="default" onClick={() => setShowSupportDialog(false)}>Cancel</Button>
            <Button size="default" onClick={handleSendSupportRequest}>Send Message</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Account Dialog */}
      <Dialog open={showDeleteAccountDialog} onOpenChange={setShowDeleteAccountDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Account</DialogTitle>
            <DialogDescription>This action cannot be undone. Your account and all associated data will be permanently deleted.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <p className="text-red-500">Are you sure you want to delete your account?</p>
          </div>
          <DialogFooter>
            <Button variant="outline" size="default" onClick={() => setShowDeleteAccountDialog(false)}>Cancel</Button>
            <Button variant="destructive" size="default" onClick={handleDeleteAccount}>Delete Account</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
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
