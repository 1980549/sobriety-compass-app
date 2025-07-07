
import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { Session, User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import { useToast } from '@/hooks/use-toast'
import { useGuestAuth } from './useGuestAuth'
import { AppUser } from '@/types/user'

interface UnifiedAuthContextType {
  session: Session | null
  user: User | null
  isGuest: boolean
  currentUser: AppUser | null
  loading: boolean
  signUp: (email: string, password: string, nome?: string) => Promise<void>
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
}

const UnifiedAuthContext = createContext<UnifiedAuthContextType | undefined>(undefined)

export function UnifiedAuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()
  const { guestUser, migrateGuestData, clearGuestUser } = useGuestAuth()

  const isGuest = !user && !!guestUser
  const currentUser: AppUser | null = user || guestUser

  useEffect(() => {
    let mounted = true
    
    // Configurar listener de mudanças de autenticação
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!mounted) return
      
      setSession(session)
      setUser(session?.user ?? null)
      
      // Se o usuário acabou de se autenticar e temos dados guest, migrar
      if (_event === 'SIGNED_IN' && session?.user && guestUser) {
        migrateGuestData(session.user)
      }
      
      setLoading(false)
    })

    // Verificar sessão inicial
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!mounted) return
      
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  const signUp = async (email: string, password: string, nome?: string) => {
    try {
      setLoading(true)
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            display_name: nome || email.split('@')[0]
          },
          emailRedirectTo: `${window.location.origin}/`
        }
      })

      if (error) throw error

      toast({
        title: "Cadastro realizado!",
        description: "Verifique seu email para confirmar a conta.",
      })
    } catch (error: any) {
      console.error('Erro no cadastro:', error)
      toast({
        title: "Erro no cadastro",
        description: error.message,
        variant: "destructive",
      })
      throw error
    } finally {
      setLoading(false)
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true)
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      toast({
        title: "Login realizado!",
        description: "Bem-vindo de volta!",
      })
    } catch (error: any) {
      console.error('Erro no login:', error)
      toast({
        title: "Erro no login",
        description: error.message,
        variant: "destructive",
      })
      throw error
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    try {
      setLoading(true)
      const { error } = await supabase.auth.signOut()
      if (error) throw error

      toast({
        title: "Logout realizado",
        description: "Até logo!",
      })
    } catch (error: any) {
      console.error('Erro no logout:', error)
      toast({
        title: "Erro no logout",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const value = {
    session,
    user,
    isGuest,
    currentUser,
    loading,
    signUp,
    signIn,
    signOut,
  }

  return <UnifiedAuthContext.Provider value={value}>{children}</UnifiedAuthContext.Provider>
}

export function useUnifiedAuth() {
  const context = useContext(UnifiedAuthContext)
  if (context === undefined) {
    throw new Error('useUnifiedAuth must be used within a UnifiedAuthProvider')
  }
  return context
}
