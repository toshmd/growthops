import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";

const intervals = [
  "daily",
  "weekly",
  "biweekly",
  "monthly",
  "quarterly",
  "biannual",
  "annual",
];

const CreateProcess = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [interval, setInterval] = useState("");
  const [owner, setOwner] = useState("");
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would save to a backend
    toast({
      title: "Process Created",
      description: "The new process has been successfully created.",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container max-w-2xl">
        <Card className="p-6">
          <h1 className="text-2xl font-bold mb-6">Create New Process</h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Process Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter process title"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter process description"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="interval">Interval</Label>
              <Select value={interval} onValueChange={setInterval}>
                <SelectTrigger>
                  <SelectValue placeholder="Select interval" />
                </SelectTrigger>
                <SelectContent>
                  {intervals.map((int) => (
                    <SelectItem key={int} value={int}>
                      {int.charAt(0).toUpperCase() + int.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="owner">Process Owner</Label>
              <Input
                id="owner"
                value={owner}
                onChange={(e) => setOwner(e.target.value)}
                placeholder="Enter owner name"
                required
              />
            </div>

            <div className="pt-4">
              <Button type="submit" className="w-full">
                Create Process
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default CreateProcess;