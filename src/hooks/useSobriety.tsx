
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
}

export function useSobriety() {
  const { user, isGuest } = useUnifiedAuth()
  const { guestData, updateGuestData, addToGuestData } = useGuestStorage()
  const { toast } = useToast()
  const [sobrietyRecords, setSobrietyRecords] = useState<SobrietyRecord[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (isGuest) {
      // Carregar dados do guest
      setSobrietyRecords(guestData.sobrietyRecords || [])
      setLoading(false)
    } else if (user) {
      // Carregar dados do usuário autenticado
      fetchSobrietyRecords()
    }
  }, [user, isGuest, guestData.sobrietyRecords])

  const fetchSobrietyRecords = async () => {
    if (!user) return

    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('sobriety_records')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setSobrietyRecords(data || [])
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
      // Salvar localmente para guest
      const newRecord: SobrietyRecord = {
        id: `guest_${Date.now()}`,
        user_id: 'guest',
        addiction_type: addictionType,
        start_date: new Date().toISOString(),
        current_streak: 0,
        longest_streak: 0,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
      
      addToGuestData('sobrietyRecords', newRecord)
      setSobrietyRecords(prev => [newRecord, ...prev])
      
      toast({
        title: "Jornada iniciada!",
        description: `Sua jornada contra ${addictionType} começou. Você consegue!`,
      })
      return
    }

    if (!user) return

    try {
      const { data, error } = await supabase
        .from('sobriety_records')
        .insert([
          {
            user_id: user.id,
            addiction_type: addictionType,
            start_date: new Date().toISOString(),
            current_streak: 0,
            longest_streak: 0,
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

  const updateStreak = async (recordId: string, streak: number) => {
    if (isGuest) {
      // Atualizar localmente para guest
      const updatedRecords = sobrietyRecords.map(record => 
        record.id === recordId 
          ? { 
              ...record, 
              current_streak: streak,
              longest_streak: Math.max(record.longest_streak, streak),
              updated_at: new Date().toISOString()
            }
          : record
      )
      setSobrietyRecords(updatedRecords)
      updateGuestData('sobrietyRecords', updatedRecords)
      return
    }

    if (!user) return

    try {
      const record = sobrietyRecords.find(r => r.id === recordId)
      if (!record) return

      const { error } = await supabase
        .from('sobriety_records')
        .update({
          current_streak: streak,
          longest_streak: Math.max(record.longest_streak, streak),
          updated_at: new Date().toISOString()
        })
        .eq('id', recordId)

      if (error) throw error

      setSobrietyRecords(prev => 
        prev.map(r => 
          r.id === recordId 
            ? { 
                ...r, 
                current_streak: streak,
                longest_streak: Math.max(r.longest_streak, streak),
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
      // Resetar localmente para guest
      const updatedRecords = sobrietyRecords.map(record => 
        record.id === recordId 
          ? { 
              ...record, 
              current_streak: 0,
              updated_at: new Date().toISOString()
            }
          : record
      )
      setSobrietyRecords(updatedRecords)
      updateGuestData('sobrietyRecords', updatedRecords)
      return
    }

    if (!user) return

    try {
      const { error } = await supabase
        .from('sobriety_records')
        .update({
          current_streak: 0,
          updated_at: new Date().toISOString()
        })
        .eq('id', recordId)

      if (error) throw error

      setSobrietyRecords(prev => 
        prev.map(r => 
          r.id === recordId 
            ? { ...r, current_streak: 0, updated_at: new Date().toISOString() }
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
      // Finalizar jornada localmente para guest
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

    if (!user) return

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
    sobrietyRecords,
    loading,
    startSobrietyJourney,
    updateStreak,
    resetStreak,
    endJourney,
    refetch: fetchSobrietyRecords
  }
}
