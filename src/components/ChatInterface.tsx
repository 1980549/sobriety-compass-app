
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { useChatbot } from '@/hooks/useChatbot';
import { Send, Bot, User, MessageSquare, Plus } from 'lucide-react';

export function ChatInterface() {
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const {
    messages,
    conversations,
    currentConversationId,
    loading,
    isTyping,
    sendMessage,
    createConversation,
    selectConversation,
    refreshConversations
  } = useChatbot();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!inputMessage.trim() || loading) return;
    
    const message = inputMessage.trim();
    setInputMessage('');
    
    try {
      await sendMessage(message);
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleNewConversation = async () => {
    try {
      await createConversation();
    } catch (error) {
      console.error('Erro ao criar nova conversa:', error);
    }
  };

  const formatMessageContent = (content: string) => {
    return content.split('\n').map((line, index) => (
      <span key={index}>
        {line}
        {index < content.split('\n').length - 1 && <br />}
      </span>
    ));
  };

  const getEmotionColor = (emotion?: string) => {
    if (!emotion) return 'bg-gray-100 text-gray-700';
    
    const emotionColors: Record<string, string> = {
      'positive': 'bg-green-100 text-green-700',
      'negative': 'bg-red-100 text-red-700',
      'neutral': 'bg-blue-100 text-blue-700',
      'anxious': 'bg-yellow-100 text-yellow-700',
      'hopeful': 'bg-emerald-100 text-emerald-700',
      'frustrated': 'bg-orange-100 text-orange-700'
    };
    
    return emotionColors[emotion] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="flex flex-col h-full max-h-[80vh] bg-white rounded-lg shadow-sm">
      {/* Header responsivo */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-3 sm:p-4 border-b bg-gradient-to-r from-indigo-50 to-purple-50">
        <div className="flex items-center space-x-2 mb-2 sm:mb-0">
          <Bot className="w-5 h-5 text-indigo-600" />
          <h3 className="text-base sm:text-lg font-semibold text-gray-900">
            Assistente de Recuperação
          </h3>
        </div>
        
        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={handleNewConversation}
            disabled={loading}
            className="flex-1 sm:flex-none text-xs sm:text-sm"
          >
            <Plus className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
            Nova Conversa
          </Button>
          
          {conversations.length > 1 && (
            <select
              value={currentConversationId}
              onChange={(e) => selectConversation(e.target.value)}
              className="text-xs sm:text-sm border rounded px-2 py-1 bg-white flex-1 sm:flex-none"
              disabled={loading}
            >
              {conversations.map((conv, index) => (
                <option key={conv.id} value={conv.id}>
                  Conversa {index + 1}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* Messages Area - responsivo */}
      <ScrollArea className="flex-1 p-3 sm:p-4">
        <div className="space-y-3 sm:space-y-4">
          {messages.length === 0 ? (
            <div className="text-center py-6 sm:py-8">
              <Bot className="w-12 h-12 sm:w-16 sm:h-16 text-indigo-300 mx-auto mb-3 sm:mb-4" />
              <h4 className="text-base sm:text-lg font-medium text-gray-600 mb-2">
                Olá! Como posso te ajudar hoje?
              </h4>
              <p className="text-xs sm:text-sm text-gray-500 max-w-md mx-auto">
                Estou aqui para te apoiar em sua jornada de recuperação. 
                Você pode compartilhar seus sentimentos, dúvidas ou pedir conselhos.
              </p>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`flex items-start space-x-2 sm:space-x-3 max-w-[85%] sm:max-w-[80%] ${
                    message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                  }`}
                >
                  <div
                    className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      message.role === 'user'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {message.role === 'user' ? (
                      <User className="w-3 h-3 sm:w-4 sm:h-4" />
                    ) : (
                      <Bot className="w-3 h-3 sm:w-4 sm:h-4" />
                    )}
                  </div>

                  <Card className={`${
                    message.role === 'user'
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'bg-white border-gray-200'
                  }`}>
                    <CardContent className="p-2 sm:p-3">
                      <div className="text-xs sm:text-sm leading-relaxed">
                        {formatMessageContent(message.content)}
                      </div>
                      
                      {/* Emoção detectada */}
                      {message.emotion_detected && message.role === 'user' && (
                        <div className="mt-2">
                          <Badge 
                            variant="secondary" 
                            className={`text-xs ${getEmotionColor(message.emotion_detected)}`}
                          >
                            {message.emotion_detected}
                          </Badge>
                        </div>
                      )}
                      
                      {/* Nível de crise */}
                      {message.crisis_level && message.crisis_level > 3 && (
                        <div className="mt-2">
                          <Badge variant="destructive" className="text-xs">
                            Atenção necessária
                          </Badge>
                        </div>
                      )}

                      <div className="mt-1 sm:mt-2 text-xs opacity-70">
                        {new Date(message.created_at).toLocaleTimeString('pt-BR', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            ))
          )}

          {/* Indicador de digitação */}
          {isTyping && (
            <div className="flex justify-start">
              <div className="flex items-start space-x-2 sm:space-x-3">
                <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center">
                  <Bot className="w-3 h-3 sm:w-4 sm:h-4" />
                </div>
                <Card className="bg-white border-gray-200">
                  <CardContent className="p-2 sm:p-3">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Input Area - responsivo */}
      <div className="border-t bg-gray-50 p-3 sm:p-4">
        <div className="flex space-x-2">
          <Input
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Digite sua mensagem..."
            disabled={loading}
            className="flex-1 text-sm sm:text-base"
          />
          <Button
            onClick={handleSend}
            disabled={loading || !inputMessage.trim()}
            size="sm"
            className="px-3 sm:px-4"
          >
            <Send className="w-3 h-3 sm:w-4 sm:h-4" />
          </Button>
        </div>
        
        <div className="mt-2 text-xs text-gray-500 text-center">
          Pressione Enter para enviar • Shift+Enter para nova linha
        </div>
      </div>
    </div>
  );
}
