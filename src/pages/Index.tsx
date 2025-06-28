
import { AuthProvider } from '@/hooks/useAuth'
import { AuthGuard } from '@/components/AuthGuard'
import { MultiSobrietyDashboard } from '@/components/MultiSobrietyDashboard'

const Index = () => {
  return (
    <AuthProvider>
      <AuthGuard>
        <MultiSobrietyDashboard />
      </AuthGuard>
    </AuthProvider>
  )
}

export default Index
