export interface TasksTable {
  Row: {
    id: string
    title: string
    description: string | null
    status: string | null
    due_date: string | null
    outcome_id: string | null
    assigned_to: string | null
    created_at: string | null
    updated_at: string | null
  }
  Insert: {
    id?: string
    title: string
    description?: string | null
    status?: string | null
    due_date?: string | null
    outcome_id?: string | null
    assigned_to?: string | null
    created_at?: string | null
    updated_at?: string | null
  }
  Update: {
    id?: string
    title?: string
    description?: string | null
    status?: string | null
    due_date?: string | null
    outcome_id?: string | null
    assigned_to?: string | null
    created_at?: string | null
    updated_at?: string | null
  }
}