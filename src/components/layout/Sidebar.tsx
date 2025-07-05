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
  Apple,
  Target,
  Trophy
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuthProvider";
import { useNavigate, useLocation } from "react-router-dom";

interface SidebarProps {
  onClose?: () => void;
}

interface NavItem {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  path: string;
  role?: 'trainer' | 'athlete' | 'both';
}

export const Sidebar = ({ onClose }: SidebarProps) => {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const userRole = profile?.role ?? "athlete";
  
  const handleNavigation = (path: string) => {
    console.log('Navigating to:', path);
    navigate(path);
    if (onClose) {
      onClose();
    }
  };

  const trainerNavItems: NavItem[] = [
    { icon: Home, label: "Dashboard", path: "/", role: "both" },
    { icon: Users, label: "Members", path: "/members", role: "trainer" },
    { icon: Dumbbell, label: "Exercise Library", path: "/exercises", role: "trainer" },
    { icon: Dumbbell, label: "Workout Library", path: "/workout-library", role: "trainer" },
    { icon: Dumbbell, label: "Assigned Workouts", path: "/assigned-workouts-trainer", role: "trainer" },
    { icon: Calendar, label: "Schedules", path: "/schedule", role: "both" },
    { icon: Apple, label: "Diet Plans", path: "/diet-plan", role: "trainer" },
    { icon: MessageSquare, label: "Messages", path: "/messages", role: "both" },
    { icon: BarChart3, label: "Reports", path: "/reports", role: "trainer" },
    { icon: Target, label: "Goals", path: "/goals", role: "both" },
    { icon: User, label: "Profile", path: "/profile", role: "both" },
    { icon: Settings, label: "Settings", path: "/settings", role: "both" },
  ];

  const athleteNavItems: NavItem[] = [
    { icon: Home, label: "Dashboard", path: "/", role: "both" },
    { icon: Calendar, label: "My Schedule", path: "/schedule", role: "athlete" },
    { icon: Dumbbell, label: "Assigned Workouts", path: "/assigned-workouts", role: "athlete" },
    { icon: BookOpen, label: "My Diet Plan", path: "/diet-plan", role: "athlete" },
    { icon: BarChart3, label: "Progress", path: "/progress", role: "athlete" },
    { icon: Trophy, label: "Achievements", path: "/achievements", role: "athlete" },
    { icon: MessageSquare, label: "Messages", path: "/messages", role: "both" },
    { icon: User, label: "Profile", path: "/profile", role: "both" },
    { icon: Settings, label: "Settings", path: "/settings", role: "both" },
  ];
  
  const navItems = userRole === "trainer" ? trainerNavItems : athleteNavItems;

  return (
    <div className="h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 flex flex-col">
      <div className="flex items-center justify-between p-4 lg:hidden">
        <span className="text-lg font-semibold dark:text-white">Menu</span>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (onClose) {
              onClose();
            }
          }}
          className="hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <X className="h-5 w-5" />
        </Button>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          
          return (
            <Button
              key={item.label}
              variant={isActive ? "default" : "ghost"}
              className={cn(
                "w-full justify-start space-x-3 py-3 px-4 cursor-pointer text-left",
                isActive 
                  ? "bg-gradient-to-r from-blue-500 to-green-500 text-white shadow-md" 
                  : "hover:bg-blue-50 dark:hover:bg-gray-800 hover:text-blue-700 dark:hover:text-blue-400 text-gray-700 dark:text-gray-300"
              )}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleNavigation(item.path);
              }}
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              <span className="truncate">{item.label}</span>
            </Button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400">FitPathway Organizer</p>
          <p className="text-xs text-gray-400 dark:text-gray-500">v1.0.0</p>
        </div>
      </div>
    </div>
  );
};
