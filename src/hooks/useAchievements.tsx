
import React, { useState, useEffect } from 'react'
import { supabase, Achievement, UserAchievement, SobrietyRecord } from '@/lib/supabase'
import { useUnifiedAuth } from './useUnifiedAuth'
import { useToast } from '@/hooks/use-toast'

export function useAchievements() {
  const { currentUser, isGuest } = useUnifiedAuth()
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
    if (!currentUser || isGuest) {
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('user_achievements')
        .select(`
          *,
          achievements (*)
        `)
        .eq('user_id', currentUser.id)
        .order('earned_at', { ascending: false })

      if (error) throw error
      setUserAchievements(data || [])
    } catch (error) {
      console.error('Erro ao carregar conquistas do usuário:', error)
    } finally {
      setLoading(false)
    }
  }

  // Verificar e conceder conquistas baseadas em dias para jornada específica
  const checkDaysAchievements = async (record: SobrietyRecord) => {
    if (!currentUser || !achievements.length || isGuest) return

    const daysAchievements = achievements.filter(a => a.requirement_type === 'days')
    
    for (const achievement of daysAchievements) {
      if ((record.current_streak_days || 0) >= achievement.requirement_value) {
        // Verificar se já possui esta conquista para este record específico
        const hasAchievement = userAchievements.some(
          ua => ua.achievement_id === achievement.id && ua.sobriety_record_id === record.id
        )

        if (!hasAchievement) {
          await grantAchievement(achievement.id, record.id)
        }
      }
    }
  }

  // Verificar conquistas de economia (específica por jornada)
  const checkMoneyAchievements = async (record: SobrietyRecord) => {
    if (!currentUser || !achievements.length || isGuest) return

    const totalSaved = (record.daily_cost || 0) * (record.current_streak_days || 0)
    const moneyAchievements = achievements.filter(a => a.requirement_type === 'money_saved')
    
    for (const achievement of moneyAchievements) {
      if (totalSaved >= achievement.requirement_value) {
        const hasAchievement = userAchievements.some(
          ua => ua.achievement_id === achievement.id && ua.sobriety_record_id === record.id
        )

        if (!hasAchievement) {
          await grantAchievement(achievement.id, record.id)
        }
      }
    }
  }

  // Verificar conquistas de diário (geral, não específica por jornada)
  const checkJournalAchievements = async (entriesCount: number) => {
    if (!currentUser || !achievements.length || isGuest) return

    const journalAchievements = achievements.filter(a => a.requirement_type === 'journal_entries')
    
    for (const achievement of journalAchievements) {
      if (entriesCount >= achievement.requirement_value) {
        const hasAchievement = userAchievements.some(
          ua => ua.achievement_id === achievement.id && !ua.sobriety_record_id
        )

        if (!hasAchievement) {
          await grantAchievement(achievement.id)
        }
      }
    }
  }

  // Conceder conquista
  const grantAchievement = async (achievementId: string, sobrietyRecordId?: string) => {
    if (!currentUser || isGuest) return

    try {
      const { data, error } = await supabase
        .from('user_achievements')
        .insert([
          {
            user_id: currentUser.id,
            achievement_id: achievementId,
            sobriety_record_id: sobrietyRecordId,
          },
        ])
        .select(`
          *,
          achievements (*)
        `)

      if (error) throw error

      if (data && data.length > 0) {
        const newAchievement = data[0]
        
        toast({
          title: "🏆 Nova Conquista!",
          description: `Você desbloqueou: ${newAchievement.achievements?.name}`,
        })

        await loadUserAchievements()
      }
    } catch (error: any) {
      console.error('Erro ao conceder conquista:', error)
    }
  }

  // Recalcular conquistas para uma jornada específica
  const recalculateAchievementsForRecord = async (record: SobrietyRecord) => {
    await checkDaysAchievements(record)
    await checkMoneyAchievements(record)
  }

  // Remover conquistas de uma jornada excluída
  const removeAchievementsForRecord = async (recordId: string) => {
    if (!currentUser || isGuest) return

    try {
      const { error } = await supabase
        .from('user_achievements')
        .delete()
        .eq('user_id', currentUser.id)
        .eq('sobriety_record_id', recordId)

      if (error) throw error

      await loadUserAchievements()
    } catch (error) {
      console.error('Erro ao remover conquistas da jornada:', error)
    }
  }

  useEffect(() => {
    loadAchievements()
  }, [])

  useEffect(() => {
    if (currentUser) {
      loadUserAchievements()
    }
  }, [currentUser])

  return {
    achievements,
    userAchievements,
    loading,
    checkDaysAchievements,
    checkMoneyAchievements,
    checkJournalAchievements,
    grantAchievement,
    recalculateAchievementsForRecord,
    removeAchievementsForRecord,
    refreshAchievements: loadUserAchievements,
  }
}
