
import { useLocation, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'

export type AppRoute = 'dashboard' | 'chat' | 'charts' | 'profile' | 'export' | 'privacy'

export function useAppNavigation() {
  const location = useLocation()
  const navigate = useNavigate()
  
  const searchParams = new URLSearchParams(location.search)
  const currentTab = (searchParams.get('tab') || 'dashboard') as AppRoute
  
  const navigateTo = (tab: AppRoute) => {
    if (tab === 'dashboard') {
      navigate('/', { replace: true })
    } else {
      navigate(`/?tab=${tab}`, { replace: true })
    }
  }
  
  return {
    currentTab,
    navigateTo
  }
}
