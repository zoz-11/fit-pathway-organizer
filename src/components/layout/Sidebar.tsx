
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
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface SidebarProps {
  onClose?: () => void;
}

interface NavItem {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  action: () => void;
  role?: 'trainer' | 'athlete' | 'both';
}

export const Sidebar = ({ onClose }: SidebarProps) => {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const userRole = profile?.role || "athlete";
  
  const handleNavigation = (path: string, label: string) => {
    if (path === "/") {
      navigate("/");
    } else {
      toast.info(`${label} page coming soon!`);
    }
    onClose?.();
  };

  const trainerNavItems: NavItem[] = [
    { icon: Home, label: "Dashboard", action: () => handleNavigation("/", "Dashboard"), role: "both" },
    { icon: Users, label: "Members", action: () => handleNavigation("/members", "Members"), role: "trainer" },
    { icon: Dumbbell, label: "Exercise Library", action: () => handleNavigation("/exercises", "Exercise Library"), role: "trainer" },
    { icon: Calendar, label: "Schedules", action: () => handleNavigation("/schedules", "Schedules"), role: "both" },
    { icon: Apple, label: "Diet Plans", action: () => handleNavigation("/diet-plans", "Diet Plans"), role: "trainer" },
    { icon: MessageSquare, label: "Messages", action: () => handleNavigation("/messages", "Messages"), role: "both" },
    { icon: BarChart3, label: "Reports", action: () => handleNavigation("/reports", "Reports"), role: "trainer" },
    { icon: User, label: "Profile", action: () => handleNavigation("/profile", "Profile"), role: "both" },
    { icon: Settings, label: "Settings", action: () => handleNavigation("/settings", "Settings"), role: "both" },
  ];

  const athleteNavItems: NavItem[] = [
    { icon: Home, label: "Dashboard", action: () => handleNavigation("/", "Dashboard"), role: "both" },
    { icon: Calendar, label: "My Schedule", action: () => handleNavigation("/my-schedule", "My Schedule"), role: "athlete" },
    { icon: BookOpen, label: "My Diet Plan", action: () => handleNavigation("/my-diet", "My Diet Plan"), role: "athlete" },
    { icon: BarChart3, label: "Progress", action: () => handleNavigation("/progress", "Progress"), role: "athlete" },
    { icon: MessageSquare, label: "Messages", action: () => handleNavigation("/messages", "Messages"), role: "both" },
    { icon: User, label: "Profile", action: () => handleNavigation("/profile", "Profile"), role: "both" },
    { icon: Settings, label: "Settings", action: () => handleNavigation("/settings", "Settings"), role: "both" },
  ];
  
  const navItems = userRole === "trainer" ? trainerNavItems : athleteNavItems;

  return (
    <div className="h-full bg-white border-r border-gray-200 flex flex-col">
      <div className="flex items-center justify-between p-4 lg:hidden">
        <span className="text-lg font-semibold">Menu</span>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-5 w-5" />
        </Button>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2">
        {navItems.map((item) => {
          const isActive = false; // For now, since we're not implementing full routing
          const Icon = item.icon;
          
          return (
            <Button
              key={item.label}
              variant={isActive ? "default" : "ghost"}
              className={cn(
                "w-full justify-start space-x-3 py-3 px-4 cursor-pointer",
                isActive 
                  ? "bg-gradient-to-r from-blue-500 to-green-500 text-white shadow-md" 
                  : "hover:bg-blue-50 hover:text-blue-700"
              )}
              onClick={item.action}
            >
              <Icon className="h-5 w-5" />
              <span>{item.label}</span>
            </Button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-200">
        <div className="text-center">
          <p className="text-xs text-gray-500">FitPathway Organizer</p>
          <p className="text-xs text-gray-400">v1.0.0</p>
        </div>
      </div>
    </div>
  );
};
