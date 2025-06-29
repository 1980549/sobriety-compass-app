import React, { useState, useRef, useEffect } from 'react'
import { useChatbot } from '@/hooks/useChatbot'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Send, Bot, User, AlertCircle, Heart, MessageSquare, RefreshCw } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'

function MessageBubble({ message }: { message: any }) {
  const isUser = message.role === 'user'
  const isCrisis = message.message_type === 'crisis'
  const isEncouragement = message.message_type === 'encouragement'
  
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-3 sm:mb-4`}>
      <div className={`flex items-start space-x-2 max-w-[85%] sm:max-w-[80%] ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
        <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
          isUser 
            ? 'bg-indigo-500' 
            : isCrisis 
              ? 'bg-red-500' 
              : isEncouragement 
                ? 'bg-green-500' 
                : 'bg-gray-500'
        }`}>
          {isUser ? (
            <User className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
          ) : isCrisis ? (
            <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
          ) : (
            <Bot className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
          )}
        </div>
        
        <div className={`rounded-2xl px-3 py-2 sm:px-4 sm:py-3 ${
          isUser 
            ? 'bg-indigo-500 text-white' 
            : isCrisis 
              ? 'bg-red-50 border-2 border-red-200' 
              : isEncouragement 
                ? 'bg-green-50 border-2 border-green-200'
                : 'bg-gray-100'
        }`}>
          {isCrisis && (
            <div className="flex items-center space-x-1 mb-2">
              <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4 text-red-600" />
              <Badge variant="destructive" className="text-xs">
                Suporte de Crise
              </Badge>
            </div>
          )}
          
          {isEncouragement && (
            <div className="flex items-center space-x-1 mb-2">
              <Heart className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" />
              <Badge className="bg-green-100 text-green-800 text-xs">
                Encorajamento
              </Badge>
            </div>
          )}
          
          <p className={`text-xs sm:text-sm leading-relaxed ${
            isUser 
              ? 'text-white' 
              : isCrisis 
                ? 'text-red-800' 
                : isEncouragement 
                  ? 'text-green-800'
                  : 'text-gray-800'
          }`}>
            {message.content}
          </p>
          
          <p className={`text-xs mt-2 ${
            isUser 
              ? 'text-indigo-200' 
              : 'text-gray-500'
          }`}>
            {formatDistanceToNow(new Date(message.created_at), { 
              addSuffix: true, 
              locale: ptBR 
            })}
          </p>
        </div>
      </div>
    </div>
  )
}

export function ChatInterface() {
  const { 
    messages, 
    sendMessage, 
    loading, 
    conversations,
    startNewConversation,
    loadConversation 
  } = useChatbot()
  
  const [inputMessage, setInputMessage] = useState('')
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || loading) return

    try {
      await sendMessage(inputMessage.trim())
      setInputMessage('')
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error)
      toast({
        title: "Erro",
        description: "Não foi possível enviar a mensagem. Tente novamente.",
        variant: "destructive",
      })
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleNewConversation = async () => {
    try {
      await startNewConversation()
      setSelectedConversation(null)
      toast({
        title: "Nova conversa iniciada",
        description: "Você pode começar uma nova conversa agora.",
      })
    } catch (error) {
      console.error('Erro ao iniciar nova conversa:', error)
      toast({
        title: "Erro",
        description: "Não foi possível iniciar nova conversa.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="flex flex-col h-full max-h-[calc(100vh-12rem)] sm:max-h-[600px]">
      <Card className="flex-1 flex flex-col">
        <CardHeader className="flex-shrink-0 border-b p-3 sm:p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                <Bot className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-base sm:text-lg">Assistente de Recuperação</CardTitle>
                <p className="text-xs sm:text-sm text-gray-500">
                  Seu companheiro na jornada de sobriedade
                </p>
              </div>
            </div>
            
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleNewConversation}
                className="text-xs sm:text-sm"
              >
                <RefreshCw className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                Nova Conversa
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col p-0">
          {/* Área de mensagens */}
          <ScrollArea className="flex-1 p-3 sm:p-4">
            <div className="space-y-3 sm:space-y-4">
              {messages.length === 0 ? (
                <div className="text-center py-8 sm:py-12">
                  <Heart className="w-12 h-12 sm:w-16 sm:h-16 text-indigo-300 mx-auto mb-3 sm:mb-4" />
                  <h3 className="text-base sm:text-lg font-semibold text-gray-700 mb-2">
                    Olá! Como posso ajudar você hoje?
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-500 max-w-md mx-auto">
                    Estou aqui para apoiar sua jornada de sobriedade. Você pode compartilhar 
                    seus sentimentos, fazer perguntas ou apenas conversar.
                  </p>
                </div>
              ) : (
                messages.map((message) => (
                  <MessageBubble key={message.id} message={message} />
                ))
              )}
              
              {loading && (
                <div className="flex items-center space-x-2 text-gray-500 text-sm">
                  <Bot className="w-4 h-4 animate-pulse" />
                  <span>Digitando...</span>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {/* Input de mensagem */}
          <div className="border-t p-3 sm:p-4 bg-gray-50">
            <div className="flex space-x-2">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Digite sua mensagem..."
                disabled={loading}
                className="flex-1 min-h-[40px] sm:min-h-[44px] text-sm sm:text-base"
              />
              <Button 
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || loading}
                size="sm"
                className="h-[40px] w-[40px] sm:h-[44px] sm:w-[44px] p-0"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
            
            <p className="text-xs text-gray-500 mt-2 text-center">
              Em caso de emergência, procure ajuda médica imediatamente ou ligue 192
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
