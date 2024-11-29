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

const TeamPerformanceMetrics = () => {
  const [expandedTeams, setExpandedTeams] = useState<string[]>([]);

  const mockData = {
    teams: [
      {
        id: "1",
        name: "Engineering",
        completionRate: 85,
        overdueItems: 3,
        participationRate: 92,
        members: [
          { name: "John Doe", completionRate: 90, overdueItems: 1, participationRate: 95 },
          { name: "Jane Smith", completionRate: 80, overdueItems: 2, participationRate: 88 },
        ],
      },
      {
        id: "2",
        name: "Marketing",
        completionRate: 78,
        overdueItems: 5,
        participationRate: 85,
        members: [
          { name: "Alice Johnson", completionRate: 75, overdueItems: 3, participationRate: 82 },
          { name: "Bob Wilson", completionRate: 82, overdueItems: 2, participationRate: 88 },
        ],
      },
    ],
  };

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
          {mockData.teams.map((team) => (
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
                    <span>{team.completionRate}%</span>
                  </div>
                </TableCell>
                <TableCell>{team.overdueItems}</TableCell>
                <TableCell>{team.participationRate}%</TableCell>
              </TableRow>
              {expandedTeams.includes(team.id) && team.members.map((member, idx) => (
                <TableRow key={`${team.id}-${idx}`} className="bg-muted/30">
                  <TableCell className="pl-10">{member.name}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress value={member.completionRate} className="w-[60px]" />
                      <span>{member.completionRate}%</span>
                    </div>
                  </TableCell>
                  <TableCell>{member.overdueItems}</TableCell>
                  <TableCell>{member.participationRate}%</TableCell>
                </TableRow>
              ))}
            </>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
};

export default TeamPerformanceMetrics;