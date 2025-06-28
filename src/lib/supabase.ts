
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://zuedrwwniualphtpimpy.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp1ZWRyd3duaXVhbHBodHBpbXB5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTExMzg3NTgsImV4cCI6MjA2NjcxNDc1OH0.IXmWR5C9XdO5HUBMw2NRipEHTPy1_1T2kbVkk6BkOIg'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Tipos para TypeScript
export interface Profile {
  id: string
  email: string
  nome: string
  data_cadastro: string
}

export interface AddictionType {
  id: string
  name: string
  icon: string
  color: string
  created_by_user?: string
  created_at: string
  updated_at: string
}

export interface SobrietyRecord {
  id: string
  user_id: string
  user_email: string
  addiction_type_id: string
  start_date: string
  current_streak_days: number
  best_streak_days: number
  total_relapses: number
  is_active: boolean
  daily_cost?: number
  personal_goal?: string
  motivation_reason?: string
  created_at: string
  updated_at: string
  addiction_types?: AddictionType
}

export interface MoodEntry {
  id: string
  user_id: string
  mood_value: number
  notes?: string
  entry_date: string
  created_at: string
  updated_at: string
}
