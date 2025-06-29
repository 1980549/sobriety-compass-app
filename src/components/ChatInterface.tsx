
import React, { useState, useRef, useEffect } from 'react'
import { Send, Bot, User, AlertTriangle, Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useChatbot, ChatMessage } from '@/hooks/useChatbot'
import { useEmergencyContacts } from '@/hooks/useEmergencyContacts'
import { EmergencyButton } from './EmergencyButton'

export function ChatInterface() {
  const { 
    messages, 
    conversations, 
    currentConversationId, 
    loading, 
    isTyping, 
    sendMessage, 
    createConversation,
    selectConversation 
  } = useChatbot()
  
  const [inputMessage, setInputMessage] = useState('')
  const [showSidebar, setShowSidebar] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { contacts } = useEmergencyContacts()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || loading) return

    if (!currentConversationId) {
      await createConversation()
    }

    await sendMessage(inputMessage.trim())
    setInputMessage('')
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getCrisisBadgeColor = (crisisLevel?: number) => {
    if (!crisisLevel) return null
    if (crisisLevel >= 8) return 'destructive'
    if (crisisLevel >= 5) return 'secondary'
    return 'default'
  }

  return (
    <div className="flex flex-col lg:flex-row h-[600px] max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Mobile conversation toggle */}
      <div className="lg:hidden flex items-center justify-between p-3 border-b bg-gray-50">
        <h3 className="font-semibold text-gray-800">Chat AI</h3>
        <div className="flex items-center space-x-2">
          <Button 
            size="sm" 
            onClick={createConversation}
            className="bg-blue-500 hover:bg-blue-600 text-xs"
          >
            + Nova
          </Button>
          <Button 
            variant="outline"
            size="sm" 
            onClick={() => setShowSidebar(!showSidebar)}
            className="text-xs"
          >
            Conversas
          </Button>
        </div>
      </div>

      {/* Sidebar com conversas - responsivo */}
      <div className={`${showSidebar ? 'block' : 'hidden'} lg:block w-full lg:w-1/4 border-r border-gray-200 p-3 lg:p-4 bg-gray-50 lg:bg-white`}>
        <div className="hidden lg:flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-800">Conversas</h3>
          <Button 
            size="sm" 
            onClick={createConversation}
            className="bg-blue-500 hover:bg-blue-600"
          >
            + Nova
          </Button>
        </div>
        
        <ScrollArea className="h-[200px] lg:h-[500px]">
          {conversations.map((conversation) => (
            <div
              key={conversation.id}
              onClick={() => {
                selectConversation(conversation.id)
                setShowSidebar(false) // Fechar sidebar no mobile após seleção
              }}
              className={`p-2 lg:p-3 rounded-lg cursor-pointer mb-2 transition-colors ${
                currentConversationId === conversation.id
                  ? 'bg-blue-100 border-blue-300'
                  : 'bg-gray-50 lg:bg-gray-50 hover:bg-gray-100'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Bot size={14} className="text-blue-500 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs lg:text-sm font-medium truncate">
                    Conversa {new Date(conversation.created_at).toLocaleDateString('pt-BR')}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatTime(conversation.created_at)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </ScrollArea>
      </div>

      {/* Área principal do chat */}
      <div className={`${showSidebar ? 'hidden' : 'flex'} lg:flex flex-1 flex-col`}>
        {/* Header - otimizado para mobile */}
        <CardHeader className="border-b border-gray-200 p-3 lg:p-6">
          <CardTitle className="flex items-center space-x-2 text-sm lg:text-base">
            <Bot className="w-5 h-5 lg:w-6 lg:h-6 text-blue-500" />
            <span>Assistente de Recuperação AI</span>
          </CardTitle>
        </CardHeader>

        {/* Mensagens - altura ajustada para mobile */}
        <CardContent className="flex-1 p-0">
          <ScrollArea className="h-[300px] lg:h-[400px] p-3 lg:p-4">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center px-4">
                <Bot className="w-10 h-10 lg:w-12 lg:h-12 text-blue-500 mb-3 lg:mb-4" />
                <h3 className="text-base lg:text-lg font-semibold text-gray-800 mb-2">
                  Olá! Como posso ajudar hoje?
                </h3>
                <p className="text-sm lg:text-base text-gray-600 mb-4 lg:mb-6">
                  Estou aqui para apoiar sua jornada de recuperação. Pode compartilhar como está se sentindo?
                </p>
                
                {/* Botões de ação rápida - responsivos */}
                <div className="flex flex-col sm:flex-row flex-wrap gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setInputMessage("Como posso lidar com vontade de usar?")}
                    className="text-xs lg:text-sm"
                  >
                    💪 Lidar com tentações
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setInputMessage("Estou me sentindo ansioso")}
                    className="text-xs lg:text-sm"
                  >
                    😰 Ansiedade
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setInputMessage("Preciso de motivação")}
                    className="text-xs lg:text-sm"
                  >
                    ⭐ Motivação
                  </Button>
                </div>
              </div>
            ) : (
              <>
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex mb-3 lg:mb-4 ${
                      message.role === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <div
                      className={`max-w-[85%] lg:max-w-[70%] rounded-lg p-2 lg:p-3 ${
                        message.role === 'user'
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      <div className="flex items-start space-x-1 lg:space-x-2">
                        {message.role === 'assistant' && (
                          <Bot size={14} className="text-blue-500 mt-1 flex-shrink-0" />
                        )}
                        {message.role === 'user' && (
                          <User size={14} className="text-white mt-1 flex-shrink-0" />
                        )}
                        <div className="flex-1">
                          <p className="text-xs lg:text-sm leading-relaxed">{message.content}</p>
                          <div className="flex items-center justify-between mt-1 lg:mt-2">
                            <span className={`text-xs ${
                              message.role === 'user' ? 'text-blue-100' : 'text-gray-500'
                            }`}>
                              {formatTime(message.created_at)}
                            </span>
                            {message.crisis_level && (
                              <Badge 
                                variant={getCrisisBadgeColor(message.crisis_level) as any}
                                className="ml-1 lg:ml-2 text-xs"
                              >
                                <AlertTriangle size={10} className="mr-1" />
                                Crise Nível {message.crisis_level}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                {isTyping && (
                  <div className="flex justify-start mb-3 lg:mb-4">
                    <div className="bg-gray-100 rounded-lg p-2 lg:p-3 max-w-[85%] lg:max-w-[70%]">
                      <div className="flex items-center space-x-1 lg:space-x-2">
                        <Bot size={14} className="text-blue-500" />
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </>
            )}
          </ScrollArea>

          {/* Área de entrada - otimizada para mobile */}
          <div className="border-t border-gray-200 p-3 lg:p-4">
            {/* Botões de emergência - responsivos */}
            <div className="flex flex-wrap gap-1 lg:gap-2 mb-2 lg:mb-3">
              <EmergencyButton />
              {contacts.length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setInputMessage("Preciso de ajuda urgente")}
                  className="text-red-600 border-red-200 hover:bg-red-50 text-xs lg:text-sm"
                >
                  <Heart size={12} className="mr-1" />
                  Ajuda
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setInputMessage("Vamos fazer um exercício de respiração?")}
                className="text-green-600 border-green-200 hover:bg-green-50 text-xs lg:text-sm"
              >
                🧘 Respirar
              </Button>
            </div>

            <div className="flex space-x-2">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Digite sua mensagem..."
                disabled={loading}
                className="flex-1 text-sm lg:text-base"
              />
              <Button
                onClick={handleSendMessage}
                disabled={loading || !inputMessage.trim()}
                className="bg-blue-500 hover:bg-blue-600 px-3 lg:px-4"
                size="sm"
              >
                <Send size={14} />
              </Button>
            </div>
          </div>
        </CardContent>
      </div>
    </div>
  )
}
