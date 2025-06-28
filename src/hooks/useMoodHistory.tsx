
import { useState, useEffect } from 'react'
import { supabase, MoodEntry } from '@/lib/supabase'
import { useAuth } from './useAuth'
import { useToast } from '@/hooks/use-toast'

export function useMoodHistory() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [moodHistory, setMoodHistory] = useState<MoodEntry[]>([])
  const [todayMood, setTodayMood] = useState<MoodEntry | null>(null)
  const [loading, setLoading] = useState(true)

  // Carregar histórico de humor
  const loadMoodHistory = async () => {
    if (!user) return

    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('mood_history')
        .select('*')
        .eq('user_id', user.id)
        .order('entry_date', { ascending: false })
        .limit(30) // Últimos 30 dias

      if (error) throw error

      setMoodHistory(data || [])

      // Verificar se há entrada para hoje
      const today = new Date().toISOString().split('T')[0]
      const todayEntry = data?.find(entry => entry.entry_date === today)
      setTodayMood(todayEntry || null)
    } catch (error) {
      console.error('Erro ao carregar histórico de humor:', error)
    } finally {
      setLoading(false)
    }
  }

  // Registrar humor do dia
  const recordMood = async (moodValue: number, notes?: string) => {
    if (!user) return

    try {
      const today = new Date().toISOString().split('T')[0]
      
      const { data, error } = await supabase
        .from('mood_history')
        .upsert([
          {
            user_id: user.id,
            mood_value: moodValue,
            notes: notes || null,
            entry_date: today,
          },
        ])
        .select()

      if (error) throw error

      const moodLabels = ['😢', '😕', '😐', '😊', '😄']
      toast({
        title: "Humor registrado!",
        description: `Seu humor hoje: ${moodLabels[moodValue - 1]}`,
      })

      await loadMoodHistory()
      return data[0]
    } catch (error: any) {
      console.error('Erro ao registrar humor:', error)
      toast({
        title: "Erro",
        description: "Não foi possível registrar seu humor.",
        variant: "destructive",
      })
      throw error
    }
  }

  // Calcular estatísticas de humor
  const getMoodStats = () => {
    if (moodHistory.length === 0) return null

    const total = moodHistory.reduce((sum, entry) => sum + entry.mood_value, 0)
    const average = total / moodHistory.length
    
    const last7Days = moodHistory.slice(0, 7)
    const last7Average = last7Days.length > 0 
      ? last7Days.reduce((sum, entry) => sum + entry.mood_value, 0) / last7Days.length 
      : 0

    return {
      overall: Math.round(average * 10) / 10,
      last7Days: Math.round(last7Average * 10) / 10,
      totalEntries: moodHistory.length,
      streak: calculateMoodStreak(),
    }
  }

  // Calcular sequência de dias com humor registrado
  const calculateMoodStreak = () => {
    let streak = 0
    const today = new Date()
    
    for (let i = 0; i < 30; i++) {
      const checkDate = new Date(today)
      checkDate.setDate(today.getDate() - i)
      const dateStr = checkDate.toISOString().split('T')[0]
      
      const hasEntry = moodHistory.some(entry => entry.entry_date === dateStr)
      if (hasEntry) {
        streak++
      } else {
        break
      }
    }
    
    return streak
  }

  useEffect(() => {
    if (user) {
      loadMoodHistory()
    }
  }, [user])

  return {
    moodHistory,
    todayMood,
    loading,
    recordMood,
    getMoodStats,
    refreshHistory: loadMoodHistory,
  }
}
