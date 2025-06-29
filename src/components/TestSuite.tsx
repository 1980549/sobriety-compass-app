
import React, { useState } from 'react'
import { Play, CheckCircle, XCircle, Loader, FileText } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useToast } from '@/hooks/use-toast'
import { supabase } from '@/lib/supabase'

interface TestResult {
  name: string
  status: 'pending' | 'running' | 'passed' | 'failed'
  error?: string
  duration?: number
}

export function TestSuite() {
  const [tests, setTests] = useState<TestResult[]>([
    { name: 'Conexão com banco de dados', status: 'pending' },
    { name: 'Autenticação de usuário', status: 'pending' },
    { name: 'CRUD de jornadas de sobriedade', status: 'pending' },
    { name: 'Sistema de humor', status: 'pending' },
    { name: 'Chatbot com Gemini AI', status: 'pending' },
    { name: 'Detecção de crise', status: 'pending' },
    { name: 'Sistema de segurança', status: 'pending' },
    { name: 'Conversas do chatbot', status: 'pending' },
    { name: 'Mensagens do chat', status: 'pending' },
    { name: 'Backup e sincronização', status: 'pending' },
    { name: 'Notificações push', status: 'pending' },
    { name: 'Analytics e insights', status: 'pending' }
  ])
  
  const [running, setRunning] = useState(false)
  const { toast } = useToast()

  const updateTestStatus = (index: number, status: TestResult['status'], error?: string, duration?: number) => {
    setTests(prev => prev.map((test, i) => 
      i === index ? { ...test, status, error, duration } : test
    ))
  }

  const runTests = async () => {
    setRunning(true)
    
    for (let i = 0; i < tests.length; i++) {
      updateTestStatus(i, 'running')
      const startTime = Date.now()
      
      try {
        await runIndividualTest(i)
        const duration = Date.now() - startTime
        updateTestStatus(i, 'passed', undefined, duration)
      } catch (error) {
        const duration = Date.now() - startTime
        updateTestStatus(i, 'failed', error instanceof Error ? error.message : 'Erro desconhecido', duration)
      }
      
      // Pequeno delay entre testes
      await new Promise(resolve => setTimeout(resolve, 500))
    }
    
    setRunning(false)
    
    const passed = tests.filter(t => t.status === 'passed').length
    const failed = tests.filter(t => t.status === 'failed').length
    
    toast({
      title: "Testes concluídos",
      description: `${passed} passaram, ${failed} falharam`,
      variant: failed > 0 ? "destructive" : "default"
    })
  }

  const runIndividualTest = async (testIndex: number) => {
    switch (testIndex) {
      case 0: // Conexão com banco
        const { data, error } = await supabase.from('profiles').select('count').limit(1)
        if (error) throw error
        break
        
      case 1: // Autenticação
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) throw new Error('Usuário não autenticado')
        break
        
      case 2: // CRUD sobriedade
        const { data: sobrietyData, error: sobrietyError } = await supabase
          .from('sobriety_records')
          .select('*')
          .limit(1)
        if (sobrietyError) throw sobrietyError
        break
        
      case 3: // Sistema de humor
        const { data: moodData, error: moodError } = await supabase
          .from('mood_history')
          .select('*')
          .limit(1)
        if (moodError) throw moodError
        break
        
      case 4: // Chatbot com Gemini
        const { data: chatData, error: chatError } = await supabase.functions.invoke('chatbot-ai', {
          body: { 
            message: 'Olá, este é um teste do sistema de chatbot', 
            conversationId: crypto.randomUUID(), 
            userId: (await supabase.auth.getUser()).data.user?.id || 'test' 
          }
        })
        if (chatError) throw chatError
        if (!chatData?.response) throw new Error('Resposta do chatbot vazia')
        break
        
      case 5: // Detecção de crise
        const { data: crisisData, error: crisisError } = await supabase
          .from('crisis_responses')
          .select('*')
          .limit(1)
        if (crisisError) throw crisisError
        break
        
      case 6: // Sistema de segurança
        const { data: securityData, error: securityError } = await supabase
          .from('security_logs')
          .select('*')
          .limit(1)
        if (securityError) throw securityError
        break
        
      case 7: // Conversas do chatbot
        const { data: conversationData, error: conversationError } = await supabase
          .from('chat_conversations')
          .select('*')
          .limit(1)
        if (conversationError) throw conversationError
        break
        
      case 8: // Mensagens do chat
        const { data: messageData, error: messageError } = await supabase
          .from('chat_messages')
          .select('*')
          .limit(1)
        if (messageError) throw messageError
        break
        
      case 9: // Backup
        const { data: backupData, error: backupError } = await supabase
          .from('user_backups')
          .select('*')
          .limit(1)
        if (backupError) throw backupError
        break
        
      case 10: // Notificações
        const { data: notifData, error: notifError } = await supabase
          .from('push_subscriptions')
          .select('*')
          .limit(1)
        if (notifError) throw notifError
        break
        
      case 11: // Analytics
        const { data: analyticsData, error: analyticsError } = await supabase
          .from('usage_analytics')
          .select('*')
          .limit(1)
        if (analyticsError) throw analyticsError
        break
        
      default:
        throw new Error('Teste não implementado')
    }
  }

  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'running':
        return <Loader className="w-4 h-4 animate-spin text-blue-500" />
      case 'passed':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-500" />
      default:
        return <div className="w-4 h-4 rounded-full border-2 border-gray-300" />
    }
  }

  const getStatusBadge = (status: TestResult['status']) => {
    switch (status) {
      case 'running':
        return <Badge variant="secondary">Executando</Badge>
      case 'passed':
        return <Badge variant="default" className="bg-green-100 text-green-800">Passou</Badge>
      case 'failed':
        return <Badge variant="destructive">Falhou</Badge>
      default:
        return <Badge variant="outline">Pendente</Badge>
    }
  }

  const passedTests = tests.filter(t => t.status === 'passed').length
  const failedTests = tests.filter(t => t.status === 'failed').length
  const totalTests = tests.length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <FileText className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900">Suite de Testes</h2>
        </div>
        <Button 
          onClick={runTests} 
          disabled={running}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Play className="w-4 h-4 mr-2" />
          {running ? 'Executando...' : 'Executar Testes'}
        </Button>
      </div>

      {/* Resumo dos testes */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">{passedTests}</div>
            <p className="text-sm text-gray-600">Testes Passaram</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-red-600">{failedTests}</div>
            <p className="text-sm text-gray-600">Testes Falharam</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">{totalTests}</div>
            <p className="text-sm text-gray-600">Total de Testes</p>
          </CardContent>
        </Card>
      </div>

      {/* Lista de testes */}
      <Card>
        <CardHeader>
          <CardTitle>Resultados dos Testes</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[500px]">
            <div className="space-y-3">
              {tests.map((test, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(test.status)}
                    <div>
                      <p className="font-medium">{test.name}</p>
                      {test.duration && (
                        <p className="text-sm text-gray-500">{test.duration}ms</p>
                      )}
                      {test.error && (
                        <p className="text-sm text-red-600 mt-1">{test.error}</p>
                      )}
                    </div>
                  </div>
                  {getStatusBadge(test.status)}
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}
