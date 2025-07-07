
import React from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { SobrietyRecord } from '@/hooks/useSobriety'
import { useSobriety } from '@/hooks/useSobriety'
import { useAchievements } from '@/hooks/useAchievements'
import { SobrietyCardHeader } from './sobriety/SobrietyCardHeader'
import { SobrietyCardStats } from './sobriety/SobrietyCardStats'
import { SobrietyCardActions } from './sobriety/SobrietyCardActions'

interface SobrietyCardProps {
  record: SobrietyRecord
}

export const SobrietyCard = ({ record }: SobrietyCardProps) => {
  const { updateStreak, resetStreak, endJourney, deleteJourney } = useSobriety()
  const { removeAchievementsForRecord } = useAchievements()

  const daysClean = record.current_streak_days || 0

  const handleIncrementDay = () => {
    updateStreak(record.id, daysClean + 1)
  }

  const handleResetStreak = () => {
    resetStreak(record.id)
  }

  const handleEndJourney = () => {
    endJourney(record.id)
  }

  const handleDeleteJourney = async () => {
    await removeAchievementsForRecord(record.id)
    deleteJourney(record.id)
  }

  const getAddictionColor = () => {
    return record.addiction_types?.color || '#6366f1'
  }

  return (
    <Card className="relative overflow-hidden">
      <div 
        className="absolute top-0 left-0 w-1 h-full"
        style={{ backgroundColor: getAddictionColor() }}
      />
      
      <CardHeader className="pb-3">
        <SobrietyCardHeader record={record} />
      </CardHeader>

      <CardContent className="space-y-4">
        <SobrietyCardStats record={record} />
        
        <SobrietyCardActions
          record={record}
          onIncrementDay={handleIncrementDay}
          onResetStreak={handleResetStreak}
          onEndJourney={handleEndJourney}
          onDeleteJourney={handleDeleteJourney}
        />
      </CardContent>
    </Card>
  )
}
