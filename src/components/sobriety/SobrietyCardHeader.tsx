import React from 'react'
import { Badge } from '@/components/ui/badge'
import { Calendar, Trophy, DollarSign } from 'lucide-react'
import { SobrietyRecord } from '@/hooks/useSobriety'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface SobrietyCardHeaderProps {
  record: SobrietyRecord
}

export const SobrietyCardHeader = ({ record }: SobrietyCardHeaderProps) => {
  const startDate = new Date(record.start_date)
  const timeAgo = formatDistanceToNow(startDate, { addSuffix: true, locale: ptBR })
  
  const getAddictionIcon = () => {
    return record.addiction_types?.icon || '🚫'
  }

  const getAddictionColor = () => {
    return record.addiction_types?.color || '#6366f1'
  }

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <span className="text-2xl">{getAddictionIcon()}</span>
        <div>
          <h3 className="font-semibold text-lg">
            {record.addiction_types?.name || record.addiction_type}
          </h3>
          <p className="text-sm text-gray-600">
            Iniciado {timeAgo}
          </p>
        </div>
      </div>
      
      {record.is_active ? (
        <Badge variant="secondary" className="bg-green-100 text-green-800">
          Ativa
        </Badge>
      ) : (
        <Badge variant="outline">
          Finalizada
        </Badge>
      )}
    </div>
  )
}