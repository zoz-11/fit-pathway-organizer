import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageLayout } from "@/components/layout/PageLayout";
import { Card, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useTrainerAthletes } from "@/hooks/useTrainerAthletes";
import { InviteAthleteDialog } from "@/components/members/InviteAthleteDialog";
import { RemoveAthleteDialog } from "@/components/members/RemoveAthleteDialog";
import { AssignWorkoutDialog } from "@/components/workouts/AssignWorkoutDialog";
import { Mail, Trash2, BarChart2, MoreVertical, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const Members = () => {
  const { athletes, isLoading } = useTrainerAthletes();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredAthletes = athletes?.filter(athlete => {
    const nameMatch = athlete.full_name?.toLowerCase().includes(searchTerm.toLowerCase());
    const statusMatch = statusFilter === "all" || athlete.status === statusFilter;
    return nameMatch && statusMatch;
  });

  if (isLoading) {
    return (
      <AppLayout>
        <PageLayout title="Members" description="Manage your athletes and their progress.">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader className="flex-row items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-muted" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-muted rounded w-3/4" />
                    <div className="h-3 bg-muted rounded w-1/2" />
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </PageLayout>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <PageLayout title="Members" description="Manage your athletes and their progress.">
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center mb-4">
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search by name..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
            <InviteAthleteDialog />
            <AssignWorkoutDialog />
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredAthletes && filteredAthletes.map((athlete) => (
            <Card key={athlete.id}>
              <CardHeader className="flex-row items-center gap-4">
                <Avatar>
                  <AvatarImage src={athlete.avatar_url} alt={athlete.full_name} />
                  <AvatarFallback>{athlete.full_name?.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="font-semibold">{athlete.full_name}</h3>
                  <p className="text-sm text-muted-foreground">{athlete.email}</p>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link to={`/athlete-progress/${athlete.id}`}>
                        <BarChart2 className="mr-2 h-4 w-4" />
                        View Progress
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Mail className="mr-2 h-4 w-4" />
                      Send Message
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600">
                      <Trash2 className="mr-2 h-4 w-4" />
                      <RemoveAthleteDialog athleteId={athlete.id} athleteName={athlete.full_name} />
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardHeader>
            </Card>
          ))}
        </div>
      </PageLayout>
    </AppLayout>
  );
};

export default Members;