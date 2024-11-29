import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, Users, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { format } from "date-fns";
import { useQueryClient } from "@tanstack/react-query";

interface ActivityLog {
  id: string;
  action: string;
  entity_id: string;
  details: any;
  created_at: string;
  profiles: {
    first_name: string;
    last_name: string;
  } | null;
}

interface TeamActivityProps {
  activityLogs: ActivityLog[];
  isLoading: boolean;
}

const TeamActivity = ({ activityLogs, isLoading }: TeamActivityProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ['activity_logs'] });
    toast({
      title: "Refreshed",
      description: "Team activity has been updated.",
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">Team Activity</h2>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            className="gap-2"
            disabled
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
        </div>

        <Card className="p-6">
          <div className="space-y-6 animate-pulse">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-gray-100 rounded" />
            ))}
          </div>
        </Card>
      </div>
    );
  }

  const recentUpdates = activityLogs.filter(log => 
    ['updated', 'completed'].includes(log.action)
  );

  const ownershipChanges = activityLogs.filter(log => 
    log.action === 'ownership_changed'
  );

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
              {recentUpdates.map((update) => (
                <div
                  key={update.id}
                  className="flex items-start justify-between border-b border-gray-100 pb-4"
                >
                  <div>
                    <p className="font-medium text-gray-900">
                      {update.profiles ? 
                        `${update.profiles.first_name} ${update.profiles.last_name}` : 
                        'Unknown User'}
                    </p>
                    <p className="text-sm text-gray-600">
                      {update.action} {update.details?.outcome_title || 'an outcome'}
                    </p>
                    <p className="text-xs text-gray-500">
                      {format(new Date(update.created_at), "MMM d, yyyy 'at' h:mm a")}
                    </p>
                  </div>
                  <Badge variant={update.action === "completed" ? "success" : "default"}>
                    {update.action}
                  </Badge>
                </div>
              ))}
              {recentUpdates.length === 0 && (
                <p className="text-muted-foreground text-center py-4">
                  No recent updates
                </p>
              )}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium flex items-center gap-2 mb-4">
              <UserCheck className="h-5 w-5 text-primary" />
              Ownership Changes
            </h3>
            <div className="space-y-4">
              {ownershipChanges.map((change) => (
                <div
                  key={change.id}
                  className="flex items-start justify-between border-b border-gray-100 pb-4"
                >
                  <div>
                    <p className="font-medium text-gray-900">
                      {change.details?.outcome_title || 'Outcome'}
                    </p>
                    <p className="text-sm text-gray-600">
                      Transferred from {change.details?.previous_owner || 'previous owner'} to{' '}
                      {change.details?.new_owner || 'new owner'}
                    </p>
                    <p className="text-xs text-gray-500">
                      {format(new Date(change.created_at), "MMM d, yyyy 'at' h:mm a")}
                    </p>
                  </div>
                  <Badge variant="secondary">ownership</Badge>
                </div>
              ))}
              {ownershipChanges.length === 0 && (
                <p className="text-muted-foreground text-center py-4">
                  No ownership changes
                </p>
              )}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default TeamActivity;