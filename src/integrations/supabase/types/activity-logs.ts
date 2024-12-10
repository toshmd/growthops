import { Json } from './common'

export interface ActivityLogsTable {
  Row: {
    id: string
    entity_type: string
    entity_id: string
    action: string
    details: Json | null
    user_id: string | null
    created_at: string | null
  }
  Insert: {
    id?: string
    entity_type: string
    entity_id: string
    action: string
    details?: Json | null
    user_id?: string | null
    created_at?: string | null
  }
  Update: {
    id?: string
    entity_type?: string
    entity_id?: string
    action?: string
    details?: Json | null
    user_id?: string | null
    created_at?: string | null
  }
}