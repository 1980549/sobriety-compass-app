
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

export interface ChatbotState {
  messages: ChatMessage[]
  conversations: ChatConversation[]
  currentConversationId: string | null
  loading: boolean
  isTyping: boolean
}
