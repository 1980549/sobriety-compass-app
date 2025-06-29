
import React from 'react'
import { Book, Code, Database, Shield, Bot, Users, BarChart3, Cloud } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export function Documentation() {
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Book className="w-6 h-6 text-blue-600" />
        <h2 className="text-2xl font-bold text-gray-900">Documentação Completa</h2>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="features">Funcionalidades</TabsTrigger>
          <TabsTrigger value="technical">Técnico</TabsTrigger>
          <TabsTrigger value="api">API</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Sobre a Aplicação</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700">
                Esta é uma aplicação completa de apoio à recuperação de vícios, desenvolvida com tecnologias modernas 
                e focada na privacidade, segurança e bem-estar dos usuários em processo de recuperação.
              </p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <Bot className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                  <p className="text-sm font-medium">Chatbot IA</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <Shield className="w-8 h-8 mx-auto mb-2 text-green-600" />
                  <p className="text-sm font-medium">Segurança Avançada</p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <BarChart3 className="w-8 h-8 mx-auto mb-2 text-purple-600" />
                  <p className="text-sm font-medium">Analytics</p>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <Users className="w-8 h-8 mx-auto mb-2 text-orange-600" />
                  <p className="text-sm font-medium">Comunidade</p>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold">Tecnologias Utilizadas:</h4>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">React</Badge>
                  <Badge variant="outline">TypeScript</Badge>
                  <Badge variant="outline">Supabase</Badge>
                  <Badge variant="outline">Google Gemini AI</Badge>
                  <Badge variant="outline">Tailwind CSS</Badge>
                  <Badge variant="outline">shadcn/ui</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="features" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Bot className="w-5 h-5" />
                  <span>Chatbot Inteligente</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li>• Powered by Google Gemini AI</li>
                  <li>• Detecção automática de situações de crise</li>
                  <li>• Respostas contextuais baseadas no progresso</li>
                  <li>• Análise de sentimentos em tempo real</li>
                  <li>• Histórico completo de conversas</li>
                  <li>• Botões de ação rápida para emergências</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="w-5 h-5" />
                  <span>Sistema de Segurança</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li>• Monitoramento de atividades suspeitas</li>
                  <li>• Logs detalhados de segurança</li>
                  <li>• Gerenciamento de sessões ativas</li>
                  <li>• Proteção contra tentativas de invasão</li>
                  <li>• Alertas em tempo real</li>
                  <li>• Relatórios de segurança</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="w-5 h-5" />
                  <span>Analytics e Insights</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li>• Rastreamento de progresso de sobriedade</li>
                  <li>• Análise de padrões de humor</li>
                  <li>• Relatórios personalizados</li>
                  <li>• Insights preditivos</li>
                  <li>• Métricas de engagement</li>
                  <li>• Visualizações interativas</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Database className="w-5 h-5" />
                  <span>Backup e Sincronização</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li>• Backup automático diário</li>
                  <li>• Versionamento de dados</li>
                  <li>• Sincronização entre dispositivos</li>
                  <li>• Exportação/importação de dados</li>
                  <li>• Recuperação de dados</li>
                  <li>• Validação de integridade</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="technical" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Arquitetura do Sistema</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px]">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Frontend</h4>
                    <p className="text-sm text-gray-600 mb-2">
                      Aplicação React com TypeScript, utilizando componentes reutilizáveis e hooks customizados.
                    </p>
                    <div className="bg-gray-50 p-3 rounded text-sm">
                      <pre>{`src/
├── components/          # Componentes UI
│   ├── ui/             # Componentes base (shadcn/ui)
│   ├── ChatInterface.tsx
│   ├── SecurityDashboard.tsx
│   └── ...
├── hooks/              # Hooks customizados
│   ├── useChatbot.tsx
│   ├── useSecurity.tsx
│   └── ...
├── lib/                # Utilitários
│   └── supabase.ts     # Cliente Supabase
└── pages/              # Páginas da aplicação`}</pre>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Backend (Supabase)</h4>
                    <p className="text-sm text-gray-600 mb-2">
                      Edge Functions para processamento de lógica de negócio e integração com APIs externas.
                    </p>
                    <div className="bg-gray-50 p-3 rounded text-sm">
                      <pre>{`supabase/functions/
├── chatbot-ai/         # Integração Gemini AI
├── security-monitor/   # Monitoramento segurança
├── backup-manager/     # Gerenciamento backup
└── push-notifications/ # Notificações push`}</pre>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Banco de Dados</h4>
                    <p className="text-sm text-gray-600 mb-2">
                      PostgreSQL com Row Level Security (RLS) para máxima segurança dos dados.
                    </p>
                    <div className="bg-gray-50 p-3 rounded text-sm">
                      <pre>{`Principais tabelas:
- profiles               # Perfis de usuário
- sobriety_records      # Jornadas de sobriedade
- mood_history          # Histórico de humor
- chat_conversations    # Conversas do chatbot
- chat_messages         # Mensagens do chat
- security_logs         # Logs de segurança
- crisis_responses      # Respostas de crise
- user_backups         # Backups dos usuários`}</pre>
                    </div>
                  </div>
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="api" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Referência da API</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[500px]">
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold mb-3">Edge Functions</h4>
                    
                    <div className="space-y-4">
                      <div className="border rounded p-4">
                        <div className="flex items-center space-x-2 mb-2">
                          <Badge>POST</Badge>
                          <code className="text-sm">/functions/v1/chatbot-ai</code>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">
                          Processa mensagens do chatbot usando Google Gemini AI
                        </p>
                        <div className="bg-gray-50 p-2 rounded text-xs">
                          <pre>{`{
  "message": "Como estou me sentindo hoje?",
  "conversationId": "uuid",
  "userId": "uuid"
}`}</pre>
                        </div>
                      </div>

                      <div className="border rounded p-4">
                        <div className="flex items-center space-x-2 mb-2">
                          <Badge>POST</Badge>
                          <code className="text-sm">/functions/v1/security-monitor</code>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">
                          Registra eventos de segurança e detecta atividades suspeitas
                        </p>
                        <div className="bg-gray-50 p-2 rounded text-xs">
                          <pre>{`{
  "eventType": "login_attempt",
  "details": { "success": false },
  "userId": "uuid",
  "ipAddress": "192.168.1.1",
  "userAgent": "Mozilla/5.0..."
}`}</pre>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3">Principais Hooks</h4>
                    
                    <div className="space-y-3">
                      <div className="bg-gray-50 p-3 rounded">
                        <code className="text-sm font-medium">useChatbot()</code>
                        <p className="text-xs text-gray-600 mt-1">
                          Gerencia conversas do chatbot, envio de mensagens e detecção de crises
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 p-3 rounded">
                        <code className="text-sm font-medium">useSecurity()</code>
                        <p className="text-xs text-gray-600 mt-1">
                          Monitora atividades de segurança, sessões ativas e logs de eventos
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 p-3 rounded">
                        <code className="text-sm font-medium">useSobriety()</code>
                        <p className="text-xs text-gray-600 mt-1">
                          Gerencia jornadas de sobriedade, cálculo de streaks e estatísticas
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3">Configuração de Segredos</h4>
                    <p className="text-sm text-gray-600 mb-2">
                      Variáveis de ambiente necessárias no Supabase:
                    </p>
                    <div className="bg-gray-50 p-3 rounded text-sm">
                      <pre>{`GEMINI_API_KEY=sua_chave_google_gemini
SUPABASE_URL=sua_url_supabase
SUPABASE_ANON_KEY=sua_chave_anonima
SUPABASE_SERVICE_ROLE_KEY=sua_chave_service_role`}</pre>
                    </div>
                  </div>
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
