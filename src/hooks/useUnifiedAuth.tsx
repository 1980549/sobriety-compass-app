
import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { Session, User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import { useToast } from '@/hooks/use-toast'
import { useGuestAuth } from './useGuestAuth'

interface UnifiedAuthContextType {
  session: Session | null
  user: User | null
  isGuest: boolean
  currentUser: User | { id: string; email: string; display_name: string } | null
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
  const currentUser = user || guestUser

  useEffect(() => {
    console.log('Inicializando Unified Auth Provider...')
    
    // Configurar listener de mudanças de autenticação primeiro
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      console.log('Mudança de auth:', _event, session)
      setSession(session)
      setUser(session?.user ?? null)
      
      // Se o usuário acabou de se autenticar e temos dados guest, migrar
      if (_event === 'SIGNED_IN' && session?.user && guestUser) {
        setTimeout(() => {
          migrateGuestData(session.user);
        }, 0);
      }
      
      setLoading(false)
    })

    // Depois verificar sessão inicial
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Sessão inicial:', session)
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => {
      console.log('Limpando subscription do Unified Auth Provider')
      subscription.unsubscribe()
    }
  }, [guestUser, migrateGuestData])

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
