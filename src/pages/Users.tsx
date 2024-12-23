import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import UserTable from "@/components/users/UserTable";
import UserModal from "@/components/users/UserModal";
import { User } from "@/types/user";
import { Team } from "@/types/team";

const Users = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Mock data - replace with actual API call
  const users: User[] = [
    {
      id: "1",
      firstName: "John",
      lastName: "Doe",
      title: "Software Engineer",
      email: "john@example.com",
      photo: "https://api.dicebear.com/7.x/avatars/svg?seed=John",
      status: "active",
      teamId: "1",
    },
    {
      id: "2",
      firstName: "Jane",
      lastName: "Smith",
      title: "Product Manager",
      email: "jane@example.com",
      photo: "https://api.dicebear.com/7.x/avatars/svg?seed=Jane",
      status: "active",
      teamId: "2",
    },
  ];

  // Mock teams data - replace with actual API call
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

  const handleCreateUser = () => {
    setSelectedUser(null);
    setIsModalOpen(true);
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  return (
    <div className="container py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Users</h1>
        <Button onClick={handleCreateUser}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add User
        </Button>
      </div>

      <UserTable users={users} onEdit={handleEditUser} />
      
      <UserModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        user={selectedUser}
        teams={teams}
      />
    </div>
  );
};

export default Users;