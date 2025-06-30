
import React, { useState, useEffect } from 'react'
import { SobrietyRecord } from '@/lib/supabase'
import { useSobriety } from '@/hooks/useSobriety'
import { useAchievements } from '@/hooks/useAchievements'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Calendar, DollarSign, Target, X, Award } from 'lucide-react'

interface SobrietyCardProps {
  record: SobrietyRecord
}

export function SobrietyCard({ record }: SobrietyCardProps) {
  const { endJourney } = useSobriety()
  const { checkDaysAchievements } = useAchievements()
  const [currentDays, setCurrentDays] = useState(record.current_streak_days || 0)

  // Atualizar dias em tempo real
  useEffect(() => {
    const updateDays = () => {
      const startDate = new Date(record.start_date)
      const now = new Date()
      const diffTime = now.getTime() - startDate.getTime()
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
      const newDays = diffDays >= 0 ? diffDays : 0
      setCurrentDays(newDays)
      
      // Verificar conquistas automaticamente
      if (newDays !== currentDays && newDays > 0) {
        checkDaysAchievements({ ...record, current_streak_days: newDays })
      }
    }

    updateDays()
    
    const interval = setInterval(updateDays, 60000) // Atualizar a cada minuto
    
    // Escutar eventos de atualização
    const handleUpdate = () => updateDays()
    window.addEventListener('sobriety-update', handleUpdate)

    return () => {
      clearInterval(interval)
      window.removeEventListener('sobriety-update', handleUpdate)
    }
  }, [record.start_date, record, checkDaysAchievements, currentDays])

  // Calcular diferentes unidades de tempo
  const getTimeBreakdown = () => {
    const weeks = Math.floor(currentDays / 7)
    const months = Math.floor(currentDays / 30)
    const years = Math.floor(currentDays / 365)
    
    return { weeks, months, years }
  }

  // Calcular próximo marco
  const getNextMilestone = () => {
    const milestones = [7, 30, 90, 180, 365, 730, 1095]
    const nextMilestone = milestones.find(m => m > currentDays)
    
    if (nextMilestone) {
      const remaining = nextMilestone - currentDays
      const progress = (currentDays / nextMilestone) * 100
      return { target: nextMilestone, remaining, progress }
    }
    
    return null
  }

  // Calcular economia
  const calculateSavings = () => {
    if (!record.daily_cost) return 0
    return record.daily_cost * currentDays
  }

  // Obter mensagem motivacional
  const getMotivationalMessage = () => {
    if (currentDays === 0) return "Sua jornada começa agora! 💪"
    if (currentDays === 1) return "Primeiro dia completo! Continue assim! 🌟"
    if (currentDays === 7) return "Uma semana inteira! Incrível! 🎉"
    if (currentDays === 30) return "Um mês completo! Você é forte! 🏆"
    if (currentDays === 90) return "3 meses! Você está transformando sua vida! ✨"
    if (currentDays === 365) return "1 ANO COMPLETO! Você é inspiração! 🎊"
    
    if (currentDays < 7) return `${currentDays} dias de força e determinação! 💪`
    if (currentDays < 30) return `${currentDays} dias de nova vida! Continue! 🌱`
    if (currentDays < 90) return `${currentDays} dias de progresso incrível! 🚀`
    
    return `${currentDays} dias de vitória! Você é incrível! 🌟`
  }

  const timeBreakdown = getTimeBreakdown()
  const nextMilestone = getNextMilestone()
  const savings = calculateSavings()
  const addictionType = record.addiction_types

  return (
    <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
      {/* Header com cor do tipo de vício */}
      <div 
        className="h-1 w-full"
        style={{ backgroundColor: addictionType?.color || '#6366f1' }}
      />
      
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div 
              className="w-12 h-12 rounded-full flex items-center justify-center text-2xl shadow-lg"
              style={{ backgroundColor: addictionType?.color + '20' || '#6366f120' }}
            >
              {addictionType?.icon || '🚫'}
            </div>
            <div>
              <CardTitle className="text-lg">{addictionType?.name || 'Vício'}</CardTitle>
              <p className="text-sm text-gray-500">
                Iniciado em {new Date(record.start_date).toLocaleDateString('pt-BR')}
              </p>
            </div>
          </div>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-red-500">
                <X className="w-4 h-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Finalizar jornada?</AlertDialogTitle>
                <AlertDialogDescription>
                  Tem certeza que deseja finalizar esta jornada de sobriedade? Esta ação não pode ser desfeita.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={() => endJourney(record.id)}>
                  Finalizar
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Contador principal */}
        <div className="text-center p-4 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg">
          <div className="text-4xl font-bold text-indigo-600 mb-2">
            {currentDays}
          </div>
          <div className="text-sm font-medium text-gray-600 mb-2">
            {currentDays === 1 ? 'dia' : 'dias'} limpo{currentDays !== 1 ? 's' : ''}
          </div>
          
          {/* Breakdown de tempo */}
          {currentDays > 0 && (
            <div className="flex justify-center space-x-4 text-xs text-gray-500">
              {timeBreakdown.weeks > 0 && (
                <span>{timeBreakdown.weeks} sem{timeBreakdown.weeks !== 1 ? '.' : ''}</span>
              )}
              {timeBreakdown.months > 0 && (
                <span>{timeBreakdown.months} mês{timeBreakdown.months !== 1 ? 'es' : ''}</span>
              )}
              {timeBreakdown.years > 0 && (
                <span>{timeBreakdown.years} ano{timeBreakdown.years !== 1 ? 's' : ''}</span>
              )}
            </div>
          )}
        </div>

        {/* Próximo marco */}
        {nextMilestone && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Próximo marco</span>
              <Badge variant="secondary" className="text-xs">
                {nextMilestone.target} dias
              </Badge>
            </div>
            <Progress value={nextMilestone.progress} className="h-2" />
            <p className="text-xs text-gray-500 text-center">
              Faltam {nextMilestone.remaining} dias
            </p>
          </div>
        )}

        {/* Economia */}
        {record.daily_cost && (
          <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
            <div className="flex items-center space-x-2">
              <DollarSign className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium text-green-700">Economizado</span>
            </div>
            <span className="text-lg font-bold text-green-600">
              R$ {savings.toFixed(2)}
            </span>
          </div>
        )}

        {/* Meta pessoal */}
        {record.personal_goal && (
          <div className="flex items-start space-x-2 p-3 bg-blue-50 rounded-lg">
            <Target className="w-4 h-4 text-blue-600 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-blue-700">Meta</p>
              <p className="text-xs text-blue-600">{record.personal_goal}</p>
            </div>
          </div>
        )}

        {/* Mensagem motivacional */}
        <div className="text-center p-3 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg">
          <p className="text-sm font-medium text-indigo-700">
            {getMotivationalMessage()}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
