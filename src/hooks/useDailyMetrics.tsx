
import { useState, useEffect } from 'react'
import { supabase, DailyMetrics } from '@/lib/supabase'
import { useAuth } from './useAuth'
import { useToast } from '@/hooks/use-toast'

export function useDailyMetrics() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [metrics, setMetrics] = useState<DailyMetrics[]>([])
  const [todayMetrics, setTodayMetrics] = useState<DailyMetrics | null>(null)
  const [loading, setLoading] = useState(true)

  // Carregar métricas
  const loadMetrics = async () => {
    if (!user) return

    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('daily_metrics')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false })
        .limit(30)

      if (error) throw error

      setMetrics(data || [])

      // Verificar se há métricas para hoje
      const today = new Date().toISOString().split('T')[0]
      const todayEntry = data?.find(entry => entry.date === today)
      setTodayMetrics(todayEntry || null)
    } catch (error) {
      console.error('Erro ao carregar métricas:', error)
    } finally {
      setLoading(false)
    }
  }

  // Registrar métricas do dia
  const recordMetrics = async (metricsData: Partial<DailyMetrics>) => {
    if (!user) return

    try {
      const today = new Date().toISOString().split('T')[0]
      
      const { data, error } = await supabase
        .from('daily_metrics')
        .upsert([
          {
            user_id: user.id,
            date: today,
            ...metricsData,
          },
        ])
        .select()

      if (error) throw error

      toast({
        title: "Métricas registradas!",
        description: "Seus dados do dia foram salvos.",
      })

      await loadMetrics()
      return data[0]
    } catch (error: any) {
      console.error('Erro ao registrar métricas:', error)
      toast({
        title: "Erro",
        description: "Não foi possível salvar as métricas.",
        variant: "destructive",
      })
      throw error
    }
  }

  // Calcular estatísticas
  const getMetricsStats = () => {
    if (metrics.length === 0) return null

    const recent = metrics.slice(0, 7) // Últimos 7 dias

    const avgStress = recent.reduce((sum, m) => sum + (m.stress_level || 0), 0) / recent.length
    const avgEnergy = recent.reduce((sum, m) => sum + (m.energy_level || 0), 0) / recent.length
    const avgMotivation = recent.reduce((sum, m) => sum + (m.motivation_level || 0), 0) / recent.length
    const avgSleep = recent.reduce((sum, m) => sum + (m.sleep_hours || 0), 0) / recent.length
    const totalExercise = recent.reduce((sum, m) => sum + (m.exercise_minutes || 0), 0)
    const totalMeditation = recent.reduce((sum, m) => sum + (m.meditation_minutes || 0), 0)

    return {
      stress: Math.round(avgStress * 10) / 10,
      energy: Math.round(avgEnergy * 10) / 10,
      motivation: Math.round(avgMotivation * 10) / 10,
      sleep: Math.round(avgSleep * 10) / 10,
      exercise: totalExercise,
      meditation: totalMeditation,
    }
  }

  useEffect(() => {
    if (user) {
      loadMetrics()
    }
  }, [user])

  return {
    metrics,
    todayMetrics,
    loading,
    recordMetrics,
    getMetricsStats,
    refreshMetrics: loadMetrics,
  }
}
