import React, { useState, useEffect } from 'react'
import { Plus, Calendar, Trophy, DollarSign, Target, Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useSobriety } from '@/hooks/useSobriety'
import { SobrietyCard } from './SobrietyCard'
import { StartJourneyModal } from './StartJourneyModal'
import { JournalModal } from './JournalModal'
import { AchievementsModal } from './AchievementsModal'
import { MoodTracker } from './MoodTracker'

const MultiSobrietyDashboard = () => {
  const { 
    sobrietyRecords, 
    addSobrietyRecord, 
    updateSobrietyRecord,
  } = useSobriety()

  const [isStartModalOpen, setIsStartModalOpen] = useState(false)
  const [isJournalModalOpen, setIsJournalModalOpen] = useState(false)
  const [isAchievementsModalOpen, setIsAchievementsModalOpen] = useState(false)

  useEffect(() => {
    // console.log('Registros de sobriedade:', sobrietyRecords)
  }, [sobrietyRecords])

  const handleNewJourney = async (newRecord: any) => {
    await addSobrietyRecord(newRecord)
    setIsStartModalOpen(false)
  }

  const handleUpdateRecord = async (updatedRecord: any) => {
    await updateSobrietyRecord(updatedRecord)
  }

  const getTotalDays = () => {
    return sobrietyRecords.reduce((acc, record) => acc + record.current_streak, 0)
  }

  const getBestStreak = () => {
    return sobrietyRecords.reduce((acc, record) => Math.max(acc, record.longest_streak), 0)
  }

  const getTotalSavings = () => {
    return sobrietyRecords.reduce((acc, record) => acc + record.money_saved, 0).toFixed(2)
  }

  const getActiveJourneys = () => {
    return sobrietyRecords.filter(record => record.is_active).length
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
        <Button 
          onClick={() => setIsStartModalOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-sm sm:text-base"
          size="sm"
        >
          <Plus className="w-4 h-4 mr-1 sm:mr-2" />
          Nova Jornada
        </Button>
      </div>

      {/* Cards de jornadas - grid responsivo */}
      {sobrietyRecords.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
          {sobrietyRecords.map((record) => (
            <SobrietyCard 
              key={record.id} 
              record={record} 
              onUpdate={handleUpdateRecord}
              className="w-full"
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
              Dê o primeiro passo rumo à sua recuperação. Cada dia é uma nova oportunidade.
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
      {sobrietyRecords.length > 0 && (
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

      {/* Mood Tracker - responsivo */}
      <div className="mt-6 sm:mt-8">
        <MoodTracker />
      </div>

      {/* Modais */}
      <StartJourneyModal 
        isOpen={isStartModalOpen}
        onClose={() => setIsStartModalOpen(false)}
        onSuccess={handleNewJourney}
      />

      <JournalModal
        isOpen={isJournalModalOpen}
        onClose={() => setIsJournalModalOpen(false)}
        sobrietyRecords={sobrietyRecords}
      />

      <AchievementsModal
        isOpen={isAchievementsModalOpen}
        onClose={() => setIsAchievementsModalOpen(false)}
        sobrietyRecords={sobrietyRecords}
      />
    </div>
  )
}

export default MultiSobrietyDashboard
