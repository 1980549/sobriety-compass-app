
import { useAchievements } from '@/hooks/useAchievements'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { useSobriety } from '@/hooks/useSobriety'
import { useJournal } from '@/hooks/useJournal'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface AchievementsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AchievementsModal({ open, onOpenChange }: AchievementsModalProps) {
  const { achievements, userAchievements, loading } = useAchievements()
  const { records } = useSobriety()
  const { entries } = useJournal()

  const getProgressForAchievement = (achievement: any) => {
    let current = 0
    
    if (achievement.requirement_type === 'days') {
      current = Math.max(...records.map(r => r.current_streak_days), 0)
    } else if (achievement.requirement_type === 'money_saved') {
      current = records.reduce((sum, record) => {
        if (record.daily_cost) {
          return sum + (record.daily_cost * record.current_streak_days)
        }
        return sum
      }, 0)
    } else if (achievement.requirement_type === 'journal_entries') {
      current = entries.length
    }

    return Math.min((current / achievement.requirement_value) * 100, 100)
  }

  const isEarned = (achievementId: string) => {
    return userAchievements.some(ua => ua.achievement_id === achievementId)
  }

  const getEarnedDate = (achievementId: string) => {
    const earned = userAchievements.find(ua => ua.achievement_id === achievementId)
    return earned ? earned.earned_at : null
  }

  if (loading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  const categorizedAchievements = achievements.reduce((acc, achievement) => {
    const category = achievement.category || 'Outros'
    if (!acc[category]) acc[category] = []
    acc[category].push(achievement)
    return acc
  }, {} as Record<string, typeof achievements>)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            🏆 Suas Conquistas
          </DialogTitle>
          <DialogDescription>
            Acompanhe seu progresso e desbloqueie novas conquistas
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Estatísticas */}
          <div className="grid grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-indigo-600">
                  {userAchievements.length}
                </div>
                <p className="text-sm text-gray-600">Conquistadas</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-gray-600">
                  {achievements.length - userAchievements.length}
                </div>
                <p className="text-sm text-gray-600">Restantes</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-600">
                  {Math.round((userAchievements.length / achievements.length) * 100)}%
                </div>
                <p className="text-sm text-gray-600">Progresso</p>
              </CardContent>
            </Card>
          </div>

          {/* Conquistas por categoria */}
          {Object.entries(categorizedAchievements).map(([category, categoryAchievements]) => (
            <div key={category}>
              <h3 className="text-lg font-semibold mb-3">{category}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {categoryAchievements.map((achievement) => {
                  const earned = isEarned(achievement.id)
                  const progress = getProgressForAchievement(achievement)
                  const earnedDate = getEarnedDate(achievement.id)

                  return (
                    <Card 
                      key={achievement.id}
                      className={`transition-all ${
                        earned 
                          ? 'bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200' 
                          : 'bg-gray-50'
                      }`}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div 
                            className={`text-2xl ${earned ? 'grayscale-0' : 'grayscale'}`}
                          >
                            {achievement.icon}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className={`font-medium ${earned ? 'text-yellow-800' : 'text-gray-700'}`}>
                                {achievement.name}
                              </h4>
                              {earned && (
                                <Badge 
                                  variant="secondary" 
                                  className="bg-yellow-100 text-yellow-800"
                                >
                                  ✓
                                </Badge>
                              )}
                            </div>
                            <p className={`text-sm mb-3 ${earned ? 'text-yellow-700' : 'text-gray-600'}`}>
                              {achievement.description}
                            </p>
                            
                            {!earned && (
                              <div className="space-y-1">
                                <div className="flex justify-between text-xs text-gray-500">
                                  <span>Progresso</span>
                                  <span>{Math.round(progress)}%</span>
                                </div>
                                <Progress value={progress} className="h-2" />
                              </div>
                            )}

                            {earned && earnedDate && (
                              <p className="text-xs text-yellow-600 mt-2">
                                Conquistado {formatDistanceToNow(new Date(earnedDate), { 
                                  addSuffix: true,
                                  locale: ptBR 
                                })}
                              </p>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}
