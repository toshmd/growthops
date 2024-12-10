import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";
import { useCompany } from "@/contexts/CompanyContext";
import ErrorBoundary from "../advisor/ErrorBoundary";

interface TeamMember {
  name: string;
  completionRate: number;
  overdueItems: number;
  participationRate: number;
}

interface Team {
  id: string;
  name: string;
  completionRate: number;
  overdueItems: number;
  participationRate: number;
  members: TeamMember[];
}

const TeamPerformanceMetrics = () => {
  const [expandedTeams, setExpandedTeams] = useState<string[]>([]);
  const { selectedCompanyId } = useCompany();

  const { data: teams = [], isLoading, error } = useQuery({
    queryKey: ['team-performance', selectedCompanyId],
    queryFn: async () => {
      if (!selectedCompanyId) return [];

      // Fetch teams
      const { data: teamsData, error: teamsError } = await supabase
        .from('teams')
        .select(`
          id,
          name,
          people (
            user_id,
            profiles (
              first_name,
              last_name
            )
          )
        `)
        .eq('company_id', selectedCompanyId);

      if (teamsError) throw teamsError;

      // For each team, fetch outcomes and calculate metrics
      const teamsWithMetrics = await Promise.all(teamsData.map(async (team) => {
        const { data: outcomes, error: outcomesError } = await supabase
          .from('outcomes')
          .select('*')
          .eq('team_id', team.id);

        if (outcomesError) throw outcomesError;

        const totalOutcomes = outcomes?.length || 0;
        const completedOutcomes = outcomes?.filter(o => o.status === 'completed').length || 0;
        const overdueOutcomes = outcomes?.filter(o => {
          const dueDate = new Date(o.next_due);
          return dueDate < new Date() && o.status !== 'completed';
        }).length || 0;

        // Calculate member metrics
        const members = team.people.map(person => {
          const memberOutcomes = outcomes?.filter(o => o.created_by === person.user_id) || [];
          const memberCompleted = memberOutcomes.filter(o => o.status === 'completed').length;
          const memberOverdue = memberOutcomes.filter(o => {
            const dueDate = new Date(o.next_due);
            return dueDate < new Date() && o.status !== 'completed';
          }).length;

          return {
            name: `${person.profiles?.first_name || ''} ${person.profiles?.last_name || ''}`.trim(),
            completionRate: memberOutcomes.length ? (memberCompleted / memberOutcomes.length) * 100 : 0,
            overdueItems: memberOverdue,
            participationRate: totalOutcomes ? (memberOutcomes.length / totalOutcomes) * 100 : 0
          };
        });

        return {
          id: team.id,
          name: team.name,
          completionRate: totalOutcomes ? (completedOutcomes / totalOutcomes) * 100 : 0,
          overdueItems: overdueOutcomes,
          participationRate: totalOutcomes ? 100 : 0,
          members
        };
      }));

      return teamsWithMetrics;
    },
    enabled: !!selectedCompanyId
  });

  const toggleTeam = (teamId: string) => {
    setExpandedTeams(current =>
      current.includes(teamId)
        ? current.filter(id => id !== teamId)
        : [...current, teamId]
    );
  };

  if (error) {
    return (
      <Card className="p-6">
        <div className="text-center text-red-500">
          Error loading team performance data
        </div>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-8 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">Team Performance Metrics</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[300px]">Team</TableHead>
            <TableHead>Task Completion Rate</TableHead>
            <TableHead>Overdue Items</TableHead>
            <TableHead>Participation Rate</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {teams.map((team) => (
            <>
              <TableRow key={team.id} className="cursor-pointer hover:bg-muted/50" onClick={() => toggleTeam(team.id)}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    {expandedTeams.includes(team.id) ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                    {team.name}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Progress value={team.completionRate} className="w-[60px]" />
                    <span>{Math.round(team.completionRate)}%</span>
                  </div>
                </TableCell>
                <TableCell>{team.overdueItems}</TableCell>
                <TableCell>{Math.round(team.participationRate)}%</TableCell>
              </TableRow>
              {expandedTeams.includes(team.id) && team.members.map((member, idx) => (
                <TableRow key={`${team.id}-${idx}`} className="bg-muted/30">
                  <TableCell className="pl-10">{member.name}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress value={member.completionRate} className="w-[60px]" />
                      <span>{Math.round(member.completionRate)}%</span>
                    </div>
                  </TableCell>
                  <TableCell>{member.overdueItems}</TableCell>
                  <TableCell>{Math.round(member.participationRate)}%</TableCell>
                </TableRow>
              ))}
            </>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
};

export default () => (
  <ErrorBoundary>
    <TeamPerformanceMetrics />
  </ErrorBoundary>
);