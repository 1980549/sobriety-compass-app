
import { useState, useEffect } from 'react'
import { supabase, SobrietyRecord, AddictionType } from '@/lib/supabase'
import { useAuth } from './useAuth'
import { useToast } from '@/hooks/use-toast'

export function useSobriety() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [records, setRecords] = useState<SobrietyRecord[]>([])
  const [addictionTypes, setAddictionTypes] = useState<AddictionType[]>([])
  const [loading, setLoading] = useState(true)

  // Carregar tipos de vícios
  const loadAddictionTypes = async () => {
    try {
      const { data, error } = await supabase
        .from('addiction_types')
        .select('*')
        .order('name')

      if (error) throw error
      setAddictionTypes(data || [])
    } catch (error) {
      console.error('Erro ao carregar tipos de vícios:', error)
    }
  }

  // Carregar registros de sobriedade
  const loadRecords = async () => {
    if (!user) return

    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('sobriety_records')
        .select(`
          *,
          addiction_types (*)
        `)
        .eq('user_id', user.id)
        .eq('is_active', true)
        .order('created_at', { ascending: false })

      if (error) throw error

      // Calcular dias atuais para cada registro
      const updatedRecords = (data || []).map(record => {
        const startDate = new Date(record.start_date)
        const today = new Date()
        const diffTime = today.getTime() - startDate.getTime()
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
        
        return {
          ...record,
          current_streak_days: diffDays >= 0 ? diffDays : 0
        }
      })

      setRecords(updatedRecords)
    } catch (error) {
      console.error('Erro ao carregar registros:', error)
      toast({
        title: "Erro",
        description: "Não foi possível carregar suas jornadas.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Iniciar nova jornada
  const startJourney = async (
    addictionTypeId: string,
    startDate: string,
    dailyCost?: number,
    personalGoal?: string,
    motivationReason?: string
  ) => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from('sobriety_records')
        .insert([
          {
            user_id: user.id,
            user_email: user.email,
            addiction_type_id: addictionTypeId,
            start_date: startDate,
            current_streak_days: 0,
            best_streak_days: 0,
            total_relapses: 0,
            is_active: true,
            daily_cost: dailyCost,
            personal_goal: personalGoal,
            motivation_reason: motivationReason,
          },
        ])
        .select()

      if (error) throw error

      toast({
        title: "Jornada iniciada!",
        description: "Sua nova jornada de sobriedade começou. Você consegue!",
      })

      await loadRecords()
      return data[0]
    } catch (error: any) {
      console.error('Erro ao iniciar jornada:', error)
      toast({
        title: "Erro",
        description: "Não foi possível iniciar a jornada.",
        variant: "destructive",
      })
      throw error
    }
  }

  // Finalizar jornada
  const endJourney = async (recordId: string) => {
    try {
      const { error } = await supabase
        .from('sobriety_records')
        .update({ is_active: false })
        .eq('id', recordId)

      if (error) throw error

      toast({
        title: "Jornada finalizada",
        description: "A jornada foi finalizada com sucesso.",
      })

      await loadRecords()
    } catch (error: any) {
      console.error('Erro ao finalizar jornada:', error)
      toast({
        title: "Erro",
        description: "Não foi possível finalizar a jornada.",
        variant: "destructive",
      })
    }
  }

  // Criar tipo de vício personalizado
  const createCustomAddiction = async (name: string, icon: string, color: string) => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from('addiction_types')
        .insert([
          {
            name,
            icon,
            color,
            created_by_user: user.id,
          },
        ])
        .select()

      if (error) throw error

      toast({
        title: "Tipo personalizado criado!",
        description: `"${name}" foi adicionado aos seus tipos de vícios.`,
      })

      await loadAddictionTypes()
      return data[0]
    } catch (error: any) {
      console.error('Erro ao criar tipo personalizado:', error)
      toast({
        title: "Erro",
        description: "Não foi possível criar o tipo personalizado.",
        variant: "destructive",
      })
      throw error
    }
  }

  useEffect(() => {
    loadAddictionTypes()
  }, [])

  useEffect(() => {
    if (user) {
      loadRecords()
    }
  }, [user])

  return {
    records,
    addictionTypes,
    loading,
    startJourney,
    endJourney,
    createCustomAddiction,
    refreshRecords: loadRecords,
  }
}
