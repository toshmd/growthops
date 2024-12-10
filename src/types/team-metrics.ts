import { DbProfile } from "./database";

export interface TeamMember {
  name: string;
  completionRate: number;
  overdueItems: number;
  participationRate: number;
}

export interface Team {
  id: string;
  name: string;
  completionRate: number;
  overdueItems: number;
  participationRate: number;
  members: TeamMember[];
  people?: {
    user_id: string;
    profiles: DbProfile[];
  }[];
}

export interface ProcessProps {
  id: string;
  title: string;
  status: 'pending' | 'in_progress' | 'completed' | 'blocked';
  dueDate: string;
  assignedTo?: string;
}