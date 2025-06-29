
import React from "react";
import { useAuth } from "@/hooks/useAuth";
import MultiSobrietyDashboard from "@/components/MultiSobrietyDashboard";
import { ChatInterface } from "@/components/ChatInterface";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageSquare, Home, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

const Index = () => {
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
        <div className="bg-white rounded-lg shadow-lg p-3 sm:p-6">
          {/* Header otimizado para mobile */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 mb-4 sm:mb-6 pb-3 sm:pb-4 border-b">
            <div>
              <h1 className="text-xl sm:text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Jornada de Sobriedade
              </h1>
              <p className="text-sm sm:text-base text-gray-600 mt-1">
                Bem-vindo, {user?.email || 'Usuário'}
              </p>
            </div>
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

          <Tabs defaultValue="dashboard" className="w-full">
            <TabsList className="grid w-full grid-cols-2 h-auto p-1">
              <TabsTrigger value="dashboard" className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm py-2">
                <Home className="w-4 h-4" />
                <span>Dashboard</span>
              </TabsTrigger>
              <TabsTrigger value="chat" className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm py-2">
                <MessageSquare className="w-4 h-4" />
                <span>Chat IA</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="dashboard" className="mt-4 sm:mt-6">
              <MultiSobrietyDashboard />
            </TabsContent>

            <TabsContent value="chat" className="mt-4 sm:mt-6">
              <ChatInterface />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Index;
