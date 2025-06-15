
import { Button } from "@/components/ui/button";
import { 
  Home, 
  Users, 
  Dumbbell, 
  Calendar, 
  MessageSquare, 
  BarChart3, 
  Settings,
  X,
  User,
  BookOpen,
  Apple
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  onClose?: () => void;
}

interface NavItem {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  href: string;
  role?: 'trainer' | 'athlete' | 'both';
}

const trainerNavItems: NavItem[] = [
  { icon: Home, label: "Dashboard", href: "/", role: "both" },
  { icon: Users, label: "Members", href: "/members", role: "trainer" },
  { icon: Dumbbell, label: "Exercise Library", href: "/exercises", role: "trainer" },
  { icon: Calendar, label: "Schedules", href: "/schedules", role: "both" },
  { icon: Apple, label: "Diet Plans", href: "/diet-plans", role: "trainer" },
  { icon: MessageSquare, label: "Messages", href: "/messages", role: "both" },
  { icon: BarChart3, label: "Reports", href: "/reports", role: "trainer" },
  { icon: User, label: "Profile", href: "/profile", role: "both" },
  { icon: Settings, label: "Settings", href: "/settings", role: "both" },
];

const athleteNavItems: NavItem[] = [
  { icon: Home, label: "Dashboard", href: "/", role: "both" },
  { icon: Calendar, label: "My Schedule", href: "/my-schedule", role: "athlete" },
  { icon: BookOpen, label: "My Diet Plan", href: "/my-diet", role: "athlete" },
  { icon: BarChart3, label: "Progress", href: "/progress", role: "athlete" },
  { icon: MessageSquare, label: "Messages", href: "/messages", role: "both" },
  { icon: User, label: "Profile", href: "/profile", role: "both" },
  { icon: Settings, label: "Settings", href: "/settings", role: "both" },
];

export const Sidebar = ({ onClose }: SidebarProps) => {
  // Mock user role - will be replaced with real auth
  const userRole = "trainer"; // or "athlete"
  const currentPath = "/"; // Will be replaced with real router
  
  const navItems = userRole === "trainer" ? trainerNavItems : athleteNavItems;

  return (
    <div className="h-full bg-white border-r border-gray-200 flex flex-col">
      {/* Close button for mobile */}
      <div className="flex items-center justify-between p-4 lg:hidden">
        <span className="text-lg font-semibold">Menu</span>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-5 w-5" />
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navItems.map((item) => {
          const isActive = currentPath === item.href;
          const Icon = item.icon;
          
          return (
            <Button
              key={item.href}
              variant={isActive ? "default" : "ghost"}
              className={cn(
                "w-full justify-start space-x-3 py-3 px-4",
                isActive 
                  ? "bg-gradient-to-r from-blue-500 to-green-500 text-white shadow-md" 
                  : "hover:bg-blue-50 hover:text-blue-700"
              )}
              onClick={onClose}
            >
              <Icon className="h-5 w-5" />
              <span>{item.label}</span>
            </Button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <div className="text-center">
          <p className="text-xs text-gray-500">FitPathway Organizer</p>
          <p className="text-xs text-gray-400">v1.0.0</p>
        </div>
      </div>
    </div>
  );
};
