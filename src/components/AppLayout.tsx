
import { ReactNode } from 'react'
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "./AppSidebar"

interface AppLayoutProps {
  children: ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <AppSidebar />
        <SidebarInset className="flex-1">
          {/* Mobile trigger */}
          <header className="flex h-12 items-center border-b px-4 md:hidden">
            <SidebarTrigger className="mr-2" />
            <h1 className="text-lg font-semibold">Sobriety Compass</h1>
          </header>
          
          {/* Main content */}
          <main className="flex-1 p-4 md:p-6">
            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
