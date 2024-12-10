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
import ErrorBoundary from "../advisor/ErrorBoundary";
import QueryErrorBoundary from "../common/QueryErrorBoundary";
import { Team, TeamMember } from "@/types/team-metrics";
import { DbProfile } from "@/types/database";

const TeamPerformanceMetrics = () => {
  const [expandedTeams, setExpandedTeams] = useState<string[]>([]);

  const { data: teams = [], isLoading, error, refetch } = useQuery<Team[]>({
    queryKey: ['team-performance'],
    queryFn: async () => {
      console.log('Fetching team performance data');
      
      const { data: teamsData, error: teamsError } = await supabase
        .from('teams')
        .select(`
          id,
          name,
          people (
            user_id,
            profiles!inner (
              id,
              first_name,
              last_name,
              phone,
              title,
              created_at,
              updated_at
            )
          )
        `);

      if (teamsError) throw teamsError;

      const teamsWithMetrics: Team[] = await Promise.all((teamsData || []).map(async (team) => {
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

        const members: TeamMember[] = (team.people || []).map(person => {
          const profile = person.profiles[0] as DbProfile;
          const memberOutcomes = outcomes?.filter(o => o.created_by === person.user_id) || [];
          const memberCompleted = memberOutcomes.filter(o => o.status === 'completed').length;
          const memberOverdue = memberOutcomes.filter(o => {
            const dueDate = new Date(o.next_due);
            return dueDate < new Date() && o.status !== 'completed';
          }).length;

          return {
            name: `${profile.first_name || ''} ${profile.last_name || ''}`.trim(),
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
          members,
          people: team.people
        };
      }));

      console.log('Fetched team performance data:', teamsWithMetrics);
      return teamsWithMetrics;
    },
    retry: 3,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
    meta: {
      errorMessage: "Failed to load team performance data"
    }
  });

  if (error) {
    return (
      <QueryErrorBoundary 
        error={error instanceof Error ? error : new Error('An unexpected error occurred')} 
        resetErrorBoundary={() => refetch()} 
      />
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

  const toggleTeam = (teamId: string) => {
    setExpandedTeams(current =>
      current.includes(teamId)
        ? current.filter(id => id !== teamId)
        : [...current, teamId]
    );
  };

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
