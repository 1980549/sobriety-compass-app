
import { supabase } from '@/lib/supabase'
import { ChatMessage, ChatConversation } from './types'

/**
 * Carrega todas as conversas do usuário atual
 */
export const loadConversations = async (userId: string): Promise<ChatConversation[]> => {
  console.log('loadConversations: carregando conversas para usuário:', userId)
  
  const { data, error } = await supabase
    .from('chat_conversations')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Erro ao carregar conversas:', error)
    throw error
  }

  return data || []
}

/**
 * Carrega mensagens de uma conversa específica
 */
export const loadMessages = async (conversationId: string): Promise<ChatMessage[]> => {
  console.log('loadMessages: carregando mensagens para conversa:', conversationId)

  const { data, error } = await supabase
    .from('chat_messages')
    .select('*')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true })

  if (error) {
    console.error('Erro ao carregar mensagens:', error)
    throw error
  }

  return data || []
}

/**
 * Cria uma nova conversa para o usuário
 */
export const createNewConversation = async (userId: string): Promise<string> => {
  console.log('createNewConversation: criando conversa para usuário:', userId)

  const conversationUuid = crypto.randomUUID()
  const { data, error } = await supabase
    .from('chat_conversations')
    .insert({
      user_id: userId,
      conversation_id: conversationUuid
    })
    .select()
    .single()

  if (error) {
    console.error('Erro ao criar conversa:', error)
    throw error
  }

  return data.id
}

/**
 * Envia mensagem para o chatbot AI
 */
export const sendMessageToAI = async (content: string, conversationId: string, userId: string) => {
  console.log('sendMessageToAI: enviando mensagem:', { content, conversationId, userId })

  const { data, error } = await supabase.functions.invoke('chatbot-ai', {
    body: {
      message: content,
      conversationId,
      userId
    }
  })

  if (error) {
    console.error('Erro na função chatbot:', error)
    throw error
  }

  console.log('Resposta do chatbot:', data)
  return data
}
