export interface OutcomesTable {
  Row: {
    id: string
    title: string
    description: string | null
    interval: string
    next_due: string
    status: string | null
    start_date: string
    team_id: string | null
    company_id: string | null
    created_by: string | null
    parent_outcome_id: string | null
    created_at: string | null
    updated_at: string | null
  }
  Insert: {
    id?: string
    title: string
    description?: string | null
    interval: string
    next_due: string
    status?: string | null
    start_date: string
    team_id?: string | null
    company_id?: string | null
    created_by?: string | null
    parent_outcome_id?: string | null
    created_at?: string | null
    updated_at?: string | null
  }
  Update: {
    id?: string
    title?: string
    description?: string | null
    interval?: string
    next_due?: string
    status?: string | null
    start_date?: string
    team_id?: string | null
    company_id?: string | null
    created_by?: string | null
    parent_outcome_id?: string | null
    created_at?: string | null
    updated_at?: string | null
  }
}