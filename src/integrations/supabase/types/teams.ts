export interface TeamsTable {
  Row: {
    id: string
    name: string
    description: string | null
    created_at: string | null
    updated_at: string | null
  }
  Insert: {
    id?: string
    name: string
    description?: string | null
    created_at?: string | null
    updated_at?: string | null
  }
  Update: {
    id?: string
    name?: string
    description?: string | null
    created_at?: string | null
    updated_at?: string | null
  }
}