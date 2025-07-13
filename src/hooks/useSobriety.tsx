
import { useState, useEffect } from 'react'
import { useUnifiedAuth } from '@/hooks/useUnifiedAuth'
import { supabase } from '@/lib/supabase'
import { useToast } from '@/hooks/use-toast'
import { useGuestStorage } from '@/hooks/useGuestStorage'

export interface SobrietyRecord {
  id: string
  user_id: string
  addiction_type: string
  start_date: string
  current_streak: number
  longest_streak: number
  is_active: boolean
  created_at: string
  updated_at: string
  addiction_type_id?: string
  current_streak_days?: number
  best_streak_days?: number
  daily_cost?: number
  user_email?: string
  total_relapses?: number
  last_relapse_date?: string
  addiction_types?: {
    id: string
    name: string
    icon: string
    color: string
  }
}

export interface AddictionType {
  id: string
  name: string
  icon: string
  color: string
  created_by_user?: string
}

export function useSobriety() {
  const { currentUser, isGuest } = useUnifiedAuth()
  const { guestData, updateGuestData, addToGuestData } = useGuestStorage()
  const { toast } = useToast()
  const [sobrietyRecords, setSobrietyRecords] = useState<SobrietyRecord[]>([])
  const [addictionTypes, setAddictionTypes] = useState<AddictionType[]>([])
  const [loading, setLoading] = useState(true)

  // Função para calcular dias limpos automaticamente
  const calculateDaysClean = (startDate: string, lastRelapseDate?: string): number => {
    const now = new Date()
    const baseDate = lastRelapseDate ? new Date(lastRelapseDate) : new Date(startDate)
    const diffTime = Math.abs(now.getTime() - baseDate.getTime())
    return Math.floor(diffTime / (1000 * 60 * 60 * 24))
  }

  // Função para calcular total de economia
  const calculateTotalSavings = (daysClean: number, dailyCost: number): number => {
    return daysClean * (dailyCost || 0)
  }

  // Função para atualizar automaticamente os registros com cálculos em tempo real
  const updateRecordsWithCalculations = (records: SobrietyRecord[]): SobrietyRecord[] => {
    return records.map(record => {
      const daysClean = calculateDaysClean(record.start_date, record.last_relapse_date)
      return {
        ...record,
        current_streak_days: daysClean,
        current_streak: daysClean
      }
    })
  }

  // Carregar tipos de vício
  const fetchAddictionTypes = async () => {
    try {
      const { data, error } = await supabase
        .from('addiction_types')
        .select('*')
        .order('name')

      if (error) throw error
      setAddictionTypes(data || [])
    } catch (error: any) {
      console.error('Erro ao buscar tipos de vício:', error)
    }
  }

  useEffect(() => {
    fetchAddictionTypes()
  }, [])

  useEffect(() => {
    let mounted = true
    
    if (isGuest) {
      if (mounted) {
        setSobrietyRecords(guestData.sobrietyRecords || [])
        setLoading(false)
      }
    } else if (currentUser && !isGuest) {
      fetchSobrietyRecords()
    } else {
      if (mounted) {
        setSobrietyRecords([])
        setLoading(false)
      }
    }
    
    return () => {
      mounted = false
    }
  }, [currentUser?.id, isGuest])

  const fetchSobrietyRecords = async () => {
    if (!currentUser || isGuest) {
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('sobriety_records')
        .select(`
          *,
          addiction_types (
            id,
            name,
            icon,
            color
          )
        `)
        .eq('user_id', currentUser.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      
      // Transformar dados para compatibilidade
      const transformedData = (data || []).map(record => ({
        ...record,
        current_streak_days: record.current_streak_days || 0,
        best_streak_days: record.best_streak_days || 0,
        total_relapses: record.total_relapses || 0,
        user_email: record.user_email || '',
        addiction_type: record.addiction_types?.name || 'Vício',
        // Garantir consistência nos campos
        current_streak: record.current_streak_days || 0,
        longest_streak: record.best_streak_days || 0
      }))
      
      // Aplicar cálculos automáticos baseados na data
      const recordsWithCalculations = updateRecordsWithCalculations(transformedData)
      setSobrietyRecords(recordsWithCalculations)
    } catch (error: any) {
      console.error('Erro ao buscar registros de sobriedade:', error)
      toast({
        title: "Erro",
        description: "Não foi possível carregar os registros de sobriedade.",
        variant: "destructive",
      })
      setSobrietyRecords([])
    } finally {
      setLoading(false)
    }
  }

  // Verificar se já existe jornada para o tipo de vício
  const checkExistingJourney = (addictionTypeId: string): boolean => {
    return sobrietyRecords.some(record => 
      record.addiction_type_id === addictionTypeId && record.is_active
    )
  }

  const startJourney = async (addictionTypeId: string, startDate: string, dailyCost?: number, personalGoal?: string, motivationReason?: string) => {
    // Verificar duplicidade
    if (checkExistingJourney(addictionTypeId)) {
      const addictionType = addictionTypes.find(at => at.id === addictionTypeId)
      toast({
        title: "Jornada já existe",
        description: `Você já possui uma jornada ativa para ${addictionType?.name || 'este vício'}.`,
        variant: "destructive",
      })
      return
    }

    if (isGuest) {
      const addictionType = addictionTypes.find(at => at.id === addictionTypeId)
      const newRecord: SobrietyRecord = {
        id: `guest_${Date.now()}`,
        user_id: 'guest',
        addiction_type: addictionType?.name || 'Vício',
        start_date: startDate,
        current_streak: 0,
        longest_streak: 0,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        current_streak_days: 0,
        best_streak_days: 0,
        daily_cost: dailyCost,
        user_email: '',
        total_relapses: 0,
        addiction_types: addictionType
      }
      
      addToGuestData('sobrietyRecords', newRecord)
      setSobrietyRecords(prev => [newRecord, ...prev])
      
      toast({
        title: "Jornada iniciada!",
        description: `Sua jornada começou. Você consegue!`,
      })
      return
    }

    if (!currentUser) return

    try {
      const { data, error } = await supabase
        .from('sobriety_records')
        .insert([
          {
            user_id: currentUser.id,
            addiction_type_id: addictionTypeId,
            start_date: startDate,
            current_streak_days: 0,
            best_streak_days: 0,
            daily_cost: dailyCost,
            personal_goal: personalGoal,
            motivation_reason: motivationReason,
            is_active: true,
            total_relapses: 0
          }
        ])
        .select(`
          *,
          addiction_types (
            id,
            name,
            icon,
            color
          )
        `)
        .single()

      if (error) throw error

      setSobrietyRecords(prev => [data, ...prev])
      toast({
        title: "Jornada iniciada!",
        description: "Sua jornada começou. Você consegue!",
      })
    } catch (error: any) {
      console.error('Erro ao iniciar jornada:', error)
      toast({
        title: "Erro",
        description: "Não foi possível iniciar a jornada.",
        variant: "destructive",
      })
    }
  }

  const deleteJourney = async (recordId: string) => {
    if (isGuest) {
      const updatedRecords = sobrietyRecords.filter(record => record.id !== recordId)
      setSobrietyRecords(updatedRecords)
      updateGuestData('sobrietyRecords', updatedRecords)
      
      toast({
        title: "Jornada excluída",
        description: "A jornada foi removida com sucesso.",
      })
      return
    }

    if (!currentUser) return

    try {
      const { error } = await supabase
        .from('sobriety_records')
        .delete()
        .eq('id', recordId)

      if (error) throw error

      setSobrietyRecords(prev => prev.filter(r => r.id !== recordId))
      
      toast({
        title: "Jornada excluída",
        description: "A jornada foi removida com sucesso.",
      })
    } catch (error: any) {
      console.error('Erro ao excluir jornada:', error)
      toast({
        title: "Erro",
        description: "Não foi possível excluir a jornada.",
        variant: "destructive",
      })
    }
  }

  const createCustomAddiction = async (name: string, icon: string, color: string) => {
    if (isGuest) {
      const newType: AddictionType = {
        id: `guest_${Date.now()}`,
        name,
        icon,
        color
      }
      setAddictionTypes(prev => [...prev, newType])
      return newType
    }

    if (!currentUser) return null

    try {
      const { data, error } = await supabase
        .from('addiction_types')
        .insert([
          {
            name,
            icon,
            color,
            created_by_user: currentUser.id
          }
        ])
        .select()
        .single()

      if (error) throw error

      setAddictionTypes(prev => [...prev, data])
      return data
    } catch (error: any) {
      console.error('Erro ao criar vício customizado:', error)
      toast({
        title: "Erro",
        description: "Não foi possível criar o vício customizado.",
        variant: "destructive",
      })
      return null
    }
  }

  // Função para registrar recaída com data específica
  const registerRelapse = async (recordId: string, relapseDate?: string) => {
    const dateToRegister = relapseDate || new Date().toISOString().split('T')[0]
    if (isGuest) {
      const updatedRecords = sobrietyRecords.map(record => 
        record.id === recordId 
          ? { 
              ...record, 
              last_relapse_date: dateToRegister,
              total_relapses: (record.total_relapses || 0) + 1,
              updated_at: new Date().toISOString()
            }
          : record
      )
      // Aplicar cálculos automáticos
      const recordsWithCalculations = updateRecordsWithCalculations(updatedRecords)
      setSobrietyRecords(recordsWithCalculations)
      updateGuestData('sobrietyRecords', recordsWithCalculations)
      
      toast({
        title: "Recaída registrada",
        description: "Não desista! Cada recomeço é uma nova oportunidade.",
      })
      return
    }

    if (!currentUser) return

    try {
      const record = sobrietyRecords.find(r => r.id === recordId)
      if (!record) return

      // Atualizar registro principal com data da recaída
      const { error: updateError } = await supabase
        .from('sobriety_records')
        .update({
          last_relapse_date: dateToRegister,
          total_relapses: (record.total_relapses || 0) + 1,
          updated_at: new Date().toISOString()
        })
        .eq('id', recordId)

      if (updateError) throw updateError

      // Registrar progresso diário da recaída
      const { error: progressError } = await supabase
        .from('daily_progress')
        .upsert({
          sobriety_record_id: recordId,
          user_id: currentUser.id,
          date: dateToRegister,
          day_clean: false,
          daily_savings: 0,
          streak_day: 0,
          notes: 'Recaída registrada'
        })

      if (progressError) {
        console.warn('Erro ao registrar progresso da recaída:', progressError)
      }

      // Atualizar estado local e recalcular automaticamente
      const updatedRecords = sobrietyRecords.map(r => 
        r.id === recordId 
          ? { 
              ...r, 
              last_relapse_date: dateToRegister,
              total_relapses: (r.total_relapses || 0) + 1,
              updated_at: new Date().toISOString()
            }
          : r
      )
      
      const recordsWithCalculations = updateRecordsWithCalculations(updatedRecords)
      setSobrietyRecords(recordsWithCalculations)

      toast({
        title: "Recaída registrada",
        description: "Não desista! Cada recomeço é uma nova oportunidade.",
      })
    } catch (error: any) {
      console.error('Erro ao registrar recaída:', error)
      toast({
        title: "Erro",
        description: "Não foi possível registrar a recaída.",
        variant: "destructive",
      })
    }
  }

  // Função para atualizar data de início
  const updateStartDate = async (recordId: string, newStartDate: string) => {
    if (isGuest) {
      const updatedRecords = sobrietyRecords.map(record => 
        record.id === recordId 
          ? { 
              ...record, 
              start_date: newStartDate,
              updated_at: new Date().toISOString()
            }
          : record
      )
      // Aplicar cálculos automáticos
      const recordsWithCalculations = updateRecordsWithCalculations(updatedRecords)
      setSobrietyRecords(recordsWithCalculations)
      updateGuestData('sobrietyRecords', recordsWithCalculations)
      
      toast({
        title: "Data de início atualizada",
        description: "Os cálculos foram atualizados automaticamente.",
      })
      return
    }

    if (!currentUser) return

    try {
      const { error } = await supabase
        .from('sobriety_records')
        .update({
          start_date: newStartDate,
          updated_at: new Date().toISOString()
        })
        .eq('id', recordId)

      if (error) throw error

      // Atualizar estado local e recalcular
      const updatedRecords = sobrietyRecords.map(r => 
        r.id === recordId 
          ? { 
              ...r, 
              start_date: newStartDate,
              updated_at: new Date().toISOString()
            }
          : r
      )
      
      const recordsWithCalculations = updateRecordsWithCalculations(updatedRecords)
      setSobrietyRecords(recordsWithCalculations)

      toast({
        title: "Data de início atualizada",
        description: "Os cálculos foram atualizados automaticamente.",
      })
    } catch (error: any) {
      console.error('Erro ao atualizar data de início:', error)
      toast({
        title: "Erro",
        description: "Não foi possível atualizar a data de início.",
        variant: "destructive",
      })
    }
  }

  // Manter função de reset para compatibilidade (agora chama registerRelapse)
  const resetStreak = async (recordId: string) => {
    await registerRelapse(recordId)
  }

  // Função deprecada - manter para compatibilidade, mas não usar
  const updateStreak = async (recordId: string, streak: number) => {
    // Função deprecada - usar registerRelapse em vez disso
    console.warn('updateStreak é deprecado. Use registerRelapse para recaídas ou os cálculos automáticos.')
    return
  }

  const endJourney = async (recordId: string) => {
    if (isGuest) {
      const updatedRecords = sobrietyRecords.map(record => 
        record.id === recordId 
          ? { 
              ...record, 
              is_active: false,
              updated_at: new Date().toISOString()
            }
          : record
      )
      setSobrietyRecords(updatedRecords)
      updateGuestData('sobrietyRecords', updatedRecords)
      return
    }

    if (!currentUser) return

    try {
      const { error } = await supabase
        .from('sobriety_records')
        .update({
          is_active: false,
          updated_at: new Date().toISOString()
        })
        .eq('id', recordId)

      if (error) throw error

      setSobrietyRecords(prev => 
        prev.map(r => 
          r.id === recordId 
            ? { ...r, is_active: false, updated_at: new Date().toISOString() }
            : r
        )
      )

      toast({
        title: "Jornada finalizada",
        description: "Parabéns pelo seu progresso! Você pode iniciar uma nova jornada quando quiser.",
      })
    } catch (error: any) {
      console.error('Erro ao finalizar jornada:', error)
      toast({
        title: "Erro",
        description: "Não foi possível finalizar a jornada.",
        variant: "destructive",
      })
    }
  }

  // Efeito para atualizar automaticamente os cálculos a cada minuto
  useEffect(() => {
    const interval = setInterval(() => {
      if (sobrietyRecords.length > 0) {
        const updatedRecords = updateRecordsWithCalculations(sobrietyRecords)
        setSobrietyRecords(updatedRecords)
      }
    }, 60000) // Atualizar a cada minuto

    return () => clearInterval(interval)
  }, [sobrietyRecords])

  return {
    // Interface principal
    sobrietyRecords,
    addictionTypes,
    loading,
    
    // Funções principais
    startJourney,
    deleteJourney,
    createCustomAddiction,
    registerRelapse,
    updateStartDate,
    resetStreak,
    endJourney,
    checkExistingJourney,
    
    // Utilitárias
    calculateDaysClean,
    calculateTotalSavings,
    
    // Compatibilidade com interface antiga (deprecado)
    updateStreak,
    records: sobrietyRecords,
    startSobrietyJourney: startJourney,
    refetch: fetchSobrietyRecords,
    refreshRecords: fetchSobrietyRecords
  }
}
