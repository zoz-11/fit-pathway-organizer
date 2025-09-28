import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Bell, Settings, LogOut, User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/useAuthProvider";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

interface HeaderProps {
  children?: React.ReactNode;
}

export const Header = ({ children }: HeaderProps) => {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
  };

  const handleProfileClick = () => {
    navigate('/profile');
  };

  const handleSettingsClick = () => {
    navigate('/settings');
  };

  return (
    <header className="sticky top-0 z-30 bg-card border-b shadow-sm">
      <div className="container flex h-16 items-center px-4 sm:px-6">
        <div className="flex gap-2 items-center">
          {children}
          <div className="ml-2 text-lg font-medium hidden md:block">
            FitPathway Organizer
          </div>
        </div>

        <div className="flex items-center space-x-4 ml-auto">
          <Button 
            variant="ghost" 
            size="sm" 
            className="relative" 
            aria-label="Notifications"
            onClick={() => navigate('/settings')}
          >
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center space-x-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-800">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={undefined} />
                  <AvatarFallback className="bg-gradient-to-r from-blue-500 to-green-500 text-white">
                    {profile?.full_name ? profile.full_name.split(' ').map((n: string) => n[0]).join('') : user?.email?.[0]?.toUpperCase() ?? 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="text-left hidden md:block">
                  <p className="text-sm font-medium dark:text-white">{profile?.full_name ?? user?.email}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{profile?.role ?? 'user'}</p>
                </div>
              </Button>
            </DropdownMenuTrigger>
            
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">Account</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user?.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem asChild>
                  <Link to="/profile">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/settings">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};
