
import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { Session, User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import { useToast } from '@/hooks/use-toast'

interface AuthContextType {
  session: Session | null
  user: User | null
  loading: boolean
  signUp: (email: string, password: string, nome?: string) => Promise<void>
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    console.log('Inicializando Auth Provider...')
    
    // Configurar listener de mudanças de autenticação primeiro
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log('Mudança de auth:', _event, session)
      setSession(session)
      setUser(session?.user ?? null)
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
      console.log('Limpando subscription do Auth Provider')
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
    loading,
    signUp,
    signIn,
    signOut,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
