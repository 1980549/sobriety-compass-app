
import { ReactNode } from 'react'
import { useUnifiedAuth } from '@/hooks/useUnifiedAuth'

interface AuthGuardProps {
  children: ReactNode
  requireAuth?: boolean
}

export function AuthGuard({ children, requireAuth = false }: AuthGuardProps) {
  const { loading, currentUser, isGuest } = useUnifiedAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Carregando...</p>
        </div>
      </div>
    )
  }

  // Se não requer autenticação, sempre permitir acesso (guest ou autenticado)
  if (!requireAuth) {
    return <>{children}</>
  }

  // Se requer autenticação e não está logado, redirecionar
  if (requireAuth && isGuest) {
    // Implementar redirecionamento para login se necessário
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <p className="text-lg text-gray-600">Esta funcionalidade requer login.</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
