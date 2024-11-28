import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { format } from "date-fns";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { calculateFutureReportingDates } from "@/utils/dateCalculations";

// Mock data - in a real app this would come from a backend
const mockProcesses = [
  {
    id: 1,
    title: "Weekly Team Meeting Minutes",
    description: "Document and distribute team meeting minutes",
    interval: "weekly" as const,
    nextDue: "2024-03-10",
    status: "incomplete",
    startDate: new Date("2024-03-01"),
  },
  {
    id: 2,
    title: "Monthly Financial Report",
    description: "Prepare and submit monthly financial summary",
    interval: "monthly" as const,
    nextDue: "2024-03-31",
    status: "done",
    startDate: new Date("2024-01-01"),
  },
];

const MyProcesses = () => {
  const [selectedStatus, setSelectedStatus] = useState("");
  const [notes, setNotes] = useState("");
  const { toast } = useToast();

  const handleUpdateStatus = (processId: number) => {
    toast({
      title: "Status Updated",
      description: "The process status has been updated successfully.",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container">
        <h1 className="text-2xl font-bold mb-6">My Processes</h1>
        <div className="space-y-6">
          {mockProcesses.map((process) => (
            <Card key={process.id} className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-xl font-semibold">{process.title}</h2>
                  <p className="text-gray-600 mt-1">{process.description}</p>
                </div>
                <Badge variant={process.status === "done" ? "default" : "secondary"}>
                  {process.interval}
                </Badge>
              </div>
              
              <Accordion type="single" collapsible className="w-full mb-4">
                <AccordionItem value="future-dates">
                  <AccordionTrigger>Future Reporting Dates</AccordionTrigger>
                  <AccordionContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                      {calculateFutureReportingDates(process.startDate, process.interval).map((date, index) => (
                        <div key={index} className="p-2 bg-gray-50 rounded-md">
                          {format(date, "PPP")}
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Status Update</label>
                    <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="done">Done</SelectItem>
                        <SelectItem value="incomplete">Incomplete</SelectItem>
                        <SelectItem value="blocked">Blocked</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Notes</label>
                    <Textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Add any relevant notes..."
                      className="h-20"
                    />
                  </div>
                </div>
                
                <Button
                  onClick={() => handleUpdateStatus(process.id)}
                  className="mt-4"
                >
                  Update Status
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyProcesses;