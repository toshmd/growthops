import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">Process Management System</h1>
          <p className="text-lg text-gray-600 mb-8">Track and manage recurring business processes efficiently</p>
          <div className="space-x-4">
            <Button asChild>
              <Link to="/manage">Manage Processes</Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/my-processes">My Processes</Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/dashboard">Leadership Dashboard</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;