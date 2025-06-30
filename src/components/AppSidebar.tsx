
import { useState } from "react"
import { useLocation } from "react-router-dom"
import { 
  Home, 
  MessageSquare, 
  BarChart3, 
  User, 
  Settings, 
  Shield, 
  LogIn, 
  LogOut,
  Moon,
  Sun,
  UserPlus
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { useUnifiedAuth } from "@/hooks/useUnifiedAuth"
import { useTheme } from "@/contexts/ThemeContext"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useAppNavigation, AppRoute } from "@/hooks/useAppNavigation"

const menuItems: { title: string; route: AppRoute; icon: any }[] = [
  { title: "Dashboard", route: "dashboard", icon: Home },
  { title: "Chat IA", route: "chat", icon: MessageSquare },
  { title: "Gráficos", route: "charts", icon: BarChart3 },
  { title: "Perfil", route: "profile", icon: User },
  { title: "Dados", route: "export", icon: Settings },
  { title: "Privacidade", route: "privacy", icon: Shield },
]

export function AppSidebar() {
  const { collapsed } = useSidebar()
  const { currentUser, isGuest, signOut, loading } = useUnifiedAuth()
  const { theme, toggleTheme } = useTheme()
  const { currentTab, navigateTo } = useAppNavigation()
  const [showAuthModal, setShowAuthModal] = useState(false)

  const handleSignOut = async () => {
    await signOut()
  }

  const getInitials = (name: string) => {
    if (!name) return "?"
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  }

  return (
    <Sidebar className="border-r border-border">
      <SidebarHeader className="p-4">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-bold">🌟</span>
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <h2 className="text-lg font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent truncate">
                Sobriety Compass
              </h2>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu Principal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    isActive={currentTab === item.route}
                    onClick={() => navigateTo(item.route)}
                  >
                    <item.icon className="h-4 w-4" />
                    {!collapsed && <span>{item.title}</span>}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Configurações</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={toggleTheme}>
                  {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                  {!collapsed && <span>Tema {theme === 'dark' ? 'Claro' : 'Escuro'}</span>}
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <div className="space-y-2">
          {/* User Info */}
          <div className="flex items-center space-x-3">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="text-xs">
                {getInitials(currentUser?.display_name || currentUser?.email || 'U')}
              </AvatarFallback>
            </Avatar>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  {isGuest ? 'Visitante' : (currentUser?.display_name || currentUser?.email?.split('@')[0])}
                </p>
                {isGuest && (
                  <Badge variant="secondary" className="text-xs">
                    Modo Guest
                  </Badge>
                )}
              </div>
            )}
          </div>

          {/* Auth Actions */}
          <div className="space-y-2">
            {isGuest ? (
              <div className="space-y-1">
                <Button 
                  variant="default" 
                  size="sm" 
                  className="w-full justify-start"
                  onClick={() => window.location.href = '/auth'}
                >
                  <LogIn className="h-4 w-4 mr-2" />
                  {!collapsed && "Entrar"}
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full justify-start"
                  onClick={() => window.location.href = '/auth'}
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  {!collapsed && "Criar Conta"}
                </Button>
              </div>
            ) : (
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full justify-start"
                onClick={handleSignOut}
                disabled={loading}
              >
                <LogOut className="h-4 w-4 mr-2" />
                {!collapsed && "Sair"}
              </Button>
            )}
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
