
import { useState, useEffect } from 'react'
import { supabase, UserReminder } from '@/lib/supabase'
import { useAuth } from './useAuth'
import { useToast } from '@/hooks/use-toast'

export function useReminders() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [reminders, setReminders] = useState<UserReminder[]>([])
  const [loading, setLoading] = useState(true)

  // Carregar lembretes
  const loadReminders = async () => {
    if (!user) return

    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('user_reminders')
        .select('*')
        .eq('user_id', user.id)
        .order('reminder_time')

      if (error) throw error
      setReminders(data || [])
    } catch (error) {
      console.error('Erro ao carregar lembretes:', error)
    } finally {
      setLoading(false)
    }
  }

  // Criar lembrete
  const createReminder = async (reminder: Omit<UserReminder, 'id' | 'user_id' | 'created_at'>) => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from('user_reminders')
        .insert([
          {
            user_id: user.id,
            ...reminder,
          },
        ])
        .select()

      if (error) throw error

      toast({
        title: "Lembrete criado!",
        description: "Seu lembrete foi configurado com sucesso.",
      })

      await loadReminders()
      return data[0]
    } catch (error: any) {
      console.error('Erro ao criar lembrete:', error)
      toast({
        title: "Erro",
        description: "Não foi possível criar o lembrete.",
        variant: "destructive",
      })
      throw error
    }
  }

  // Atualizar lembrete
  const updateReminder = async (id: string, updates: Partial<UserReminder>) => {
    try {
      const { error } = await supabase
        .from('user_reminders')
        .update(updates)
        .eq('id', id)
        .eq('user_id', user?.id)

      if (error) throw error

      toast({
        title: "Lembrete atualizado!",
        description: "As alterações foram salvas.",
      })

      await loadReminders()
    } catch (error: any) {
      console.error('Erro ao atualizar lembrete:', error)
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o lembrete.",
        variant: "destructive",
      })
    }
  }

  // Deletar lembrete
  const deleteReminder = async (id: string) => {
    try {
      const { error } = await supabase
        .from('user_reminders')
        .delete()
        .eq('id', id)
        .eq('user_id', user?.id)

      if (error) throw error

      toast({
        title: "Lembrete deletado",
        description: "O lembrete foi removido.",
      })

      await loadReminders()
    } catch (error: any) {
      console.error('Erro ao deletar lembrete:', error)
      toast({
        title: "Erro",
        description: "Não foi possível deletar o lembrete.",
        variant: "destructive",
      })
    }
  }

  useEffect(() => {
    if (user) {
      loadReminders()
    }
  }, [user])

  return {
    reminders,
    loading,
    createReminder,
    updateReminder,
    deleteReminder,
    refreshReminders: loadReminders,
  }
}
