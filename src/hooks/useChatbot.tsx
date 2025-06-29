
import { useState, useEffect } from 'react'
import { useAuth } from './useAuth'
import { useToast } from '@/hooks/use-toast'
import { ChatMessage, ChatConversation, ChatbotState } from './chatbot/types'
import { 
  loadConversations, 
  loadMessages, 
  createNewConversation, 
  sendMessageToAI 
} from './chatbot/api'
import { 
  createUserMessage, 
  validateMessage, 
  isCrisisDetected, 
  getCrisisAlertType 
} from './chatbot/utils'

// Re-exporta tipos para compatibilidade
export type { ChatMessage, ChatConversation }

/**
 * Hook principal para gerenciar o chatbot AI
 * Fornece funcionalidades de conversas, mensagens e comunicação com IA
 */
export function useChatbot() {
  const { user } = useAuth()
  const { toast } = useToast()
  
  // Estado centralizado do chatbot
  const [state, setState] = useState<ChatbotState>({
    messages: [],
    conversations: [],
    currentConversationId: null,
    loading: false,
    isTyping: false
  })

  /**
   * Atualiza o estado de forma segura
   */
  const updateState = (updates: Partial<ChatbotState>) => {
    setState(prev => ({ ...prev, ...updates }))
  }

  /**
   * Carrega todas as conversas do usuário
   */
  const refreshConversations = async () => {
    if (!user) {
      console.log('refreshConversations: usuário não autenticado')
      return
    }

    try {
      const conversations = await loadConversations(user.id)
      updateState({ conversations })
      
      // Se não há conversa atual e existem conversas, seleciona a primeira
      if (!state.currentConversationId && conversations.length > 0) {
        await selectConversation(conversations[0].id)
      }
    } catch (error) {
      console.error('Erro ao carregar conversas:', error)
      toast({
        title: "Erro",
        description: "Não foi possível carregar as conversas",
        variant: "destructive",
      })
    }
  }

  /**
   * Seleciona uma conversa e carrega suas mensagens
   */
  const selectConversation = async (conversationId: string) => {
    if (!user) {
      console.log('selectConversation: usuário não autenticado')
      return
    }

    try {
      updateState({ currentConversationId: conversationId })
      const messages = await loadMessages(conversationId)
      updateState({ messages })
    } catch (error) {
      console.error('Erro ao carregar mensagens:', error)
      toast({
        title: "Erro",
        description: "Não foi possível carregar as mensagens",
        variant: "destructive",
      })
    }
  }

  /**
   * Cria uma nova conversa
   */
  const createConversation = async () => {
    if (!user) {
      console.log('createConversation: usuário não autenticado')
      toast({
        title: "Erro",
        description: "Você precisa estar logado para criar conversas",
        variant: "destructive",
      })
      return null
    }

    try {
      const newConversationId = await createNewConversation(user.id)
      updateState({ 
        currentConversationId: newConversationId,
        messages: []
      })
      await refreshConversations()
      return newConversationId
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

  /**
   * Envia uma mensagem para o chatbot
   */
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
    
    if (!validateMessage(content)) {
      return
    }

    // Garante que existe uma conversa
    let conversationId = state.currentConversationId
    if (!conversationId) {
      conversationId = await createConversation()
      if (!conversationId) return
    }

    try {
      updateState({ isTyping: true, loading: true })

      // Adiciona mensagem do usuário imediatamente
      const userMessage = createUserMessage(content)
      updateState({ 
        messages: [...state.messages, userMessage]
      })

      // Envia para o chatbot AI
      const aiResponse = await sendMessageToAI(content, conversationId, user.id)

      // Recarrega mensagens para obter versões atualizadas do banco
      const updatedMessages = await loadMessages(conversationId)
      updateState({ messages: updatedMessages })

      // Verifica se crise foi detectada
      if (aiResponse.crisisDetected && aiResponse.crisisLevel) {
        toast({
          title: "Situação de crise detectada",
          description: "Lembre-se: você não está sozinho. Recursos de ajuda estão disponíveis.",
          variant: getCrisisAlertType(aiResponse.crisisLevel),
        })
      }

    } catch (error: any) {
      console.error('Erro ao enviar mensagem:', error)
      toast({
        title: "Erro",
        description: "Não foi possível enviar a mensagem. Tente novamente.",
        variant: "destructive",
      })
      
      // Remove mensagem do usuário se houve erro
      updateState({ 
        messages: state.messages.slice(0, -1)
      })
    } finally {
      updateState({ loading: false, isTyping: false })
    }
  }

  // Efeito para carregar dados quando usuário autentica
  useEffect(() => {
    if (user) {
      console.log('useChatbot: carregando dados para usuário autenticado')
      refreshConversations()
    } else {
      console.log('useChatbot: usuário não autenticado, limpando estado')
      setState({
        messages: [],
        conversations: [],
        currentConversationId: null,
        loading: false,
        isTyping: false
      })
    }
  }, [user])

  return {
    messages: state.messages,
    conversations: state.conversations,
    currentConversationId: state.currentConversationId,
    loading: state.loading,
    isTyping: state.isTyping,
    sendMessage,
    createConversation,
    selectConversation,
    refreshConversations,
  }
}
