
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from './useAuth'
import { useToast } from '@/hooks/use-toast'

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  message_type: 'text' | 'crisis' | 'encouragement' | 'question'
  crisis_level?: number
  created_at: string
}

export interface ChatConversation {
  id: string
  conversation_id: string
  created_at: string
}

export function useChatbot() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [conversations, setConversations] = useState<ChatConversation[]>([])
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [isTyping, setIsTyping] = useState(false)

  // Carregar conversas
  const loadConversations = async () => {
    if (!user) {
      console.log('loadConversations: usuário não autenticado')
      return
    }

    try {
      const { data, error } = await supabase
        .from('chat_conversations')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setConversations(data || [])
      
      // Se não há conversa atual e existem conversas, seleciona a primeira
      if (!currentConversationId && data && data.length > 0) {
        setCurrentConversationId(data[0].id)
        await loadMessages(data[0].id)
      }
    } catch (error) {
      console.error('Erro ao carregar conversas:', error)
    }
  }

  // Carregar mensagens de uma conversa
  const loadMessages = async (conversationId: string) => {
    if (!user) {
      console.log('loadMessages: usuário não autenticado')
      return
    }

    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true })

      if (error) throw error
      setMessages(data || [])
    } catch (error) {
      console.error('Erro ao carregar mensagens:', error)
    }
  }

  // Criar nova conversa
  const createConversation = async () => {
    if (!user) {
      console.log('createConversation: usuário não autenticado')
      return null
    }

    try {
      const conversationUuid = crypto.randomUUID()
      const { data, error } = await supabase
        .from('chat_conversations')
        .insert({
          user_id: user.id,
          conversation_id: conversationUuid
        })
        .select()
        .single()

      if (error) throw error
      
      setCurrentConversationId(data.id)
      setMessages([])
      await loadConversations()
      
      return data.id
    } catch (error) {
      console.error('Erro ao criar conversa:', error)
      toast({
        title: "Erro",
        description: "Não foi possível criar uma nova conversa",
        variant: "destructive",
      })
      return null
    }
  }

  // Enviar mensagem
  const sendMessage = async (content: string) => {
    if (!user) {
      console.log('sendMessage: usuário não autenticado')
      toast({
        title: "Erro",
        description: "Você precisa estar logado para enviar mensagens",
        variant: "destructive",
      })
      return
    }
    
    if (!currentConversationId) {
      // Se não há conversa atual, criar uma nova
      const newConversationId = await createConversation()
      if (!newConversationId) return
    }

    const finalConversationId = currentConversationId || await createConversation()
    if (!finalConversationId) return

    try {
      setIsTyping(true)
      setLoading(true)

      // Adicionar mensagem do usuário à interface imediatamente
      const userMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'user',
        content,
        message_type: 'text',
        created_at: new Date().toISOString()
      }
      setMessages(prev => [...prev, userMessage])

      console.log('Sending message to chatbot:', { content, finalConversationId, userId: user.id })

      // Chamar Edge Function do chatbot
      const { data: aiResponse, error } = await supabase.functions.invoke('chatbot-ai', {
        body: {
          message: content,
          conversationId: finalConversationId,
          userId: user.id
        }
      })

      if (error) {
        console.error('Chatbot function error:', error)
        throw error
      }

      console.log('Chatbot response:', aiResponse)

      // Recarregar mensagens para obter as versões salvas no banco
      await loadMessages(finalConversationId)

      // Se crise detectada, mostrar alerta
      if (aiResponse.crisisDetected) {
        toast({
          title: "Situação de crise detectada",
          description: "Lembre-se: você não está sozinho. Recursos de ajuda estão disponíveis.",
          variant: aiResponse.crisisLevel >= 8 ? "destructive" : "default",
        })
      }

    } catch (error: any) {
      console.error('Erro ao enviar mensagem:', error)
      toast({
        title: "Erro",
        description: "Não foi possível enviar a mensagem. Tente novamente.",
        variant: "destructive",
      })
      
      // Remover mensagem do usuário da interface se houve erro
      setMessages(prev => prev.slice(0, -1))
    } finally {
      setLoading(false)
      setIsTyping(false)
    }
  }

  // Selecionar conversa
  const selectConversation = async (conversationId: string) => {
    setCurrentConversationId(conversationId)
    await loadMessages(conversationId)
  }

  useEffect(() => {
    if (user) {
      console.log('useChatbot: carregando conversas para usuário autenticado')
      loadConversations()
    } else {
      console.log('useChatbot: usuário não autenticado, limpando estado')
      setMessages([])
      setConversations([])
      setCurrentConversationId(null)
    }
  }, [user])

  return {
    messages,
    conversations,
    currentConversationId,
    loading,
    isTyping,
    sendMessage,
    createConversation,
    selectConversation,
    refreshConversations: loadConversations,
  }
}
