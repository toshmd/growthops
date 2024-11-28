import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, Users, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { format } from "date-fns";

interface TeamUpdate {
  id: number;
  user: string;
  action: string;
  outcome: string;
  timestamp: Date;
}

interface OwnershipChange {
  id: number;
  outcome: string;
  previousOwner: string;
  newOwner: string;
  timestamp: Date;
}

const mockTeamUpdates: TeamUpdate[] = [
  {
    id: 1,
    user: "Sarah Chen",
    action: "completed",
    outcome: "Monthly Report",
    timestamp: new Date(2024, 2, 15, 14, 30)
  },
  {
    id: 2,
    user: "Alex Kim",
    action: "updated",
    outcome: "Weekly Review",
    timestamp: new Date(2024, 2, 14, 16, 45)
  }
];

const mockOwnershipChanges: OwnershipChange[] = [
  {
    id: 1,
    outcome: "Quarterly Analysis",
    previousOwner: "Mike Johnson",
    newOwner: "Emma Davis",
    timestamp: new Date(2024, 2, 13, 11, 20)
  }
];

const TeamActivity = () => {
  const { toast } = useToast();

  const handleRefresh = () => {
    toast({
      title: "Refreshed",
      description: "Team activity has been updated.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">Team Activity</h2>
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          className="gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </Button>
      </div>

      <Card className="p-6">
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium flex items-center gap-2 mb-4">
              <Users className="h-5 w-5 text-primary" />
              Recent Updates
            </h3>
            <div className="space-y-4">
              {mockTeamUpdates.map((update) => (
                <div
                  key={update.id}
                  className="flex items-start justify-between border-b border-gray-100 pb-4"
                >
                  <div>
                    <p className="font-medium text-gray-900">{update.user}</p>
                    <p className="text-sm text-gray-600">
                      {update.action} {update.outcome}
                    </p>
                    <p className="text-xs text-gray-500">
                      {format(update.timestamp, "MMM d, yyyy 'at' h:mm a")}
                    </p>
                  </div>
                  <Badge variant={update.action === "completed" ? "success" : "default"}>
                    {update.action}
                  </Badge>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium flex items-center gap-2 mb-4">
              <UserCheck className="h-5 w-5 text-primary" />
              Ownership Changes
            </h3>
            <div className="space-y-4">
              {mockOwnershipChanges.map((change) => (
                <div
                  key={change.id}
                  className="flex items-start justify-between border-b border-gray-100 pb-4"
                >
                  <div>
                    <p className="font-medium text-gray-900">{change.outcome}</p>
                    <p className="text-sm text-gray-600">
                      Transferred from {change.previousOwner} to {change.newOwner}
                    </p>
                    <p className="text-xs text-gray-500">
                      {format(change.timestamp, "MMM d, yyyy 'at' h:mm a")}
                    </p>
                  </div>
                  <Badge variant="secondary">ownership</Badge>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default TeamActivity;