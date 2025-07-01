
import { User } from '@supabase/supabase-js'

export interface GuestUser {
  id: string
  email: string
  isGuest: true
  display_name: string
}

export type AppUser = User | GuestUser

export const getDisplayName = (user: AppUser | null): string => {
  if (!user) return 'Usuário'
  
  // Se for um usuário guest
  if ('isGuest' in user && user.isGuest) {
    return user.display_name || 'Visitante'
  }
  
  // Se for um usuário autenticado do Supabase
  const supabaseUser = user as User
  
  // Tentar pegar do user_metadata primeiro
  if (supabaseUser.user_metadata?.display_name) {
    return supabaseUser.user_metadata.display_name
  }
  
  // Tentar pegar do raw_user_meta_data
  if (supabaseUser.raw_user_meta_data?.display_name) {
    return supabaseUser.raw_user_meta_data.display_name
  }
  
  // Fallback para email (parte antes do @)
  if (supabaseUser.email) {
    return supabaseUser.email.split('@')[0]
  }
  
  return 'Usuário'
}

export const getUserInitials = (user: AppUser | null): string => {
  const name = getDisplayName(user)
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}
