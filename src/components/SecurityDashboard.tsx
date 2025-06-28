
import React from 'react'
import { Shield, AlertTriangle, Activity, Lock, Eye, Smartphone } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useSecurity } from '@/hooks/useSecurity'

export function SecurityDashboard() {
  const { 
    securityLogs, 
    activeSessions, 
    loading, 
    revokeSession, 
    checkSuspiciousActivity 
  } = useSecurity()

  const suspiciousActivity = checkSuspiciousActivity()

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'critical': return 'destructive'
      case 'high': return 'secondary'
      case 'medium': return 'default'
      default: return 'outline'
    }
  }

  const getRiskLevelIcon = (level: string) => {
    switch (level) {
      case 'critical': return <AlertTriangle className="w-4 h-4 text-red-500" />
      case 'high': return <AlertTriangle className="w-4 h-4 text-orange-500" />
      case 'medium': return <Eye className="w-4 h-4 text-yellow-500" />
      default: return <Shield className="w-4 h-4 text-green-500" />
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR')
  }

  const getDeviceInfo = (userAgent: string) => {
    if (userAgent.includes('Mobile')) return { type: 'mobile', icon: <Smartphone className="w-4 h-4" /> }
    return { type: 'desktop', icon: <Activity className="w-4 h-4" /> }
  }

  return (
    <div className="space-y-6">
      {/* Resumo de Segurança */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Status de Segurança</CardTitle>
            <Shield className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">Seguro</div>
            <p className="text-xs text-muted-foreground">
              Todas as verificações passaram
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Eventos (24h)</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{suspiciousActivity.totalEvents}</div>
            <p className="text-xs text-muted-foreground">
              {suspiciousActivity.highRiskEvents} eventos de alto risco
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sessões Ativas</CardTitle>
            <Lock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeSessions.length}</div>
            <p className="text-xs text-muted-foreground">
              Dispositivos conectados
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Alertas de Segurança */}
      {suspiciousActivity.hasNewThreats && (
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-orange-800">
              <AlertTriangle className="w-5 h-5" />
              <span>Atividade Suspeita Detectada</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-orange-700">
              Foram detectados {suspiciousActivity.highRiskEvents} eventos de alto risco nas últimas 24 horas. 
              Revise os logs de segurança abaixo e considere alterar sua senha se necessário.
            </p>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sessões Ativas */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="w-5 h-5" />
              <span>Sessões Ativas</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-64">
              {activeSessions.length === 0 ? (
                <p className="text-gray-500 text-center py-4">Nenhuma sessão ativa</p>
              ) : (
                <div className="space-y-3">
                  {activeSessions.map((session) => {
                    const device = getDeviceInfo(session.user_agent)
                    return (
                      <div key={session.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          {device.icon}
                          <div>
                            <p className="text-sm font-medium">
                              {device.type === 'mobile' ? 'Dispositivo Móvel' : 'Desktop'}
                            </p>
                            <p className="text-xs text-gray-500">
                              IP: {session.ip_address}
                            </p>
                            <p className="text-xs text-gray-500">
                              Última atividade: {formatDate(session.last_activity)}
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => revokeSession(session.id)}
                          className="text-red-600 border-red-200 hover:bg-red-50"
                        >
                          Revogar
                        </Button>
                      </div>
                    )
                  })}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Logs de Segurança */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Eye className="w-5 h-5" />
              <span>Logs de Segurança</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-64">
              {securityLogs.length === 0 ? (
                <p className="text-gray-500 text-center py-4">Nenhum evento registrado</p>
              ) : (
                <div className="space-y-2">
                  {securityLogs.map((log) => (
                    <div key={log.id} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                      <div className="flex items-center space-x-3">
                        {getRiskLevelIcon(log.risk_level)}
                        <div>
                          <p className="text-sm font-medium">{log.event_type}</p>
                          <p className="text-xs text-gray-500">{formatDate(log.created_at)}</p>
                        </div>
                      </div>
                      <Badge variant={getRiskLevelColor(log.risk_level) as any}>
                        {log.risk_level}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
