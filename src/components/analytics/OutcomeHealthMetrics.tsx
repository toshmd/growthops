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
import { ChevronDown, ChevronRight, AlertCircle } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const OutcomeHealthMetrics = () => {
  const [expandedTeams, setExpandedTeams] = useState<string[]>([]);

  const mockData = {
    teams: [
      {
        id: "1",
        name: "Engineering",
        complianceRate: 92,
        blockedOutcomes: 2,
        members: [
          { 
            name: "John Doe", 
            complianceRate: 95, 
            blockedOutcomes: 1,
            blockedDetails: [
              { title: "Code Review Process", reason: "Waiting for security review", blockedSince: "2024-03-01" }
            ]
          },
          { 
            name: "Jane Smith", 
            complianceRate: 88, 
            blockedOutcomes: 1,
            blockedDetails: [
              { title: "Documentation Update", reason: "Pending stakeholder approval", blockedSince: "2024-03-05" }
            ]
          },
        ],
      },
      {
        id: "2",
        name: "Marketing",
        complianceRate: 85,
        blockedOutcomes: 3,
        members: [
          { 
            name: "Alice Johnson", 
            complianceRate: 82, 
            blockedOutcomes: 2,
            blockedDetails: [
              { title: "Campaign Launch", reason: "Budget approval pending", blockedSince: "2024-03-02" },
              { title: "Market Research", reason: "Vendor selection delayed", blockedSince: "2024-03-04" }
            ]
          },
          { 
            name: "Bob Wilson", 
            complianceRate: 88, 
            blockedOutcomes: 1,
            blockedDetails: [
              { title: "Social Media Strategy", reason: "Awaiting legal review", blockedSince: "2024-03-03" }
            ]
          },
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
      <h2 className="text-xl font-semibold mb-4">Outcome Health Metrics</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[300px]">Team</TableHead>
            <TableHead>Compliance Rate</TableHead>
            <TableHead>Blocked Outcomes</TableHead>
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
                    <Progress value={team.complianceRate} className="w-[60px]" />
                    <span>{team.complianceRate}%</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-destructive" />
                    {team.blockedOutcomes}
                  </div>
                </TableCell>
              </TableRow>
              {expandedTeams.includes(team.id) && team.members.map((member, idx) => (
                <TableRow key={`${team.id}-${idx}`} className="bg-muted/30">
                  <TableCell className="pl-10">{member.name}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress value={member.complianceRate} className="w-[60px]" />
                      <span>{member.complianceRate}%</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost" className="flex items-center gap-2">
                          <AlertCircle className="h-4 w-4 text-destructive" />
                          {member.blockedOutcomes}
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Blocked Outcomes for {member.name}</DialogTitle>
                          <DialogDescription>
                            Details of currently blocked outcomes
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          {member.blockedDetails.map((detail, index) => (
                            <div key={index} className="border-b pb-4 last:border-0">
                              <h4 className="font-medium">{detail.title}</h4>
                              <p className="text-sm text-muted-foreground mt-1">Reason: {detail.reason}</p>
                              <p className="text-sm text-muted-foreground">Blocked since: {new Date(detail.blockedSince).toLocaleDateString()}</p>
                            </div>
                          ))}
                        </div>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}
            </>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
};

export default OutcomeHealthMetrics;