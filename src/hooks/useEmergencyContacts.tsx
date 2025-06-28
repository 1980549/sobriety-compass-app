
import { useState, useEffect } from 'react'
import { supabase, EmergencyContact, SupportResource } from '@/lib/supabase'
import { useAuth } from './useAuth'
import { useToast } from '@/hooks/use-toast'

export function useEmergencyContacts() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [contacts, setContacts] = useState<EmergencyContact[]>([])
  const [resources, setResources] = useState<SupportResource[]>([])
  const [loading, setLoading] = useState(true)

  // Carregar contatos de emergência
  const loadContacts = async () => {
    if (!user) return

    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('emergency_contacts')
        .select('*')
        .eq('user_id', user.id)
        .order('is_primary', { ascending: false })

      if (error) throw error
      setContacts(data || [])
    } catch (error) {
      console.error('Erro ao carregar contatos:', error)
    } finally {
      setLoading(false)
    }
  }

  // Carregar recursos de apoio
  const loadResources = async () => {
    try {
      const { data, error } = await supabase
        .from('support_resources')
        .select('*')
        .eq('country_code', 'BR')
        .order('is_emergency', { ascending: false })

      if (error) throw error
      setResources(data || [])
    } catch (error) {
      console.error('Erro ao carregar recursos:', error)
    }
  }

  // Criar contato
  const createContact = async (contact: Omit<EmergencyContact, 'id' | 'user_id' | 'created_at'>) => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from('emergency_contacts')
        .insert([
          {
            user_id: user.id,
            ...contact,
          },
        ])
        .select()

      if (error) throw error

      toast({
        title: "Contato adicionado!",
        description: "Contato de emergência foi salvo.",
      })

      await loadContacts()
      return data[0]
    } catch (error: any) {
      console.error('Erro ao criar contato:', error)
      toast({
        title: "Erro",
        description: "Não foi possível adicionar o contato.",
        variant: "destructive",
      })
      throw error
    }
  }

  // Atualizar contato
  const updateContact = async (id: string, updates: Partial<EmergencyContact>) => {
    try {
      const { error } = await supabase
        .from('emergency_contacts')
        .update(updates)
        .eq('id', id)
        .eq('user_id', user?.id)

      if (error) throw error

      toast({
        title: "Contato atualizado!",
        description: "As alterações foram salvas.",
      })

      await loadContacts()
    } catch (error: any) {
      console.error('Erro ao atualizar contato:', error)
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o contato.",
        variant: "destructive",
      })
    }
  }

  // Deletar contato
  const deleteContact = async (id: string) => {
    try {
      const { error } = await supabase
        .from('emergency_contacts')
        .delete()
        .eq('id', id)
        .eq('user_id', user?.id)

      if (error) throw error

      toast({
        title: "Contato removido",
        description: "O contato foi deletado.",
      })

      await loadContacts()
    } catch (error: any) {
      console.error('Erro ao deletar contato:', error)
      toast({
        title: "Erro",
        description: "Não foi possível deletar o contato.",
        variant: "destructive",
      })
    }
  }

  useEffect(() => {
    loadResources()
  }, [])

  useEffect(() => {
    if (user) {
      loadContacts()
    }
  }, [user])

  return {
    contacts,
    resources,
    loading,
    createContact,
    updateContact,
    deleteContact,
    refreshContacts: loadContacts,
  }
}
