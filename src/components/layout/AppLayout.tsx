import { useState } from "react";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { ProfileCompletionBanner } from "@/components/ui/ProfileCompletionBanner";
import { SidebarProvider } from "@/contexts/SidebarContext";

interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout = ({ children }: AppLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <SidebarProvider>
      <div className="min-h-screen bg-background text-foreground">
        <div className="flex h-screen">
          <div 
            className={`fixed inset-y-0 left-0 z-50 w-64 bg-card transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 ${
              sidebarOpen ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            <Sidebar onClose={() => setSidebarOpen(false)} />
          </div>
          
          {sidebarOpen && (
            <div 
              className="fixed inset-0 z-40 bg-black/50 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}

          <div className="flex-1 flex flex-col overflow-hidden">
            <Header>
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={() => setSidebarOpen(!sidebarOpen)}
              >
                <Menu className="h-6 w-6" />
              </Button>
            </Header>
            
            <main className="flex-1 overflow-auto p-4 sm:p-6 md:p-8">
              <ProfileCompletionBanner />
              {children}
            </main>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};
