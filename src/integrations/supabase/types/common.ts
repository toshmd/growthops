export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: Tables
    Views: Views
    Functions: Functions
    Enums: Enums
    CompositeTypes: CompositeTypes
  }
}

export type Tables = {
  activity_logs: ActivityLogsTable
  outcomes: OutcomesTable
  people: PeopleTable
  profiles: ProfilesTable
  tasks: TasksTable
  teams: TeamsTable
}

export type Views = Record<string, never>
export type Functions = Record<string, never>
export type Enums = Record<string, never>
export type CompositeTypes = Record<string, never>