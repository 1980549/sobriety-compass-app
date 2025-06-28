
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from './useAuth'
import { useToast } from '@/hooks/use-toast'

export interface SecurityLog {
  id: string
  event_type: string
  ip_address: string
  user_agent: string
  details: any
  risk_level: 'low' | 'medium' | 'high' | 'critical'
  created_at: string
}

export interface ActiveSession {
  id: string
  session_token: string
  ip_address: string
  user_agent: string
  last_activity: string
  created_at: string
}

export function useSecurity() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [securityLogs, setSecurityLogs] = useState<SecurityLog[]>([])
  const [activeSessions, setActiveSessions] = useState<ActiveSession[]>([])
  const [loading, setLoading] = useState(false)

  // Carregar logs de segurança
  const loadSecurityLogs = async () => {
    if (!user) return

    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('security_logs')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50)

      if (error) throw error
      setSecurityLogs(data || [])
    } catch (error) {
      console.error('Erro ao carregar logs de segurança:', error)
    } finally {
      setLoading(false)
    }
  }

  // Carregar sessões ativas
  const loadActiveSessions = async () => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from('active_sessions')
        .select('*')
        .eq('user_id', user.id)
        .order('last_activity', { ascending: false })

      if (error) throw error
      setActiveSessions(data || [])
    } catch (error) {
      console.error('Erro ao carregar sessões ativas:', error)
    }
  }

  // Registrar evento de segurança
  const logSecurityEvent = async (eventType: string, details: any) => {
    if (!user) return

    try {
      const userAgent = navigator.userAgent
      const ipAddress = '0.0.0.0' // Em produção, você obteria o IP real

      await supabase.functions.invoke('security-monitor', {
        body: {
          eventType,
          details,
          userId: user.id,
          ipAddress,
          userAgent
        }
      })

      // Recarregar logs após registrar evento
      await loadSecurityLogs()
    } catch (error) {
      console.error('Erro ao registrar evento de segurança:', error)
    }
  }

  // Revogar sessão
  const revokeSession = async (sessionId: string) => {
    try {
      const { error } = await supabase
        .from('active_sessions')
        .delete()
        .eq('id', sessionId)
        .eq('user_id', user?.id)

      if (error) throw error

      toast({
        title: "Sessão revogada",
        description: "A sessão foi encerrada com sucesso.",
      })

      await loadActiveSessions()
    } catch (error: any) {
      console.error('Erro ao revogar sessão:', error)
      toast({
        title: "Erro",
        description: "Não foi possível revogar a sessão.",
        variant: "destructive",
      })
    }
  }

  // Verificar atividade suspeita
  const checkSuspiciousActivity = () => {
    const recentLogs = securityLogs.filter(log => {
      const logDate = new Date(log.created_at)
      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000)
      return logDate > oneDayAgo
    })

    const highRiskEvents = recentLogs.filter(log => 
      log.risk_level === 'high' || log.risk_level === 'critical'
    )

    return {
      totalEvents: recentLogs.length,
      highRiskEvents: highRiskEvents.length,
      hasNewThreats: highRiskEvents.length > 0
    }
  }

  useEffect(() => {
    if (user) {
      loadSecurityLogs()
      loadActiveSessions()
    }
  }, [user])

  return {
    securityLogs,
    activeSessions,
    loading,
    logSecurityEvent,
    revokeSession,
    checkSuspiciousActivity,
    refreshLogs: loadSecurityLogs,
    refreshSessions: loadActiveSessions,
  }
}
