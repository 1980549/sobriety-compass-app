
import React from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Calendar, Trophy, DollarSign, RotateCcw, Trash2, StopCircle } from 'lucide-react'
import { SobrietyRecord } from '@/hooks/useSobriety'
import { useSobriety } from '@/hooks/useSobriety'
import { useAchievements } from '@/hooks/useAchievements'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface SobrietyCardProps {
  record: SobrietyRecord
}

export const SobrietyCard = ({ record }: SobrietyCardProps) => {
  const { updateStreak, resetStreak, endJourney, deleteJourney } = useSobriety()
  const { removeAchievementsForRecord } = useAchievements()

  const daysClean = record.current_streak_days || 0
  const moneySaved = (record.daily_cost || 0) * daysClean
  const startDate = new Date(record.start_date)
  const timeAgo = formatDistanceToNow(startDate, { addSuffix: true, locale: ptBR })

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

  const getAddictionIcon = () => {
    return record.addiction_types?.icon || '🚫'
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
      </CardHeader>

      <CardContent className="space-y-4">
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

        {/* Ações da jornada */}
        {record.is_active && (
          <div className="flex flex-wrap gap-2 pt-2">
            <Button
              onClick={handleIncrementDay}
              size="sm"
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Calendar className="w-4 h-4 mr-1" />
              +1 Dia
            </Button>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button size="sm" variant="outline">
                  <RotateCcw className="w-4 h-4 mr-1" />
                  Recaída
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Confirmar Recaída</AlertDialogTitle>
                  <AlertDialogDescription>
                    Isso irá resetar sua sequência atual para 0 dias. Não desanime, cada recomeço é uma nova oportunidade!
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction onClick={handleResetStreak}>
                    Confirmar
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button size="sm" variant="outline">
                  <StopCircle className="w-4 h-4 mr-1" />
                  Finalizar
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Finalizar Jornada</AlertDialogTitle>
                  <AlertDialogDescription>
                    Isso irá marcar sua jornada como finalizada. Você poderá iniciar uma nova jornada depois se desejar.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction onClick={handleEndJourney}>
                    Finalizar
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )}

        {/* Ação de exclusão */}
        <div className="pt-2 border-t">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button size="sm" variant="destructive" className="w-full">
                <Trash2 className="w-4 h-4 mr-2" />
                Excluir Jornada
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Excluir Jornada</AlertDialogTitle>
                <AlertDialogDescription>
                  Tem certeza que deseja excluir esta jornada? Todos os dados e progresso serão perdidos permanentemente. Esta ação não pode ser desfeita.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={handleDeleteJourney}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Excluir
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>
    </Card>
  )
}
