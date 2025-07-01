
import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { User } from '@supabase/supabase-js'
import { GuestUser } from '@/types/user'

interface GuestAuthContextType {
  guestUser: GuestUser | null
  createGuestUser: () => void
  clearGuestUser: () => void
  migrateGuestData: (authenticatedUser: User) => Promise<void>
}

const GuestAuthContext = createContext<GuestAuthContextType | undefined>(undefined)

export function GuestAuthProvider({ children }: { children: ReactNode }) {
  const [guestUser, setGuestUser] = useState<GuestUser | null>(null)

  useEffect(() => {
    // Verificar se existe um usuário guest salvo
    const savedGuestUser = localStorage.getItem('guestUser')
    if (savedGuestUser) {
      try {
        setGuestUser(JSON.parse(savedGuestUser))
      } catch (error) {
        console.error('Erro ao carregar usuário guest:', error)
        localStorage.removeItem('guestUser')
      }
    } else {
      // Criar usuário guest automaticamente na primeira visita
      createGuestUser()
    }
  }, [])

  const createGuestUser = () => {
    const newGuestUser: GuestUser = {
      id: `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      email: 'guest@local.app',
      isGuest: true,
      display_name: 'Visitante'
    }
    
    setGuestUser(newGuestUser)
    localStorage.setItem('guestUser', JSON.stringify(newGuestUser))
  }

  const clearGuestUser = () => {
    setGuestUser(null)
    localStorage.removeItem('guestUser')
    localStorage.removeItem('guestData')
  }

  const migrateGuestData = async (authenticatedUser: User) => {
    // Recuperar dados do guest
    const guestData = localStorage.getItem('guestData')
    if (guestData && guestUser) {
      try {
        const parsedData = JSON.parse(guestData)
        console.log('Migrando dados do guest para usuário autenticado:', parsedData)
        
        // Aqui você pode implementar a lógica para migrar os dados
        // Para o banco de dados do usuário autenticado
        // Por exemplo: criar registros de sobriedade, humor, etc.
        
        // Limpar dados do guest após migração
        clearGuestUser()
      } catch (error) {
        console.error('Erro ao migrar dados do guest:', error)
      }
    }
  }

  const value = {
    guestUser,
    createGuestUser,
    clearGuestUser,
    migrateGuestData,
  }

  return <GuestAuthContext.Provider value={value}>{children}</GuestAuthContext.Provider>
}

export function useGuestAuth() {
  const context = useContext(GuestAuthContext)
  if (context === undefined) {
    throw new Error('useGuestAuth must be used within a GuestAuthProvider')
  }
  return context
}
