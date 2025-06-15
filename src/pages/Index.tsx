
import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { TrainerDashboard } from "@/components/dashboard/TrainerDashboard";
import { AthleteDashboard } from "@/components/dashboard/AthleteDashboard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Index = () => {
  // Mock user state - will be replaced with real authentication
  const [userRole, setUserRole] = useState<'trainer' | 'athlete' | null>(null);

  // Demo mode selector
  if (!userRole) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
              FitPathway Organizer
            </CardTitle>
            <p className="text-gray-600 mt-2">Choose your demo view</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={() => setUserRole('trainer')} 
              className="w-full h-16 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-lg"
            >
              View as Trainer/Admin
            </Button>
            <Button 
              onClick={() => setUserRole('athlete')} 
              className="w-full h-16 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-lg"
            >
              View as Athlete/Member
            </Button>
            <p className="text-xs text-gray-500 text-center mt-4">
              This is a demo. Real authentication will be connected via Supabase.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <AppLayout>
      {userRole === 'trainer' ? <TrainerDashboard /> : <AthleteDashboard />}
    </AppLayout>
  );
};

export default Index;
