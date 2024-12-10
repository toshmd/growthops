export interface ProfilesTable {
  Row: {
    id: string
    first_name: string | null
    last_name: string | null
    title: string | null
    phone: string | null
    created_at: string | null
    updated_at: string | null
  }
  Insert: {
    id: string
    first_name?: string | null
    last_name?: string | null
    title?: string | null
    phone?: string | null
    created_at?: string | null
    updated_at?: string | null
  }
  Update: {
    id?: string
    first_name?: string | null
    last_name?: string | null
    title?: string | null
    phone?: string | null
    created_at?: string | null
    updated_at?: string | null
  }
}