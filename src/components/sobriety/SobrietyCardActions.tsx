import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Calendar, RotateCcw, Trash2, StopCircle, Edit3 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { SobrietyRecord } from '@/hooks/useSobriety'

interface SobrietyCardActionsProps {
  record: SobrietyRecord
  onRegisterRelapse: (relapseDate?: string) => void
  onUpdateStartDate?: (newStartDate: string) => void
  onEndJourney: () => void
  onDeleteJourney: () => void
}

export const SobrietyCardActions = ({ 
  record, 
  onRegisterRelapse, 
  onUpdateStartDate,
  onEndJourney, 
  onDeleteJourney 
}: SobrietyCardActionsProps) => {
  const [relapseDate, setRelapseDate] = useState('')
  const [editStartDate, setEditStartDate] = useState(record.start_date)
  
  return (
    <div className="space-y-4">
      {/* Ações da jornada */}
      {record.is_active && (
        <div className="flex flex-wrap gap-2 pt-2">
          {/* Editar Data de Início */}
          {onUpdateStartDate && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button size="sm" variant="outline">
                  <Edit3 className="w-4 h-4 mr-1" />
                  Editar Início
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Editar Data de Início</AlertDialogTitle>
                  <AlertDialogDescription>
                    Altere a data de início da sua jornada. Os cálculos serão atualizados automaticamente.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="start-date" className="text-right">
                      Nova Data
                    </Label>
                    <Input
                      id="start-date"
                      type="date"
                      value={editStartDate}
                      onChange={(e) => setEditStartDate(e.target.value)}
                      className="col-span-3"
                    />
                  </div>
                </div>
                <AlertDialogFooter>
                  <AlertDialogCancel onClick={() => setEditStartDate(record.start_date)}>
                    Cancelar
                  </AlertDialogCancel>
                  <AlertDialogAction onClick={() => onUpdateStartDate(editStartDate)}>
                    Atualizar
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}

          {/* Registrar Recaída */}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button size="sm" variant="outline">
                <RotateCcw className="w-4 h-4 mr-1" />
                Recaída
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Registrar Recaída</AlertDialogTitle>
                <AlertDialogDescription>
                  Registre a data da recaída. O sistema recalculará automaticamente seus dias limpos a partir dessa data.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="relapse-date" className="text-right">
                    Data da Recaída
                  </Label>
                  <Input
                    id="relapse-date"
                    type="date"
                    value={relapseDate}
                    onChange={(e) => setRelapseDate(e.target.value)}
                    className="col-span-3"
                    max={new Date().toISOString().split('T')[0]}
                  />
                </div>
              </div>
              <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setRelapseDate('')}>
                  Cancelar
                </AlertDialogCancel>
                <AlertDialogAction onClick={() => onRegisterRelapse(relapseDate || undefined)}>
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