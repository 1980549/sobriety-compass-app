
import { useSobriety } from '@/hooks/useSobriety'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { DollarSign, TrendingUp, PiggyBank, Target } from 'lucide-react'

export function SavingsTracker() {
  const { records } = useSobriety()

  // Calcular economia por jornada
  const savingsData = records
    .filter(record => record.daily_cost && record.daily_cost > 0)
    .map(record => {
      const dailyCost = Number(record.daily_cost) || 0
      const days = Number(record.current_streak_days) || 0
      return {
        name: record.addiction_types?.name || 'Vício',
        icon: record.addiction_types?.icon || '🚫',
        color: record.addiction_types?.color || '#6366f1',
        dailyCost,
        days,
        totalSaved: dailyCost * days,
      }
    })

  const totalSaved = savingsData.reduce((sum, item) => sum + item.totalSaved, 0)
  const dailyTotal = savingsData.reduce((sum, item) => sum + item.dailyCost, 0)

  // Calcular metas de economia
  const savingsGoals = [
    { amount: 100, label: 'R$ 100' },
    { amount: 500, label: 'R$ 500' },
    { amount: 1000, label: 'R$ 1.000' },
    { amount: 5000, label: 'R$ 5.000' },
    { amount: 10000, label: 'R$ 10.000' },
  ]

  const nextGoal = savingsGoals.find(goal => goal.amount > totalSaved)
  const currentGoalProgress = nextGoal ? (totalSaved / nextGoal.amount) * 100 : 100

  if (savingsData.length === 0) return null

  return (
    <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <PiggyBank className="w-5 h-5 text-green-500" />
            <CardTitle className="text-lg">Economia Total</CardTitle>
          </div>
          <Badge variant="secondary" className="bg-green-100 text-green-700">
            R$ {dailyTotal.toFixed(2)}/dia
          </Badge>
        </div>
        <CardDescription>
          Dinheiro que você economizou parando com seus vícios
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Total geral */}
        <div className="text-center p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg">
          <div className="text-4xl font-bold text-green-600 mb-2">
            R$ {totalSaved.toFixed(2)}
          </div>
          <p className="text-sm text-green-700 font-medium">
            Total economizado
          </p>
          <p className="text-xs text-green-600 mt-1">
            Economizando R$ {dailyTotal.toFixed(2)} por dia
          </p>
        </div>

        {/* Próxima meta */}
        {nextGoal && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Target className="w-4 h-4 text-indigo-500" />
                <span className="text-sm font-medium text-gray-700">
                  Próxima meta: {nextGoal.label}
                </span>
              </div>
              <span className="text-sm text-gray-500">
                {Math.round(currentGoalProgress)}%
              </span>
            </div>
            <Progress value={currentGoalProgress} className="h-2" />
            <p className="text-xs text-gray-500 text-center">
              Faltam R$ {(nextGoal.amount - totalSaved).toFixed(2)} para atingir a meta
            </p>
          </div>
        )}

        {/* Breakdown por vício */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-700 flex items-center">
            <TrendingUp className="w-4 h-4 mr-2" />
            Economia por Vício
          </h4>
          
          {savingsData.map((item, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div 
                  className="w-8 h-8 rounded-full flex items-center justify-center text-sm"
                  style={{ backgroundColor: item.color + '20' }}
                >
                  {item.icon}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{item.name}</p>
                  <p className="text-xs text-gray-500">
                    R$ {item.dailyCost.toFixed(2)}/dia × {item.days} dias
                  </p>
                </div>
              </div>
              
              <div className="text-right">
                <p className="text-sm font-bold text-green-600">
                  R$ {item.totalSaved.toFixed(2)}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Ideias do que fazer com o dinheiro */}
        <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg">
          <h4 className="text-sm font-medium text-indigo-700 mb-2">
            💡 O que você pode fazer com R$ {totalSaved.toFixed(2)}:
          </h4>
          <ul className="text-xs text-indigo-600 space-y-1">
            {totalSaved >= 50 && <li>• Jantar especial em família</li>}
            {totalSaved >= 100 && <li>• Curso online que sempre quis fazer</li>}
            {totalSaved >= 300 && <li>• Fim de semana especial</li>}
            {totalSaved >= 500 && <li>• Equipamento para novo hobby</li>}
            {totalSaved >= 1000 && <li>• Viagem dos sonhos</li>}
            {totalSaved < 50 && <li>• Continue economizando para realizar seus sonhos!</li>}
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
