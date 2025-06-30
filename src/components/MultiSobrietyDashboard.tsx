
import React, { useState, useEffect } from 'react'
import { Plus, Calendar, Trophy, DollarSign, Target, Heart, Award } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useSobriety } from '@/hooks/useSobriety'
import { SobrietyCard } from './SobrietyCard'
import { StartJourneyModal } from './StartJourneyModal'
import { JournalModal } from './JournalModal'
import { AchievementsModal } from './AchievementsModal'
import { MoodTracker } from './MoodTracker'
import { SavingsTracker } from './SavingsTracker'

const MultiSobrietyDashboard = () => {
  const { 
    records,
    startJourney,
    refreshRecords
  } = useSobriety()

  const [isStartModalOpen, setIsStartModalOpen] = useState(false)
  const [isJournalModalOpen, setIsJournalModalOpen] = useState(false)
  const [isAchievementsModalOpen, setIsAchievementsModalOpen] = useState(false)

  useEffect(() => {
    // console.log('Registros de sobriedade:', records)
  }, [records])

  const handleNewJourney = async (newRecord: any) => {
    await refreshRecords()
    setIsStartModalOpen(false)
  }

  const getTotalDays = () => {
    return records.reduce((acc, record) => acc + (record.current_streak_days || 0), 0)
  }

  const getBestStreak = () => {
    return records.reduce((acc, record) => Math.max(acc, record.best_streak_days || 0), 0)
  }

  const getTotalSavings = () => {
    return records.reduce((acc, record) => {
      const dailyCost = record.daily_cost || 0
      const days = record.current_streak_days || 0
      return acc + (dailyCost * days)
    }, 0).toFixed(2)
  }

  const getActiveJourneys = () => {
    return records.filter(record => record.is_active).length
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header - responsivo */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-0">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
            Suas Jornadas de Sobriedade
          </h2>
          <p className="text-sm sm:text-base text-gray-600">
            Acompanhe seu progresso e conquiste suas metas
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button 
            onClick={() => setIsAchievementsModalOpen(true)}
            variant="outline"
            className="text-sm sm:text-base"
            size="sm"
          >
            <Award className="w-4 h-4 mr-1 sm:mr-2" />
            Conquistas
          </Button>
          <Button 
            onClick={() => setIsStartModalOpen(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-sm sm:text-base"
            size="sm"
          >
            <Plus className="w-4 h-4 mr-1 sm:mr-2" />
            Nova Jornada
          </Button>
        </div>
      </div>

      {/* Cards de jornadas - grid responsivo */}
      {records.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
          {records.map((record) => (
            <SobrietyCard 
              key={record.id} 
              record={record}
            />
          ))}
        </div>
      ) : (
        <Card className="p-6 sm:p-8 text-center">
          <div className="flex flex-col items-center space-y-3 sm:space-y-4">
            <Heart className="w-12 h-12 sm:w-16 sm:h-16 text-indigo-300" />
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
              Comece sua jornada hoje
            </h3>
            <p className="text-sm sm:text-base text-gray-600 max-w-md">
              Dé o primeiro passo rumo à sua recuperação. Cada dia é uma nova oportunidade.
            </p>
            <Button 
              onClick={() => setIsStartModalOpen(true)}
              className="bg-indigo-600 hover:bg-indigo-700 mt-3 sm:mt-4"
            >
              <Plus className="w-4 h-4 mr-2" />
              Iniciar Primeira Jornada
            </Button>
          </div>
        </Card>
      )}

      {/* Seção de estatísticas - layout responsivo */}
      {records.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <Card className="p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-600">Total de Dias</p>
                <p className="text-lg sm:text-2xl font-bold text-indigo-600">
                  {getTotalDays()}
                </p>
              </div>
              <Calendar className="w-6 h-6 sm:w-8 sm:h-8 text-indigo-500" />
            </div>
          </Card>

          <Card className="p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-600">Melhor Sequência</p>
                <p className="text-lg sm:text-2xl font-bold text-green-600">
                  {getBestStreak()}
                </p>
              </div>
              <Trophy className="w-6 h-6 sm:w-8 sm:h-8 text-green-500" />
            </div>
          </Card>

          <Card className="p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-600">Dinheiro Economizado</p>
                <p className="text-lg sm:text-2xl font-bold text-emerald-600">
                  R$ {getTotalSavings()}
                </p>
              </div>
              <DollarSign className="w-6 h-6 sm:w-8 sm:h-8 text-emerald-500" />
            </div>
          </Card>

          <Card className="p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-600">Jornadas Ativas</p>
                <p className="text-lg sm:text-2xl font-bold text-blue-600">
                  {getActiveJourneys()}
                </p>
              </div>
              <Target className="w-6 h-6 sm:w-8 sm:h-8 text-blue-500" />
            </div>
          </Card>
        </div>
      )}

      {/* Seção de Economia e Sugestões - Nova seção restaurada */}
      {records.length > 0 && parseFloat(getTotalSavings()) > 0 && (
        <div className="mt-6 sm:mt-8">
          <SavingsTracker />
        </div>
      )}

      {/* Mood Tracker - responsivo */}
      <div className="mt-6 sm:mt-8">
        <MoodTracker />
      </div>

      {/* Modais */}
      <StartJourneyModal 
        open={isStartModalOpen}
        onOpenChange={setIsStartModalOpen}
      />

      <JournalModal
        open={isJournalModalOpen}
        onOpenChange={setIsJournalModalOpen}
      />

      <AchievementsModal
        open={isAchievementsModalOpen}
        onOpenChange={setIsAchievementsModalOpen}
      />
    </div>
  )
}

export default MultiSobrietyDashboard
