
import React, { useEffect, useState } from 'react'
import { Shield, AlertTriangle, Eye, Monitor, Activity, Lock } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useSecurity } from '@/hooks/useSecurity'
import { useToast } from '@/hooks/use-toast'

export function SecurityDashboard() {
  const { 
    securityLogs, 
    activeSessions, 
    loading, 
    revokeSession, 
    checkSuspiciousActivity,
    refreshLogs,
    refreshSessions 
  } = useSecurity()
  
  const { toast } = useToast()
  const [suspiciousActivity, setSuspiciousActivity] = useState({
    totalEvents: 0,
    highRiskEvents: 0,
    hasNewThreats: false
  })

  useEffect(() => {
    const activity = checkSuspiciousActivity()
    setSuspiciousActivity(activity)
  }, [securityLogs])

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR')
  }

  const getRiskBadgeColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'critical': return 'destructive'
      case 'high': return 'destructive'
      case 'medium': return 'secondary'
      default: return 'default'
    }
  }

  const handleRevokeSession = async (sessionId: string) => {
    await revokeSession(sessionId)
    toast({
      title: "Sessão revogada",
      description: "A sessão foi encerrada com sucesso.",
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Shield className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900">Painel de Segurança</h2>
        </div>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            onClick={refreshLogs}
            disabled={loading}
          >
            <Activity className="w-4 h-4 mr-2" />
            Atualizar Logs
          </Button>
          <Button 
            variant="outline" 
            onClick={refreshSessions}
            disabled={loading}
          >
            <Monitor className="w-4 h-4 mr-2" />
            Atualizar Sessões
          </Button>
        </div>
      </div>

      {/* Cards de resumo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Eventos Recentes</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{suspiciousActivity.totalEvents}</div>
            <p className="text-xs text-muted-foreground">Últimas 24 horas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ameaças Detectadas</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {suspiciousActivity.highRiskEvents}
            </div>
            <p className="text-xs text-muted-foreground">Alto risco</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sessões Ativas</CardTitle>
            <Monitor className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeSessions.length}</div>
            <p className="text-xs text-muted-foreground">Dispositivos conectados</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Logs de Segurança */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Eye className="w-5 h-5" />
              <span>Logs de Segurança</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px]">
              {securityLogs.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  <Shield className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>Nenhum evento de segurança registrado</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {securityLogs.map((log) => (
                    <div key={log.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <Badge variant={getRiskBadgeColor(log.risk_level) as any}>
                            {log.risk_level.toUpperCase()}
                          </Badge>
                          <span className="font-medium">{log.event_type}</span>
                        </div>
                        <span className="text-sm text-gray-500">
                          {formatTime(log.created_at)}
                        </span>
                      </div>
                      {log.ip_address && (
                        <p className="text-sm text-gray-600">
                          IP: {log.ip_address}
                        </p>
                      )}
                      {log.details && (
                        <div className="mt-2 p-2 bg-gray-50 rounded text-sm">
                          <pre className="whitespace-pre-wrap">
                            {JSON.stringify(log.details, null, 2)}
                          </pre>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Sessões Ativas */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Monitor className="w-5 h-5" />
              <span>Sessões Ativas</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px]">
              {activeSessions.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  <Monitor className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>Nenhuma sessão ativa encontrada</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {activeSessions.map((session) => (
                    <div key={session.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <Lock className="w-4 h-4 text-green-600" />
                          <span className="font-medium">Sessão Ativa</span>
                        </div>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleRevokeSession(session.id)}
                        >
                          Revogar
                        </Button>
                      </div>
                      {session.ip_address && (
                        <p className="text-sm text-gray-600">
                          IP: {session.ip_address}
                        </p>
                      )}
                      <p className="text-sm text-gray-600">
                        Última atividade: {formatTime(session.last_activity)}
                      </p>
                      <p className="text-sm text-gray-600">
                        Criada em: {formatTime(session.created_at)}
                      </p>
                      {session.user_agent && (
                        <p className="text-xs text-gray-500 mt-1 truncate">
                          {session.user_agent}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      {/* Alertas de Segurança */}
      {suspiciousActivity.hasNewThreats && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-red-800">
              <AlertTriangle className="w-5 h-5" />
              <span>Alerta de Segurança</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-700">
              Foram detectadas {suspiciousActivity.highRiskEvents} ameaças de alto risco nas últimas 24 horas. 
              Recomendamos revisar os logs de segurança e considerar alterar sua senha.
            </p>
            <div className="mt-4 flex space-x-2">
              <Button variant="destructive" size="sm">
                Alterar Senha
              </Button>
              <Button variant="outline" size="sm" onClick={refreshLogs}>
                Revisar Logs
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
