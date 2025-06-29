
import React, { useState } from 'react'
import { FileText, Code, Database, Shield, MessageSquare, Brain, Users, Download, Bell, BarChart3, ChevronRight, ChevronDown } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'

interface DocSection {
  id: string
  title: string
  icon: React.ComponentType<any>
  content: React.ReactNode
  subsections?: Array<{
    id: string
    title: string
    content: React.ReactNode
  }>
}

export function Documentation() {
  const [activeSection, setActiveSection] = useState('overview')
  const [openSections, setOpenSections] = useState<string[]>(['overview'])

  const toggleSection = (sectionId: string) => {
    setOpenSections(prev => 
      prev.includes(sectionId) 
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    )
  }

  const docSections: DocSection[] = [
    {
      id: 'overview',
      title: 'Visão Geral',
      icon: FileText,
      content: (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Aplicação de Recuperação de Vícios</h3>
          <p className="text-gray-700">
            Uma aplicação completa para apoiar pessoas em processo de recuperação de vícios, 
            oferecendo ferramentas de monitoramento, suporte emocional e comunidade.
          </p>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="border rounded-lg p-4">
              <h4 className="font-semibold mb-2">Principais Recursos</h4>
              <ul className="text-sm space-y-1 text-gray-600">
                <li>• Rastreamento de jornadas de sobriedade</li>
                <li>• Chatbot IA com Google Gemini</li>
                <li>• Sistema de detecção de crise</li>
                <li>• Monitoramento de humor</li>
                <li>• Comunidade de apoio</li>
              </ul>
            </div>
            <div className="border rounded-lg p-4">
              <h4 className="font-semibold mb-2">Tecnologias</h4>
              <ul className="text-sm space-y-1 text-gray-600">
                <li>• React + TypeScript</li>
                <li>• Supabase (Backend)</li>
                <li>• Tailwind CSS</li>
                <li>• Google Gemini AI</li>
                <li>• PWA Ready</li>
              </ul>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'chatbot',
      title: 'Sistema de Chatbot IA',
      icon: MessageSquare,
      content: (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Chatbot Inteligente com Google Gemini</h3>
          <p className="text-gray-700">
            O chatbot utiliza a API do Google Gemini para fornecer suporte personalizado 
            baseado no contexto da jornada de recuperação do usuário.
          </p>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-800 mb-2">Funcionalidades Principais</h4>
            <ul className="text-sm space-y-1 text-blue-700">
              <li>• <strong>Contexto Personalizado:</strong> Conhece o progresso de sobriedade do usuário</li>
              <li>• <strong>Detecção de Crise:</strong> Identifica automaticamente situações de risco</li>
              <li>• <strong>Respostas Empáticas:</strong> Fornece apoio emocional adequado</li>
              <li>• <strong>Histórico de Conversas:</strong> Mantém contexto ao longo do tempo</li>
            </ul>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h4 className="font-semibold text-red-800 mb-2">Sistema de Detecção de Crise</h4>
            <p className="text-sm text-red-700 mb-2">
              O sistema monitora palavras-chave que indicam situações de crise:
            </p>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <strong>Crise Nível Alto (8-10):</strong>
                <ul className="mt-1 space-y-1 text-red-600">
                  <li>• Menções de suicídio</li>
                  <li>• Recaídas graves</li>
                  <li>• Auto-lesão</li>
                </ul>
              </div>
              <div>
                <strong>Crise Nível Médio (5-7):</strong>
                <ul className="mt-1 space-y-1 text-orange-600">
                  <li>• Solidão extrema</li>
                  <li>• Tentações fortes</li>
                  <li>• Ansiedade severa</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'security',
      title: 'Sistema de Segurança',
      icon: Shield,
      content: (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Segurança Avançada</h3>
          <p className="text-gray-700">
            Sistema multicamadas de segurança para proteger dados sensíveis dos usuários.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Autenticação</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-sm space-y-1">
                  <li>• Autenticação via Supabase Auth</li>
                  <li>• Verificação por email</li>
                  <li>• Senhas criptografadas</li>
                  <li>• Sessões seguras</li>
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Monitoramento</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-sm space-y-1">
                  <li>• Logs de segurança</li>
                  <li>• Detecção de atividade suspeita</li>
                  <li>• Bloqueio automático</li>
                  <li>• Alertas em tempo real</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <div className="bg-gray-50 border rounded-lg p-4">
            <h4 className="font-semibold mb-2">Estrutura RLS (Row Level Security)</h4>
            <p className="text-sm text-gray-600 mb-2">
              Todas as tabelas utilizam RLS para garantir que usuários só acessem seus próprios dados:
            </p>
            <code className="text-xs bg-gray-100 p-2 rounded block">
              CREATE POLICY "Users can manage own data" ON table_name<br/>
              FOR ALL USING (auth.uid() = user_id);
            </code>
          </div>
        </div>
      )
    },
    {
      id: 'database',
      title: 'Estrutura do Banco de Dados',
      icon: Database,
      content: (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Arquitetura do Banco</h3>
          <p className="text-gray-700">
            Estrutura completa das tabelas e relacionamentos no Supabase PostgreSQL.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Tabelas Principais</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-sm space-y-2">
                  <li>• <strong>profiles</strong> - Perfis de usuários</li>
                  <li>• <strong>addiction_types</strong> - Tipos de vícios</li>
                  <li>• <strong>sobriety_records</strong> - Jornadas de sobriedade</li>
                  <li>• <strong>mood_history</strong> - Histórico de humor</li>
                  <li>• <strong>journal_entries</strong> - Diário pessoal</li>
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Tabelas do Chatbot</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-sm space-y-2">
                  <li>• <strong>chat_conversations</strong> - Conversas</li>
                  <li>• <strong>chat_messages</strong> - Mensagens</li>
                  <li>• <strong>crisis_responses</strong> - Respostas de crise</li>
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Tabelas de Segurança</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-sm space-y-2">
                  <li>• <strong>security_logs</strong> - Logs de segurança</li>
                  <li>• <strong>active_sessions</strong> - Sessões ativas</li>
                  <li>• <strong>failed_login_attempts</strong> - Tentativas de login</li>
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Tabelas Avançadas</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-sm space-y-2">
                  <li>• <strong>user_backups</strong> - Backups de dados</li>
                  <li>• <strong>push_subscriptions</strong> - Notificações</li>
                  <li>• <strong>usage_analytics</strong> - Analytics</li>
                  <li>• <strong>user_insights</strong> - Insights IA</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      )
    },
    {
      id: 'api',
      title: 'Edge Functions',
      icon: Code,
      content: (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Funções Serverless</h3>
          <p className="text-gray-700">
            Edge Functions do Supabase para processamento backend.
          </p>
          
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <MessageSquare className="w-5 h-5 mr-2" />
                  chatbot-ai
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-2">
                  Processa mensagens do chatbot usando Google Gemini AI
                </p>
                <div className="bg-gray-50 p-3 rounded text-xs">
                  <strong>Endpoint:</strong> /functions/v1/chatbot-ai<br/>
                  <strong>Método:</strong> POST<br/>
                  <strong>Payload:</strong> {`{ message, conversationId, userId }`}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Shield className="w-5 h-5 mr-2" />
                  security-monitor
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-2">
                  Monitora eventos de segurança e detecta atividades suspeitas
                </p>
                <div className="bg-gray-50 p-3 rounded text-xs">
                  <strong>Endpoint:</strong> /functions/v1/security-monitor<br/>
                  <strong>Método:</strong> POST<br/>
                  <strong>Payload:</strong> {`{ eventType, details }`}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )
    },
    {
      id: 'components',
      title: 'Componentes React',
      icon: Code,
      content: (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Arquitetura de Componentes</h3>
          <p className="text-gray-700">
            Estrutura modular de componentes React com TypeScript.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Componentes Principais</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-sm space-y-1">
                  <li>• <strong>MultiSobrietyDashboard</strong> - Dashboard principal</li>
                  <li>• <strong>ChatInterface</strong> - Interface do chatbot</li>
                  <li>• <strong>SecurityDashboard</strong> - Painel de segurança</li>
                  <li>• <strong>MoodTracker</strong> - Rastreador de humor</li>
                  <li>• <strong>SobrietyCard</strong> - Cartão de jornada</li>
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Hooks Customizados</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-sm space-y-1">
                  <li>• <strong>useAuth</strong> - Gerenciamento de autenticação</li>
                  <li>• <strong>useChatbot</strong> - Estado do chatbot</li>
                  <li>• <strong>useSecurity</strong> - Funcionalidades de segurança</li>
                  <li>• <strong>useSobriety</strong> - Jornadas de sobriedade</li>
                  <li>• <strong>useMoodHistory</strong> - Histórico de humor</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      )
    },
    {
      id: 'deployment',
      title: 'Deploy e Configuração',
      icon: Download,
      content: (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Guia de Deploy</h3>
          <p className="text-gray-700">
            Instruções para configurar e fazer deploy da aplicação.
          </p>
          
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Variáveis de Ambiente</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-50 p-3 rounded text-sm font-mono">
                  <div>SUPABASE_URL=sua_url_supabase</div>
                  <div>SUPABASE_ANON_KEY=sua_chave_publica</div>
                  <div>GEMINI_API_KEY=sua_chave_gemini</div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Configuração do Supabase</CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="text-sm space-y-2 list-decimal list-inside">
                  <li>Criar projeto no Supabase</li>
                  <li>Executar migrações SQL</li>
                  <li>Configurar RLS policies</li>
                  <li>Deploy das Edge Functions</li>
                  <li>Configurar secrets (GEMINI_API_KEY)</li>
                </ol>
              </CardContent>
            </Card>
          </div>
        </div>
      )
    }
  ]

  return (
    <div className="flex h-[600px] max-w-6xl mx-auto bg-white rounded-lg shadow-lg">
      {/* Sidebar de navegação */}
      <div className="w-1/4 border-r border-gray-200 p-4">
        <div className="flex items-center space-x-2 mb-6">
          <FileText className="w-6 h-6 text-blue-600" />
          <h2 className="text-xl font-bold text-gray-900">Documentação</h2>
        </div>
        
        <nav className="space-y-2">
          {docSections.map((section) => (
            <Collapsible
              key={section.id}
              open={openSections.includes(section.id)}
              onOpenChange={() => toggleSection(section.id)}
            >
              <CollapsibleTrigger asChild>
                <Button
                  variant={activeSection === section.id ? "default" : "ghost"}
                  className="w-full justify-start text-left"
                  onClick={() => setActiveSection(section.id)}
                >
                  <section.icon className="w-4 h-4 mr-2" />
                  <span className="flex-1">{section.title}</span>
                  {openSections.includes(section.id) ? 
                    <ChevronDown className="w-4 h-4" /> : 
                    <ChevronRight className="w-4 h-4" />
                  }
                </Button>
              </CollapsibleTrigger>
              
              {section.subsections && (
                <CollapsibleContent className="ml-6 mt-2 space-y-1">
                  {section.subsections.map((subsection) => (
                    <Button
                      key={subsection.id}
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start text-left text-xs"
                      onClick={() => setActiveSection(subsection.id)}
                    >
                      {subsection.title}
                    </Button>
                  ))}
                </CollapsibleContent>
              )}
            </Collapsible>
          ))}
        </nav>
      </div>

      {/* Conteúdo principal */}
      <div className="flex-1 p-6">
        <ScrollArea className="h-full">
          {docSections.find(section => section.id === activeSection)?.content || (
            <div className="text-center text-gray-500 py-8">
              <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>Selecione uma seção para ver o conteúdo</p>
            </div>
          )}
        </ScrollArea>
      </div>
    </div>
  )
}
