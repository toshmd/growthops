import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Clock, CheckCircle2, AlertCircle, Calendar, ChevronDown, ChevronUp } from "lucide-react";
import { format, isPast } from "date-fns";
import { calculateFutureReportingDates } from "@/utils/dateCalculations";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useState } from "react";

// Mock data - in a real app this would come from a backend
const mockProcesses = [
  {
    id: 1,
    title: "Weekly Team Meeting Minutes",
    owner: "John Doe",
    interval: "weekly",
    status: "done",
    lastUpdated: "2024-03-01",
    startDate: new Date("2024-03-01"),
  },
  {
    id: 2,
    title: "Monthly Financial Report",
    owner: "Jane Smith",
    interval: "monthly",
    status: "blocked",
    lastUpdated: "2024-02-28",
    startDate: new Date("2024-02-01"),
  },
  {
    id: 3,
    title: "Quarterly Strategy Review",
    owner: "Mike Johnson",
    interval: "quarterly",
    status: "incomplete",
    lastUpdated: "2024-02-15",
    startDate: new Date("2024-01-01"),
  },
];

const Dashboard = () => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "done":
        return "bg-success text-success-foreground";
      case "blocked":
        return "bg-destructive text-destructive-foreground";
      case "incomplete":
        return "bg-warning text-warning-foreground";
      default:
        return "bg-secondary text-secondary-foreground";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "done":
        return <CheckCircle2 className="h-4 w-4 text-success" />;
      case "blocked":
        return <AlertCircle className="h-4 w-4 text-destructive" />;
      case "incomplete":
        return <Clock className="h-4 w-4 text-warning" />;
      default:
        return null;
    }
  };

  const getDateStatusColor = (date: Date, processStatus: string) => {
    if (isPast(date)) {
      return processStatus === "done" ? "bg-success/10" : "bg-destructive/10";
    }
    return "bg-gray-50";
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
                      {getStatusIcon(process.status)}
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
                      <div className="relative pl-4 mt-4">
                        <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gray-200" />
                        <div className="space-y-4">
                          {calculateFutureReportingDates(process.startDate, process.interval as any)
                            .map((date, index) => (
                              <div key={index} className="relative">
                                <div
                                  className={`absolute left-0 w-2.5 h-2.5 rounded-full -translate-x-[5px] ${
                                    process.status === "done" ? "bg-success" :
                                    isPast(date) ? "bg-destructive" : "bg-gray-300"
                                  }`}
                                />
                                <div className={`ml-4 p-3 rounded-lg ${getDateStatusColor(date, process.status)}`}>
                                  <div className="flex justify-between items-center">
                                    <span className="text-sm font-medium">
                                      {format(date, "PPP")}
                                    </span>
                                    {isPast(date) && process.status !== "done" && (
                                      <Badge 
                                        variant="destructive" 
                                        className="text-xs px-2 py-0.5"
                                      >
                                        Overdue
                                      </Badge>
                                    )}
                                  </div>
                                </div>
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