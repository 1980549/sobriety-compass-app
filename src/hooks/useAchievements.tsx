
import { useState, useEffect } from 'react'
import { supabase, Achievement, UserAchievement, SobrietyRecord } from '@/lib/supabase'
import { useAuth } from './useAuth'
import { useToast } from '@/hooks/use-toast'

export function useAchievements() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [userAchievements, setUserAchievements] = useState<UserAchievement[]>([])
  const [loading, setLoading] = useState(true)

  // Carregar todas as conquistas disponíveis
  const loadAchievements = async () => {
    try {
      const { data, error } = await supabase
        .from('achievements')
        .select('*')
        .order('requirement_value')

      if (error) throw error
      setAchievements(data || [])
    } catch (error) {
      console.error('Erro ao carregar conquistas:', error)
    }
  }

  // Carregar conquistas do usuário
  const loadUserAchievements = async () => {
    if (!user) return

    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('user_achievements')
        .select(`
          *,
          achievements (*)
        `)
        .eq('user_id', user.id)
        .order('earned_at', { ascending: false })

      if (error) throw error
      setUserAchievements(data || [])
    } catch (error) {
      console.error('Erro ao carregar conquistas do usuário:', error)
    } finally {
      setLoading(false)
    }
  }

  // Verificar e conceder conquistas baseadas em dias
  const checkDaysAchievements = async (record: SobrietyRecord) => {
    if (!user) return

    const daysAchievements = achievements.filter(a => a.requirement_type === 'days')
    
    for (const achievement of daysAchievements) {
      if (record.current_streak_days >= achievement.requirement_value) {
        // Verificar se já possui esta conquista para este record
        const hasAchievement = userAchievements.some(
          ua => ua.achievement_id === achievement.id && ua.sobriety_record_id === record.id
        )

        if (!hasAchievement) {
          await grantAchievement(achievement.id, record.id)
        }
      }
    }
  }

  // Verificar conquistas de economia
  const checkMoneyAchievements = async (totalSaved: number) => {
    if (!user) return

    const moneyAchievements = achievements.filter(a => a.requirement_type === 'money_saved')
    
    for (const achievement of moneyAchievements) {
      if (totalSaved >= achievement.requirement_value) {
        const hasAchievement = userAchievements.some(
          ua => ua.achievement_id === achievement.id
        )

        if (!hasAchievement) {
          await grantAchievement(achievement.id)
        }
      }
    }
  }

  // Verificar conquistas de diário
  const checkJournalAchievements = async (entriesCount: number) => {
    if (!user) return

    const journalAchievements = achievements.filter(a => a.requirement_type === 'journal_entries')
    
    for (const achievement of journalAchievements) {
      if (entriesCount >= achievement.requirement_value) {
        const hasAchievement = userAchievements.some(
          ua => ua.achievement_id === achievement.id
        )

        if (!hasAchievement) {
          await grantAchievement(achievement.id)
        }
      }
    }
  }

  // Conceder conquista
  const grantAchievement = async (achievementId: string, sobrietyRecordId?: string) => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from('user_achievements')
        .insert([
          {
            user_id: user.id,
            achievement_id: achievementId,
            sobriety_record_id: sobrietyRecordId,
          },
        ])
        .select(`
          *,
          achievements (*)
        `)

      if (error) throw error

      const newAchievement = data[0]
      
      toast({
        title: "🏆 Nova Conquista!",
        description: `Você desbloqueou: ${newAchievement.achievements?.name}`,
      })

      await loadUserAchievements()
    } catch (error: any) {
      console.error('Erro ao conceder conquista:', error)
    }
  }

  useEffect(() => {
    loadAchievements()
  }, [])

  useEffect(() => {
    if (user) {
      loadUserAchievements()
    }
  }, [user])

  return {
    achievements,
    userAchievements,
    loading,
    checkDaysAchievements,
    checkMoneyAchievements,
    checkJournalAchievements,
    grantAchievement,
    refreshAchievements: loadUserAchievements,
  }
}
