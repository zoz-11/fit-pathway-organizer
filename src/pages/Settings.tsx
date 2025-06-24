
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Bell, Shield, Palette, Smartphone, LogOut, Globe, Download, HelpCircle } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { useState } from "react";

const Settings = () => {
  const { signOut } = useAuth();
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState('en');
  const [units, setUnits] = useState('imperial');

  const handleNotificationToggle = (type: string, enabled: boolean) => {
    toast.success(`${type} notifications ${enabled ? 'enabled' : 'disabled'}`);
  };

  const handleSignOut = async () => {
    await signOut();
    toast.success('Signed out successfully');
  };

  const handleDarkModeToggle = (enabled: boolean) => {
    setDarkMode(enabled);
    toast.info(`Dark mode ${enabled ? 'enabled' : 'disabled'}`);
    // In a real app, this would toggle the theme
  };

  const handleExportData = () => {
    toast.info('Preparing data export... This may take a few minutes.');
    // In a real app, this would trigger data export
  };

  const handleContactSupport = () => {
    toast.info('Opening support portal...');
    // In a real app, this would open support chat or email
  };

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
                <p className="text-sm text-gray-600">Get notified before scheduled workouts</p>
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
                <p className="text-sm text-gray-600">Weekly progress reports and achievements</p>
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
                <p className="text-sm text-gray-600">Reminders for meals and hydration</p>
              </div>
              <Switch
                id="meal-reminders"
                onCheckedChange={(checked) => handleNotificationToggle('Meal reminder', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="social-notifications" className="text-base font-medium">Social Notifications</Label>
                <p className="text-sm text-gray-600">Messages from trainers and community</p>
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
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="space-y-1">
                <Label className="text-base font-medium">Profile Visibility</Label>
                <p className="text-sm text-gray-600">Control who can see your profile</p>
              </div>
              <Button variant="outline" size="sm" onClick={() => toast.info('Profile visibility settings opened')}>
                Manage
              </Button>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="space-y-1">
                <Label className="text-base font-medium">Data Sharing</Label>
                <p className="text-sm text-gray-600">Control how your data is shared</p>
              </div>
              <Button variant="outline" size="sm" onClick={() => toast.info('Data sharing preferences configured')}>
                Configure
              </Button>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="space-y-1">
                <Label className="text-base font-medium">Two-Factor Authentication</Label>
                <p className="text-sm text-gray-600">Add extra security to your account</p>
              </div>
              <Button variant="outline" size="sm" onClick={() => toast.info('Two-factor authentication setup started')}>
                Enable
              </Button>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="space-y-1">
                <Label className="text-base font-medium">Change Password</Label>
                <p className="text-sm text-gray-600">Update your account password</p>
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
                <p className="text-sm text-gray-600">Switch to dark theme</p>
              </div>
              <Switch
                id="dark-mode"
                checked={darkMode}
                onCheckedChange={handleDarkModeToggle}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-base font-medium">Language</Label>
                <p className="text-sm text-gray-600">Choose your preferred language</p>
              </div>
              <select 
                value={language}
                onChange={(e) => {
                  setLanguage(e.target.value);
                  toast.success(`Language changed to ${e.target.options[e.target.selectedIndex].text}`);
                }}
                className="flex h-10 w-40 rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                <p className="text-sm text-gray-600">Weight and distance units</p>
              </div>
              <select 
                value={units}
                onChange={(e) => {
                  setUnits(e.target.value);
                  toast.success(`Units changed to ${e.target.value}`);
                }}
                className="flex h-10 w-32 rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div className="space-y-1">
                <Label className="text-base font-medium flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  Export Data
                </Label>
                <p className="text-sm text-gray-600">Download your workout and progress data</p>
              </div>
              <Button variant="outline" size="sm" onClick={handleExportData}>
                Export
              </Button>
            </div>
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="space-y-1">
                <Label className="text-base font-medium flex items-center gap-2">
                  <HelpCircle className="h-4 w-4" />
                  Support
                </Label>
                <p className="text-sm text-gray-600">Get help or contact support</p>
              </div>
              <Button variant="outline" size="sm" onClick={handleContactSupport}>
                Contact
              </Button>
            </div>
            <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
              <div className="space-y-1">
                <Label className="text-base font-medium text-red-600">Delete Account</Label>
                <p className="text-sm text-gray-600">Permanently delete your account</p>
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
              <Button onClick={handleSignOut} variant="outline" className="w-full hover:bg-gray-50">
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default Settings;
