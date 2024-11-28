import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Clock, CheckCircle2, AlertCircle, Calendar, ChevronDown, ChevronUp, Edit2 } from "lucide-react";
import { format, isPast, isWeekend } from "date-fns";
import { calculateFutureReportingDates } from "@/utils/dateCalculations";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import ActionItems from "@/components/process/ActionItems";
import { useToast } from "@/components/ui/use-toast";
import { Interval } from "@/utils/dateCalculations";

const Dashboard = () => {
  const { toast } = useToast();
  const [expandedDates, setExpandedDates] = useState<Record<string, boolean>>({});

  const mockProcesses = [
    {
      id: 1,
      title: "Weekly Team Meeting Minutes",
      owner: "John Doe",
      interval: "weekly" as Interval,
      status: "done",
      lastUpdated: "2024-03-01",
      startDate: new Date("2024-03-01"),
    },
    {
      id: 2,
      title: "Monthly Financial Report",
      owner: "Jane Smith",
      interval: "monthly" as Interval,
      status: "blocked",
      lastUpdated: "2024-02-28",
      startDate: new Date("2024-02-01"),
    },
    {
      id: 3,
      title: "Quarterly Strategy Review",
      owner: "Mike Johnson",
      interval: "quarterly" as Interval,
      status: "incomplete",
      lastUpdated: "2024-02-15",
      startDate: new Date("2024-01-01"),
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "done":
        return "bg-success/10 border-success";
      case "blocked":
        return "bg-destructive/10 border-destructive";
      default:
        return "bg-gray-50 border-gray-200";
    }
  };

  const handleUpdateNotes = (processId: number, date: Date, notes: string) => {
    // In a real app, this would update the backend
    toast({
      title: "Notes Updated",
      description: "The notes have been saved successfully.",
    });
  };

  const handleUpdateActionItems = (processId: number, date: Date, items: any[]) => {
    // In a real app, this would update the backend
    toast({
      title: "Action Items Updated",
      description: "The action items have been saved successfully.",
    });
  };

  const DateCard = ({ date, process, status }: { date: Date; process: any; status: string }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [notes, setNotes] = useState(status === "done" ? "Completed on time" : "");
    const [actionItems, setActionItems] = useState<any[]>([]);

    return (
      <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
        <div className={`p-4 rounded-lg border ${getStatusColor(status)}`}>
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                  <p className="font-medium">{format(date, "PPP")}</p>
                  {isPast(date) && status !== "done" && (
                    <Badge 
                      variant="destructive" 
                      className="text-xs px-2 py-0.5"
                    >
                      Overdue
                    </Badge>
                  )}
                </div>
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" size="sm">
                    {isExpanded ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <Edit2 className="h-4 w-4" />
                    )}
                  </Button>
                </CollapsibleTrigger>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-600">
                {status === "done" ? (
                  <CheckCircle2 className="h-4 w-4 text-success" />
                ) : isPast(date) ? (
                  <AlertCircle className="h-4 w-4 text-destructive" />
                ) : (
                  <Clock className="h-4 w-4 text-warning" />
                )}
                <span>
                  {status === "done" ? "Completed" : 
                   status === "blocked" ? "Blocked" : "Pending"}
                </span>
              </div>

              <CollapsibleContent>
                <div className="mt-4 space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-1 block">Notes</label>
                    <Textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Add notes..."
                      className="h-20"
                      onBlur={() => handleUpdateNotes(process.id, date, notes)}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-1 block">Action Items</label>
                    <ActionItems
                      items={actionItems}
                      onUpdate={(items) => {
                        setActionItems(items);
                        handleUpdateActionItems(process.id, date, items);
                      }}
                    />
                  </div>
                </div>
              </CollapsibleContent>
            </div>
          </div>
        </div>
      </Collapsible>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Leadership Dashboard</h1>
          <div className="flex gap-4">
            <Select>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by interval" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Intervals</SelectItem>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by owner" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Owners</SelectItem>
                <SelectItem value="john">John Doe</SelectItem>
                <SelectItem value="jane">Jane Smith</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {mockProcesses.map((process) => (
            <Card key={process.id} className="p-6">
              <div className="flex flex-col space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2">
                      {process.status === "done" ? (
                        <CheckCircle2 className="h-5 w-5 text-success" />
                      ) : (
                        <Clock className="h-5 w-5 text-warning" />
                      )}
                      <h2 className="text-lg font-semibold">{process.title}</h2>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">Owner: {process.owner}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {process.interval}
                    </Badge>
                    <Badge className={getStatusColor(process.status)}>
                      {process.status.charAt(0).toUpperCase() + process.status.slice(1)}
                    </Badge>
                  </div>
                </div>

                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="dates" className="border-none">
                    <AccordionTrigger className="py-2 hover:no-underline">
                      <span className="text-sm font-medium text-gray-600 flex items-center gap-2">
                        View All Dates
                        <ChevronDown className="h-4 w-4 transition-transform duration-200" />
                      </span>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="relative mt-6">
                        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200" />
                        <div className="space-y-6">
                          {calculateFutureReportingDates(process.startDate, process.interval).map((date, index) => (
                            <div key={index} className="relative pl-12">
                              <div className={`absolute left-3 w-3 h-3 rounded-full -translate-x-1.5 ${
                                process.status === "done" ? "bg-success" : 
                                isPast(date) ? "bg-destructive" : "bg-gray-300"
                              }`} />
                              <DateCard
                                date={date}
                                process={process}
                                status={process.status}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;