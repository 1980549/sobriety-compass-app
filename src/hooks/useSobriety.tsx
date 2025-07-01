
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
    if (isGuest) {
      setSobrietyRecords(guestData.sobrietyRecords || [])
      setLoading(false)
    } else if (currentUser) {
      fetchSobrietyRecords()
    }
  }, [currentUser, isGuest, guestData.sobrietyRecords])

  const fetchSobrietyRecords = async () => {
    if (!currentUser || isGuest) return

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
        addiction_type: record.addiction_types?.name || 'Vício'
      }))
      
      setSobrietyRecords(transformedData)
    } catch (error: any) {
      console.error('Erro ao buscar registros de sobriedade:', error)
      toast({
        title: "Erro",
        description: "Não foi possível carregar os registros de sobriedade.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const startSobrietyJourney = async (addictionType: string) => {
    if (isGuest) {
      const newRecord: SobrietyRecord = {
        id: `guest_${Date.now()}`,
        user_id: 'guest',
        addiction_type: addictionType,
        start_date: new Date().toISOString(),
        current_streak: 0,
        longest_streak: 0,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        current_streak_days: 0,
        best_streak_days: 0
      }
      
      addToGuestData('sobrietyRecords', newRecord)
      setSobrietyRecords(prev => [newRecord, ...prev])
      
      toast({
        title: "Jornada iniciada!",
        description: `Sua jornada contra ${addictionType} começou. Você consegue!`,
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
            addiction_type: addictionType,
            start_date: new Date().toISOString().split('T')[0],
            current_streak_days: 0,
            best_streak_days: 0,
            is_active: true
          }
        ])
        .select()
        .single()

      if (error) throw error

      setSobrietyRecords(prev => [data, ...prev])
      toast({
        title: "Jornada iniciada!",
        description: `Sua jornada contra ${addictionType} começou. Você consegue!`,
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

  const startJourney = async (addictionTypeId: string, startDate: string, dailyCost?: number, personalGoal?: string, motivationReason?: string) => {
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
            is_active: true
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

  const updateStreak = async (recordId: string, streak: number) => {
    if (isGuest) {
      const updatedRecords = sobrietyRecords.map(record => 
        record.id === recordId 
          ? { 
              ...record, 
              current_streak: streak,
              current_streak_days: streak,
              longest_streak: Math.max(record.longest_streak, streak),
              best_streak_days: Math.max(record.best_streak_days || 0, streak),
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
      const record = sobrietyRecords.find(r => r.id === recordId)
      if (!record) return

      const { error } = await supabase
        .from('sobriety_records')
        .update({
          current_streak_days: streak,
          best_streak_days: Math.max(record.best_streak_days || 0, streak),
          updated_at: new Date().toISOString()
        })
        .eq('id', recordId)

      if (error) throw error

      setSobrietyRecords(prev => 
        prev.map(r => 
          r.id === recordId 
            ? { 
                ...r, 
                current_streak_days: streak,
                best_streak_days: Math.max(r.best_streak_days || 0, streak),
                updated_at: new Date().toISOString()
              }
            : r
        )
      )
    } catch (error: any) {
      console.error('Erro ao atualizar streak:', error)
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o streak.",
        variant: "destructive",
      })
    }
  }

  const resetStreak = async (recordId: string) => {
    if (isGuest) {
      const updatedRecords = sobrietyRecords.map(record => 
        record.id === recordId 
          ? { 
              ...record, 
              current_streak: 0,
              current_streak_days: 0,
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
          current_streak_days: 0,
          updated_at: new Date().toISOString()
        })
        .eq('id', recordId)

      if (error) throw error

      setSobrietyRecords(prev => 
        prev.map(r => 
          r.id === recordId 
            ? { ...r, current_streak_days: 0, updated_at: new Date().toISOString() }
            : r
        )
      )

      toast({
        title: "Streak resetado",
        description: "Não desista! Cada recomeço é uma nova oportunidade.",
      })
    } catch (error: any) {
      console.error('Erro ao resetar streak:', error)
      toast({
        title: "Erro",
        description: "Não foi possível resetar o streak.",
        variant: "destructive",
      })
    }
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

  return {
    // Manter compatibilidade com a interface antiga
    records: sobrietyRecords,
    sobrietyRecords,
    addictionTypes,
    loading,
    startSobrietyJourney,
    startJourney,
    createCustomAddiction,
    updateStreak,
    resetStreak,
    endJourney,
    refetch: fetchSobrietyRecords,
    refreshRecords: fetchSobrietyRecords
  }
}
