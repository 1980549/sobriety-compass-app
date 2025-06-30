
import React from "react";
import { useAuth } from "@/hooks/useAuth";
import MultiSobrietyDashboard from "@/components/MultiSobrietyDashboard";
import { ChatInterface } from "@/components/ChatInterface";
import { DashboardCharts } from "@/components/DashboardCharts";
import { ExportData } from "@/components/ExportData";
import { UserProfile } from "@/components/UserProfile";
import { DataPrivacy } from "@/components/DataPrivacy";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageSquare, Home, LogOut, BarChart3, Settings, User, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

const Index = () => {
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-3 sm:p-6">
          {/* Header otimizado para mobile */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 mb-4 sm:mb-6 pb-3 sm:pb-4 border-b dark:border-gray-700">
            <div>
              <h1 className="text-xl sm:text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Jornada de Sobriedade
              </h1>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mt-1">
                Bem-vindo, {user?.email || 'Usuário'}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <ThemeToggle />
              <Button
                variant="outline"
                onClick={handleSignOut}
                className="flex items-center space-x-2 text-sm"
                size="sm"
              >
                <LogOut className="w-4 h-4" />
                <span>Sair</span>
              </Button>
            </div>
          </div>

          <Tabs defaultValue="dashboard" className="w-full">
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-6 h-auto p-1">
              <TabsTrigger value="dashboard" className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm py-2">
                <Home className="w-4 h-4" />
                <span>Dashboard</span>
              </TabsTrigger>
              <TabsTrigger value="chat" className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm py-2">
                <MessageSquare className="w-4 h-4" />
                <span>Chat IA</span>
              </TabsTrigger>
              <TabsTrigger value="charts" className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm py-2">
                <BarChart3 className="w-4 h-4" />
                <span>Gráficos</span>
              </TabsTrigger>
              <TabsTrigger value="profile" className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm py-2">
                <User className="w-4 h-4" />
                <span>Perfil</span>
              </TabsTrigger>
              <TabsTrigger value="export" className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm py-2">
                <Settings className="w-4 h-4" />
                <span>Dados</span>
              </TabsTrigger>
              <TabsTrigger value="privacy" className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm py-2">
                <Shield className="w-4 h-4" />
                <span>Privacidade</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="dashboard" className="mt-4 sm:mt-6">
              <MultiSobrietyDashboard />
            </TabsContent>

            <TabsContent value="chat" className="mt-4 sm:mt-6">
              <ChatInterface />
            </TabsContent>

            <TabsContent value="charts" className="mt-4 sm:mt-6">
              <DashboardCharts />
            </TabsContent>

            <TabsContent value="profile" className="mt-4 sm:mt-6">
              <UserProfile />
            </TabsContent>

            <TabsContent value="export" className="mt-4 sm:mt-6">
              <ExportData />
            </TabsContent>

            <TabsContent value="privacy" className="mt-4 sm:mt-6">
              <DataPrivacy />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Index;
