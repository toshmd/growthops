export interface User {
  id: string;
  firstName: string;
  lastName: string;
  title: string;
  email: string;
  photo: string;
  status: "active" | "inactive";
  teamId?: string;
}