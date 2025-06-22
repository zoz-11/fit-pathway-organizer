
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Bell, Shield, Palette, Smartphone, LogOut } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

const Settings = () => {
  const { signOut } = useAuth();

  const handleNotificationToggle = (type: string, enabled: boolean) => {
    toast.success(`${type} notifications ${enabled ? 'enabled' : 'disabled'}`);
  };

  const handleSignOut = async () => {
    await signOut();
    toast.success('Signed out successfully');
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
              <Bell className="h-5 w-5" />
              <CardTitle>Notifications</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="workout-reminders">Workout Reminders</Label>
                <p className="text-sm text-gray-600">Get notified before scheduled workouts</p>
              </div>
              <Switch
                id="workout-reminders"
                defaultChecked
                onCheckedChange={(checked) => handleNotificationToggle('Workout reminder', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="progress-updates">Progress Updates</Label>
                <p className="text-sm text-gray-600">Weekly progress reports and achievements</p>
              </div>
              <Switch
                id="progress-updates"
                defaultChecked
                onCheckedChange={(checked) => handleNotificationToggle('Progress update', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="meal-reminders">Meal Reminders</Label>
                <p className="text-sm text-gray-600">Reminders for meals and hydration</p>
              </div>
              <Switch
                id="meal-reminders"
                onCheckedChange={(checked) => handleNotificationToggle('Meal reminder', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="social-notifications">Social Notifications</Label>
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
              <Shield className="h-5 w-5" />
              <CardTitle>Privacy & Security</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Profile Visibility</Label>
                <p className="text-sm text-gray-600">Control who can see your profile</p>
              </div>
              <Button variant="outline" size="sm">
                Manage
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Data Sharing</Label>
                <p className="text-sm text-gray-600">Control how your data is shared</p>
              </div>
              <Button variant="outline" size="sm">
                Configure
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Two-Factor Authentication</Label>
                <p className="text-sm text-gray-600">Add extra security to your account</p>
              </div>
              <Button variant="outline" size="sm">
                Enable
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Change Password</Label>
                <p className="text-sm text-gray-600">Update your account password</p>
              </div>
              <Button variant="outline" size="sm">
                Update
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* App Preferences */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Palette className="h-5 w-5" />
              <CardTitle>App Preferences</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="dark-mode">Dark Mode</Label>
                <p className="text-sm text-gray-600">Switch to dark theme</p>
              </div>
              <Switch
                id="dark-mode"
                onCheckedChange={(checked) => toast.info(`Dark mode ${checked ? 'enabled' : 'disabled'}`)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Language</Label>
                <p className="text-sm text-gray-600">Choose your preferred language</p>
              </div>
              <select className="flex h-10 w-32 rounded-md border border-input bg-background px-3 py-2 text-sm">
                <option>English</option>
                <option>Spanish</option>
                <option>French</option>
                <option>German</option>
              </select>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Units</Label>
                <p className="text-sm text-gray-600">Weight and distance units</p>
              </div>
              <select className="flex h-10 w-32 rounded-md border border-input bg-background px-3 py-2 text-sm">
                <option>Imperial</option>
                <option>Metric</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Account Actions */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Smartphone className="h-5 w-5" />
              <CardTitle>Account</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Export Data</Label>
                <p className="text-sm text-gray-600">Download your workout and progress data</p>
              </div>
              <Button variant="outline" size="sm">
                Export
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Support</Label>
                <p className="text-sm text-gray-600">Get help or contact support</p>
              </div>
              <Button variant="outline" size="sm">
                Contact
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-red-600">Delete Account</Label>
                <p className="text-sm text-gray-600">Permanently delete your account</p>
              </div>
              <Button variant="destructive" size="sm">
                Delete
              </Button>
            </div>
            <div className="pt-4 border-t">
              <Button onClick={handleSignOut} variant="outline" className="w-full">
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
