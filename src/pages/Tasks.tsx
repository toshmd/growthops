import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";

// Mock data - in a real app, this would come from your processes
const mockTasks = [
  {
    id: "1",
    text: "Review meeting notes",
    processCategory: "HR",
    processName: "Weekly Team Meeting Minutes",
    date: new Date("2024-03-10"),
    owner: "John Doe",
    completed: false,
  },
  {
    id: "2",
    text: "Update financial spreadsheet",
    processCategory: "Finance",
    processName: "Monthly Financial Report",
    date: new Date("2024-03-31"),
    owner: "Jane Smith",
    completed: true,
  },
];

const Tasks = () => {
  const [tasks, setTasks] = useState(mockTasks);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const filteredTasks = tasks
    .filter((task) => {
      if (filter === "completed") return task.completed;
      if (filter === "pending") return !task.completed;
      return true;
    })
    .filter(
      (task) =>
        task.text.toLowerCase().includes(search.toLowerCase()) ||
        task.processName.toLowerCase().includes(search.toLowerCase()) ||
        task.processCategory.toLowerCase().includes(search.toLowerCase()) ||
        task.owner.toLowerCase().includes(search.toLowerCase())
    );

  const toggleTask = (taskId: string) => {
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Tasks</h1>
        <div className="flex gap-4">
          <Input
            placeholder="Search tasks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-64"
          />
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Tasks</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">Status</TableHead>
              <TableHead>Task</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Process</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Owner</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTasks.map((task) => (
              <TableRow key={task.id}>
                <TableCell>
                  <Checkbox
                    checked={task.completed}
                    onCheckedChange={() => toggleTask(task.id)}
                  />
                </TableCell>
                <TableCell className="font-medium">{task.text}</TableCell>
                <TableCell>{task.processCategory}</TableCell>
                <TableCell>{task.processName}</TableCell>
                <TableCell>{format(task.date, "MMM d, yyyy")}</TableCell>
                <TableCell>{task.owner}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Tasks;