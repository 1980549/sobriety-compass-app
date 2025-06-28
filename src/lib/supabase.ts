
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://zuedrwwniualphtpimpy.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp1ZWRyd3duaXVhbHBodHBpbXB5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTExMzg3NTgsImV4cCI6MjA2NjcxNDc1OH0.IXmWR5C9XdO5HUBMw2NRipEHTPy1_1T2kbVkk6BkOIg'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Tipos existentes
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

// Novos tipos para funcionalidades avançadas
export interface UserReminder {
  id: string
  user_id: string
  title: string
  message?: string
  reminder_time: string
  days_of_week: number[]
  is_active: boolean
  created_at: string
}

export interface JournalEntry {
  id: string
  user_id: string
  sobriety_record_id?: string
  title?: string
  content: string
  mood_before?: number
  mood_after?: number
  triggers?: string[]
  coping_strategies?: string[]
  gratitude_items?: string[]
  entry_date: string
  created_at: string
}

export interface CommonTrigger {
  id: string
  name: string
  category?: string
  icon: string
}

export interface CopingStrategy {
  id: string
  name: string
  category?: string
  icon: string
  description?: string
}

export interface Achievement {
  id: string
  name: string
  description?: string
  icon: string
  category?: string
  requirement_type: string
  requirement_value: number
  badge_color: string
}

export interface UserAchievement {
  id: string
  user_id: string
  achievement_id: string
  sobriety_record_id?: string
  earned_at: string
  achievements?: Achievement
}

export interface EmergencyContact {
  id: string
  user_id: string
  name: string
  phone?: string
  email?: string
  relationship?: string
  is_primary: boolean
  created_at: string
}

export interface SupportResource {
  id: string
  title: string
  description?: string
  type: string
  contact_info?: string
  url?: string
  availability?: string
  is_emergency: boolean
  country_code: string
}

export interface DailyMetrics {
  id: string
  user_id: string
  date: string
  stress_level?: number
  energy_level?: number
  motivation_level?: number
  sleep_hours?: number
  exercise_minutes?: number
  meditation_minutes?: number
  created_at: string
}

export interface UserSettings {
  id: string
  user_id: string
  theme: string
  language: string
  timezone: string
  notifications_enabled: boolean
  reminder_frequency: string
  privacy_level: string
  created_at: string
}
