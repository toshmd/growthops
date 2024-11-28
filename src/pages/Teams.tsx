import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import TeamTable from "@/components/teams/TeamTable";
import TeamModal from "@/components/teams/TeamModal";
import { Team } from "@/types/team";

const Teams = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);

  // Mock data - replace with actual API call
  const teams: Team[] = [
    {
      id: "1",
      name: "Engineering",
      description: "Software development team",
      createdAt: new Date(),
      members: 5,
    },
    {
      id: "2",
      name: "Marketing",
      description: "Marketing and communications team",
      createdAt: new Date(),
      members: 3,
    },
  ];

  const handleCreateTeam = () => {
    setSelectedTeam(null);
    setIsModalOpen(true);
  };

  const handleEditTeam = (team: Team) => {
    setSelectedTeam(team);
    setIsModalOpen(true);
  };

  return (
    <div className="container py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Teams</h1>
        <Button onClick={handleCreateTeam}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Create Team
        </Button>
      </div>

      <TeamTable teams={teams} onEdit={handleEditTeam} />
      
      <TeamModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        team={selectedTeam}
      />
    </div>
  );
};

export default Teams;