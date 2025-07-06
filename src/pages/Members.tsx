import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useTrainerAthletes } from "@/hooks/useTrainerAthletes";
import { InviteAthleteDialog } from "@/components/members/InviteAthleteDialog";
import { RemoveAthleteDialog } from "@/components/members/RemoveAthleteDialog";
import { AssignWorkoutDialog } from "@/components/workouts/AssignWorkoutDialog";

import { Mail, Trash2, BarChart2 } from "lucide-react";
import { Link } from "react-router-dom";

const Members = () => {
  const { athletes, isLoading, removeAthlete } = useTrainerAthletes();

  if (isLoading) {
    return (
      <AppLayout>
        <div className="p-6">Loading...</div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-6 p-4 md:p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Members</h1>
            <p className="text-muted-foreground mt-1">Manage your athletes and their progress.</p>
          </div>
          <div className="flex space-x-2">
            <InviteAthleteDialog />
            <AssignWorkoutDialog />
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Athlete Roster</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th scope="col" className="relative px-6 py-3">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {athletes && athletes.map((athlete) => (
                    <tr key={athlete.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{athlete.full_name}</div>
                            <div className="text-sm text-gray-500">{athlete.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          Active
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Button variant="ghost" size="icon">
                          <Mail className="h-4 w-4" />
                        </Button>
                        <Link to={`/athlete-progress/${athlete.id}`}>
                          <Button variant="ghost" size="icon">
                            <BarChart2 className="h-4 w-4" />
                          </Button>
                        </Link>
                        <RemoveAthleteDialog athleteId={athlete.id} athleteName={athlete.full_name} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default Members;