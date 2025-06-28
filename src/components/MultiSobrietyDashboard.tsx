
import { useState, useEffect } from 'react'
import { useSobriety } from '@/hooks/useSobriety'
import { useMoodHistory } from '@/hooks/useMoodHistory'
import { useAuth } from '@/hooks/useAuth'
import { SobrietyCard } from './SobrietyCard'
import { StartJourneyModal } from './StartJourneyModal'
import { MoodTracker } from './MoodTracker'
import { SavingsTracker } from './SavingsTracker'
import { EmergencyButton } from './EmergencyButton'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Plus, LogOut, Calendar, TrendingUp, Target } from 'lucide-react'

export function MultiSobrietyDashboard() {
  const { user, signOut } = useAuth()
  const { records, loading } = useSobriety()
  const { getMoodStats } = useMoodHistory()
  const [showStartModal, setShowStartModal] = useState(false)

  // Atualizar contadores a cada minuto
  useEffect(() => {
    const interval = setInterval(() => {
      // Força re-render dos componentes para atualizar contadores
      window.dispatchEvent(new Event('sobriety-update'))
    }, 60000) // 1 minuto

    return () => clearInterval(interval)
  }, [])

  const moodStats = getMoodStats()
  const totalDays = records.reduce((sum, record) => sum + record.current_streak_days, 0)
  const totalSavings = records.reduce((sum, record) => {
    if (record.daily_cost) {
      return sum + (record.daily_cost * record.current_streak_days)
    }
    return sum
  }, 0)

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Carregando suas jornadas...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-white/20 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm">🌟</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Jornada de Sobriedade</h1>
              <p className="text-sm text-gray-600">Olá, {user?.email?.split('@')[0]}!</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={signOut}
            className="text-gray-600 hover:text-gray-900"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sair
          </Button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        {/* Resumo Geral */}
        {records.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center text-sm font-medium text-gray-600">
                  <Calendar className="w-4 h-4 mr-2" />
                  Total de Dias
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-indigo-600">{totalDays}</div>
                <p className="text-xs text-gray-500">
                  {records.length} jornada{records.length !== 1 ? 's' : ''} ativa{records.length !== 1 ? 's' : ''}
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center text-sm font-medium text-gray-600">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Humor Médio
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-indigo-600">
                  {moodStats ? `${moodStats.overall}/5` : '--'}
                </div>
                <p className="text-xs text-gray-500">
                  {moodStats ? `${moodStats.totalEntries} registros` : 'Nenhum registro'}
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center text-sm font-medium text-gray-600">
                  <Target className="w-4 h-4 mr-2" />
                  Economia
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  R$ {totalSavings.toFixed(2)}
                </div>
                <p className="text-xs text-gray-500">Total economizado</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Botão de Emergência e Actions */}
        <div className="flex flex-col sm:flex-row gap-4 items-start">
          <EmergencyButton />
          <div className="flex gap-2 flex-wrap">
            <Button 
              onClick={() => setShowStartModal(true)}
              className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nova Jornada
            </Button>
          </div>
        </div>

        {/* Mood Tracker */}
        <MoodTracker />

        {/* Jornadas Ativas */}
        {records.length === 0 ? (
          <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader className="text-center pb-2">
              <div className="mx-auto mb-4 w-20 h-20 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center">
                <span className="text-3xl">🌱</span>
              </div>
              <CardTitle>Bem-vindo à sua jornada!</CardTitle>
              <CardDescription>
                Comece sua primeira jornada de sobriedade e acompanhe seu progresso.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Button 
                onClick={() => setShowStartModal(true)}
                className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Iniciar Primeira Jornada
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Suas Jornadas</h2>
              <Badge variant="secondary" className="bg-indigo-100 text-indigo-700">
                {records.length} ativa{records.length !== 1 ? 's' : ''}
              </Badge>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {records.map((record) => (
                <SobrietyCard key={record.id} record={record} />
              ))}
            </div>
          </div>
        )}

        {/* Savings Tracker */}
        {records.some(r => r.daily_cost) && <SavingsTracker />}
      </div>

      {/* Modal para iniciar jornada */}
      <StartJourneyModal 
        open={showStartModal} 
        onOpenChange={setShowStartModal} 
      />
    </div>
  )
}
