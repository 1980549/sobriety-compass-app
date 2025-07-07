import React from 'react'
import { Button } from '@/components/ui/button'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Calendar, RotateCcw, Trash2, StopCircle } from 'lucide-react'
import { SobrietyRecord } from '@/hooks/useSobriety'

interface SobrietyCardActionsProps {
  record: SobrietyRecord
  onIncrementDay: () => void
  onResetStreak: () => void
  onEndJourney: () => void
  onDeleteJourney: () => void
}

export const SobrietyCardActions = ({ 
  record, 
  onIncrementDay, 
  onResetStreak, 
  onEndJourney, 
  onDeleteJourney 
}: SobrietyCardActionsProps) => {
  return (
    <div className="space-y-4">
      {/* Ações da jornada */}
      {record.is_active && (
        <div className="flex flex-wrap gap-2 pt-2">
          <Button
            onClick={onIncrementDay}
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
                <AlertDialogAction onClick={onResetStreak}>
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
                <AlertDialogAction onClick={onEndJourney}>
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
                onClick={onDeleteJourney}
                className="bg-red-600 hover:bg-red-700"
              >
                Excluir
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  )
}