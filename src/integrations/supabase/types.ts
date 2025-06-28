export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      achievements: {
        Row: {
          badge_color: string | null
          category: string | null
          description: string | null
          icon: string | null
          id: string
          name: string
          requirement_type: string
          requirement_value: number
        }
        Insert: {
          badge_color?: string | null
          category?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          name: string
          requirement_type: string
          requirement_value: number
        }
        Update: {
          badge_color?: string | null
          category?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          name?: string
          requirement_type?: string
          requirement_value?: number
        }
        Relationships: []
      }
      addiction_types: {
        Row: {
          color: string | null
          created_at: string | null
          created_by_user: string | null
          icon: string | null
          id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          created_by_user?: string | null
          icon?: string | null
          id?: string
          name: string
          updated_at?: string | null
        }
        Update: {
          color?: string | null
          created_at?: string | null
          created_by_user?: string | null
          icon?: string | null
          id?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      common_triggers: {
        Row: {
          category: string | null
          icon: string | null
          id: string
          name: string
        }
        Insert: {
          category?: string | null
          icon?: string | null
          id?: string
          name: string
        }
        Update: {
          category?: string | null
          icon?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      coping_strategies: {
        Row: {
          category: string | null
          description: string | null
          icon: string | null
          id: string
          name: string
        }
        Insert: {
          category?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          name: string
        }
        Update: {
          category?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      daily_metrics: {
        Row: {
          created_at: string | null
          date: string | null
          energy_level: number | null
          exercise_minutes: number | null
          id: string
          meditation_minutes: number | null
          motivation_level: number | null
          sleep_hours: number | null
          stress_level: number | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          date?: string | null
          energy_level?: number | null
          exercise_minutes?: number | null
          id?: string
          meditation_minutes?: number | null
          motivation_level?: number | null
          sleep_hours?: number | null
          stress_level?: number | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          date?: string | null
          energy_level?: number | null
          exercise_minutes?: number | null
          id?: string
          meditation_minutes?: number | null
          motivation_level?: number | null
          sleep_hours?: number | null
          stress_level?: number | null
          user_id?: string
        }
        Relationships: []
      }
      emergency_contacts: {
        Row: {
          created_at: string | null
          email: string | null
          id: string
          is_primary: boolean | null
          name: string
          phone: string | null
          relationship: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          id?: string
          is_primary?: boolean | null
          name: string
          phone?: string | null
          relationship?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          email?: string | null
          id?: string
          is_primary?: boolean | null
          name?: string
          phone?: string | null
          relationship?: string | null
          user_id?: string
        }
        Relationships: []
      }
      group_members: {
        Row: {
          group_id: string | null
          id: string
          joined_at: string | null
          role: string | null
          user_id: string | null
        }
        Insert: {
          group_id?: string | null
          id?: string
          joined_at?: string | null
          role?: string | null
          user_id?: string | null
        }
        Update: {
          group_id?: string | null
          id?: string
          joined_at?: string | null
          role?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "group_members_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "support_groups"
            referencedColumns: ["id"]
          },
        ]
      }
      journal_entries: {
        Row: {
          content: string
          coping_strategies: string[] | null
          created_at: string | null
          entry_date: string | null
          gratitude_items: string[] | null
          id: string
          mood_after: number | null
          mood_before: number | null
          sobriety_record_id: string | null
          title: string | null
          triggers: string[] | null
          user_id: string
        }
        Insert: {
          content: string
          coping_strategies?: string[] | null
          created_at?: string | null
          entry_date?: string | null
          gratitude_items?: string[] | null
          id?: string
          mood_after?: number | null
          mood_before?: number | null
          sobriety_record_id?: string | null
          title?: string | null
          triggers?: string[] | null
          user_id: string
        }
        Update: {
          content?: string
          coping_strategies?: string[] | null
          created_at?: string | null
          entry_date?: string | null
          gratitude_items?: string[] | null
          id?: string
          mood_after?: number | null
          mood_before?: number | null
          sobriety_record_id?: string | null
          title?: string | null
          triggers?: string[] | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "journal_entries_sobriety_record_id_fkey"
            columns: ["sobriety_record_id"]
            isOneToOne: false
            referencedRelation: "sobriety_records"
            referencedColumns: ["id"]
          },
        ]
      }
      mood_history: {
        Row: {
          created_at: string | null
          entry_date: string
          id: string
          mood_value: number
          notes: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          entry_date?: string
          id?: string
          mood_value: number
          notes?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          entry_date?: string
          id?: string
          mood_value?: number
          notes?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          data_cadastro: string | null
          email: string | null
          id: string
          nome: string | null
        }
        Insert: {
          data_cadastro?: string | null
          email?: string | null
          id: string
          nome?: string | null
        }
        Update: {
          data_cadastro?: string | null
          email?: string | null
          id?: string
          nome?: string | null
        }
        Relationships: []
      }
      sobriety_records: {
        Row: {
          addiction_type_id: string | null
          best_streak_days: number | null
          created_at: string | null
          current_streak_days: number | null
          daily_cost: number | null
          id: string
          is_active: boolean | null
          motivation_reason: string | null
          personal_goal: string | null
          start_date: string
          total_relapses: number | null
          updated_at: string | null
          user_email: string | null
          user_id: string
        }
        Insert: {
          addiction_type_id?: string | null
          best_streak_days?: number | null
          created_at?: string | null
          current_streak_days?: number | null
          daily_cost?: number | null
          id?: string
          is_active?: boolean | null
          motivation_reason?: string | null
          personal_goal?: string | null
          start_date: string
          total_relapses?: number | null
          updated_at?: string | null
          user_email?: string | null
          user_id: string
        }
        Update: {
          addiction_type_id?: string | null
          best_streak_days?: number | null
          created_at?: string | null
          current_streak_days?: number | null
          daily_cost?: number | null
          id?: string
          is_active?: boolean | null
          motivation_reason?: string | null
          personal_goal?: string | null
          start_date?: string
          total_relapses?: number | null
          updated_at?: string | null
          user_email?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "sobriety_records_addiction_type_id_fkey"
            columns: ["addiction_type_id"]
            isOneToOne: false
            referencedRelation: "addiction_types"
            referencedColumns: ["id"]
          },
        ]
      }
      support_groups: {
        Row: {
          addiction_type_id: string | null
          created_at: string | null
          created_by: string | null
          description: string | null
          id: string
          is_private: boolean | null
          name: string
        }
        Insert: {
          addiction_type_id?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          is_private?: boolean | null
          name: string
        }
        Update: {
          addiction_type_id?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          is_private?: boolean | null
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "support_groups_addiction_type_id_fkey"
            columns: ["addiction_type_id"]
            isOneToOne: false
            referencedRelation: "addiction_types"
            referencedColumns: ["id"]
          },
        ]
      }
      support_resources: {
        Row: {
          availability: string | null
          contact_info: string | null
          country_code: string | null
          description: string | null
          id: string
          is_emergency: boolean | null
          title: string
          type: string
          url: string | null
        }
        Insert: {
          availability?: string | null
          contact_info?: string | null
          country_code?: string | null
          description?: string | null
          id?: string
          is_emergency?: boolean | null
          title: string
          type: string
          url?: string | null
        }
        Update: {
          availability?: string | null
          contact_info?: string | null
          country_code?: string | null
          description?: string | null
          id?: string
          is_emergency?: boolean | null
          title?: string
          type?: string
          url?: string | null
        }
        Relationships: []
      }
      user_achievements: {
        Row: {
          achievement_id: string | null
          earned_at: string | null
          id: string
          sobriety_record_id: string | null
          user_id: string
        }
        Insert: {
          achievement_id?: string | null
          earned_at?: string | null
          id?: string
          sobriety_record_id?: string | null
          user_id: string
        }
        Update: {
          achievement_id?: string | null
          earned_at?: string | null
          id?: string
          sobriety_record_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_achievements_achievement_id_fkey"
            columns: ["achievement_id"]
            isOneToOne: false
            referencedRelation: "achievements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_achievements_sobriety_record_id_fkey"
            columns: ["sobriety_record_id"]
            isOneToOne: false
            referencedRelation: "sobriety_records"
            referencedColumns: ["id"]
          },
        ]
      }
      user_reminders: {
        Row: {
          created_at: string | null
          days_of_week: number[] | null
          id: string
          is_active: boolean | null
          message: string | null
          reminder_time: string
          title: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          days_of_week?: number[] | null
          id?: string
          is_active?: boolean | null
          message?: string | null
          reminder_time: string
          title: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          days_of_week?: number[] | null
          id?: string
          is_active?: boolean | null
          message?: string | null
          reminder_time?: string
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      user_settings: {
        Row: {
          created_at: string | null
          id: string
          language: string | null
          notifications_enabled: boolean | null
          privacy_level: string | null
          reminder_frequency: string | null
          theme: string | null
          timezone: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          language?: string | null
          notifications_enabled?: boolean | null
          privacy_level?: string | null
          reminder_frequency?: string | null
          theme?: string | null
          timezone?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          language?: string | null
          notifications_enabled?: boolean | null
          privacy_level?: string | null
          reminder_frequency?: string | null
          theme?: string | null
          timezone?: string | null
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
