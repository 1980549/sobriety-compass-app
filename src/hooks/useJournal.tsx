
import { useState, useEffect } from 'react'
import { supabase, JournalEntry, CommonTrigger, CopingStrategy } from '@/lib/supabase'
import { useAuth } from './useAuth'
import { useToast } from '@/hooks/use-toast'

export function useJournal() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [entries, setEntries] = useState<JournalEntry[]>([])
  const [triggers, setTriggers] = useState<CommonTrigger[]>([])
  const [strategies, setStrategies] = useState<CopingStrategy[]>([])
  const [loading, setLoading] = useState(true)

  // Carregar entradas do diário
  const loadEntries = async () => {
    if (!user) return

    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('journal_entries')
        .select('*')
        .eq('user_id', user.id)
        .order('entry_date', { ascending: false })
        .limit(50)

      if (error) throw error
      setEntries(data || [])
    } catch (error) {
      console.error('Erro ao carregar entradas do diário:', error)
    } finally {
      setLoading(false)
    }
  }

  // Carregar gatilhos e estratégias
  const loadTriggersAndStrategies = async () => {
    try {
      const [triggersRes, strategiesRes] = await Promise.all([
        supabase.from('common_triggers').select('*').order('name'),
        supabase.from('coping_strategies').select('*').order('name')
      ])

      if (triggersRes.error) throw triggersRes.error
      if (strategiesRes.error) throw strategiesRes.error

      setTriggers(triggersRes.data || [])
      setStrategies(strategiesRes.data || [])
    } catch (error) {
      console.error('Erro ao carregar gatilhos e estratégias:', error)
    }
  }

  // Criar nova entrada
  const createEntry = async (entry: Partial<JournalEntry>) => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from('journal_entries')
        .insert([
          {
            user_id: user.id,
            ...entry,
          },
        ])
        .select()

      if (error) throw error

      toast({
        title: "Entrada criada!",
        description: "Sua reflexão foi salva no diário.",
      })

      await loadEntries()
      return data[0]
    } catch (error: any) {
      console.error('Erro ao criar entrada:', error)
      toast({
        title: "Erro",
        description: "Não foi possível salvar a entrada.",
        variant: "destructive",
      })
      throw error
    }
  }

  // Atualizar entrada
  const updateEntry = async (id: string, updates: Partial<JournalEntry>) => {
    try {
      const { error } = await supabase
        .from('journal_entries')
        .update(updates)
        .eq('id', id)
        .eq('user_id', user?.id)

      if (error) throw error

      toast({
        title: "Entrada atualizada!",
        description: "Suas alterações foram salvas.",
      })

      await loadEntries()
    } catch (error: any) {
      console.error('Erro ao atualizar entrada:', error)
      toast({
        title: "Erro",
        description: "Não foi possível atualizar a entrada.",
        variant: "destructive",
      })
    }
  }

  // Deletar entrada
  const deleteEntry = async (id: string) => {
    try {
      const { error } = await supabase
        .from('journal_entries')
        .delete()
        .eq('id', id)
        .eq('user_id', user?.id)

      if (error) throw error

      toast({
        title: "Entrada deletada",
        description: "A entrada foi removida do seu diário.",
      })

      await loadEntries()
    } catch (error: any) {
      console.error('Erro ao deletar entrada:', error)
      toast({
        title: "Erro",
        description: "Não foi possível deletar a entrada.",
        variant: "destructive",
      })
    }
  }

  useEffect(() => {
    loadTriggersAndStrategies()
  }, [])

  useEffect(() => {
    if (user) {
      loadEntries()
    }
  }, [user])

  return {
    entries,
    triggers,
    strategies,
    loading,
    createEntry,
    updateEntry,
    deleteEntry,
    refreshEntries: loadEntries,
  }
}
