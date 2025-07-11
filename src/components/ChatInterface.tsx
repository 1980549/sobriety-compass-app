
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Bot, User, AlertTriangle, Plus, Trash } from 'lucide-react';
import { useChatbot } from '@/hooks/useChatbot';
import { useAuth } from '@/hooks/useAuth';
import { ChatMessage } from '@/hooks/chatbot/types';

export const ChatInterface = () => {
  const { user } = useAuth();
  const {
    messages,
    conversations,
    currentConversationId,
    loading,
    sendMessage,
    clearConversation,
    deleteConversation,
    createConversation,
    selectConversation
  } = useChatbot();

  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const message = input.trim();
    setInput('');
    await sendMessage(message);
  };

  const handleClearConversation = () => {
    clearConversation();
  };

  const handleDeleteConversation = (conversationId: string) => {
    deleteConversation(conversationId);
  };

  const handleCreateNewConversation = () => {
    createConversation();
  };

  const getEmotionColor = (message: ChatMessage) => {
    if (message.message_type === 'crisis') {
      return 'text-red-600';
    }
    if (message.message_type === 'encouragement') {
      return 'text-green-600';
    }
    return 'text-gray-600';
  };

  const getEmotionIcon = (message: ChatMessage) => {
    if (message.message_type === 'crisis') {
      return <AlertTriangle className="w-4 h-4 text-red-500" />;
    }
    return null;
  };

  if (!user) {
    return (
      <Card className="p-6 text-center">
        <p className="text-gray-600">
          Faça login para acessar o assistente de IA
        </p>
      </Card>
    );
  }

  return (
    <div className="flex h-[600px] max-w-6xl mx-auto gap-4">
      {/* Sidebar de Conversas */}
      <Card className="w-80 flex flex-col">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Conversas</h3>
            <Button
              size="sm"
              onClick={handleCreateNewConversation}
              disabled={loading}
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          <ScrollArea className="h-[480px]">
            <div className="space-y-2">
              {conversations.map((conversation) => (
                <div
                  key={conversation.id}
                  className={`flex items-center justify-between p-2 rounded-lg cursor-pointer hover:bg-gray-100 ${
                    currentConversationId === conversation.conversation_id 
                      ? 'bg-indigo-100 border border-indigo-200' 
                      : ''
                  }`}
                  onClick={() => selectConversation(conversation.conversation_id)}
                >
                  <span className="text-sm truncate flex-1">
                    Conversa {conversation.conversation_id.slice(0, 8)}...
                  </span>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteConversation(conversation.conversation_id);
                    }}
                    className="h-6 w-6 p-0 hover:bg-red-100 hover:text-red-600"
                  >
                    <Trash className="w-3 h-3" />
                  </Button>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </Card>

      {/* Chat Principal */}
      <Card className="flex-1 flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <div className="flex items-center space-x-2">
            <Bot className="w-6 h-6 text-indigo-600" />
            <h3 className="text-lg font-semibold">Assistente de Recuperação</h3>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleClearConversation}
            disabled={messages.length === 0}
          >
            Limpar Chat
          </Button>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                <Bot className="w-12 h-12 mx-auto mb-4 text-indigo-300" />
                <p className="text-lg font-medium mb-2">
                  Olá! Sou seu assistente de recuperação
                </p>
                <p className="text-sm">
                  Estou aqui para te apoiar em sua jornada. Como posso te ajudar hoje?
                </p>
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`flex items-start space-x-2 max-w-[80%] ${
                      message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                    }`}
                  >
                    <div
                      className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                        message.role === 'user'
                          ? 'bg-indigo-600 text-white'
                          : 'bg-gray-200 text-gray-600'
                      }`}
                    >
                      {message.role === 'user' ? (
                        <User className="w-4 h-4" />
                      ) : (
                        <Bot className="w-4 h-4" />
                      )}
                    </div>
                    <div
                      className={`rounded-lg p-3 ${
                        message.role === 'user'
                          ? 'bg-indigo-600 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      <div className="flex items-center space-x-2 mb-1">
                        {getEmotionIcon(message)}
                        <p className="text-sm whitespace-pre-wrap">
                          {message.content}
                        </p>
                      </div>
                      <p className={`text-xs opacity-70 ${getEmotionColor(message)}`}>
                        {new Date(message.created_at).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
            {loading && (
              <div className="flex justify-start">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                    <Bot className="w-4 h-4 text-gray-600" />
                  </div>
                  <div className="bg-gray-100 rounded-lg p-3">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Input */}
        <div className="p-4 border-t">
          <form onSubmit={handleSubmit} className="flex space-x-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Digite sua mensagem..."
              disabled={loading}
              className="flex-1"
            />
            <Button type="submit" disabled={loading || !input.trim()}>
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </div>
      </Card>
    </div>
  );
};
