import React from 'react'
import { Calendar, Trophy, DollarSign } from 'lucide-react'
import { SobrietyRecord } from '@/hooks/useSobriety'

interface SobrietyCardStatsProps {
  record: SobrietyRecord
}

export const SobrietyCardStats = ({ record }: SobrietyCardStatsProps) => {
  const daysClean = record.current_streak_days || 0
  const moneySaved = (record.daily_cost || 0) * daysClean

  return (
    <div className="space-y-4">
      {/* Estatísticas principais */}
      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center space-x-2 p-3 bg-blue-50 rounded-lg">
          <Calendar className="w-5 h-5 text-blue-600" />
          <div>
            <p className="text-sm text-gray-600">Dias limpo</p>
            <p className="text-xl font-bold text-blue-600">{daysClean}</p>
          </div>
        </div>

        <div className="flex items-center space-x-2 p-3 bg-green-50 rounded-lg">
          <Trophy className="w-5 h-5 text-green-600" />
          <div>
            <p className="text-sm text-gray-600">Melhor sequência</p>
            <p className="text-xl font-bold text-green-600">
              {record.best_streak_days || 0}
            </p>
          </div>
        </div>
      </div>

      {/* Economia */}
      {record.daily_cost && record.daily_cost > 0 && (
        <div className="flex items-center space-x-2 p-3 bg-emerald-50 rounded-lg">
          <DollarSign className="w-5 h-5 text-emerald-600" />
          <div>
            <p className="text-sm text-gray-600">Dinheiro economizado</p>
            <p className="text-xl font-bold text-emerald-600">
              R$ {moneySaved.toFixed(2)}
            </p>
          </div>
        </div>
      )}

      {/* Estatísticas adicionais */}
      {record.total_relapses !== undefined && record.total_relapses > 0 && (
        <div className="text-sm text-gray-600">
          Recaídas: {record.total_relapses}
        </div>
      )}
    </div>
  )
}