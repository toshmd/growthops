export interface PeopleTable {
  Row: {
    id: string
    user_id: string | null
    team_id: string | null
    role: string | null
    created_at: string | null
    updated_at: string | null
  }
  Insert: {
    id?: string
    user_id?: string | null
    team_id?: string | null
    role?: string | null
    created_at?: string | null
    updated_at?: string | null
  }
  Update: {
    id?: string
    user_id?: string | null
    team_id?: string | null
    role?: string | null
    created_at?: string | null
    updated_at?: string | null
  }
}