
import { useAuth } from "@/hooks/useAuth";
import { MultiSobrietyDashboard } from "@/components/MultiSobrietyDashboard";
import { ChatInterface } from "@/components/ChatInterface";
import { SecurityDashboard } from "@/components/SecurityDashboard";
import { TestSuite } from "@/components/TestSuite";
import { Documentation } from "@/components/Documentation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageSquare, Shield, TestTube, FileText, Home, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

const Index = () => {
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          {/* Header com informações do usuário e logout */}
          <div className="flex justify-between items-center mb-6 pb-4 border-b">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Jornada de Sobriedade
              </h1>
              <p className="text-gray-600 mt-1">
                Bem-vindo, {user?.email || 'Usuário'}
              </p>
            </div>
            <Button
              variant="outline"
              onClick={handleSignOut}
              className="flex items-center space-x-2"
            >
              <LogOut className="w-4 h-4" />
              <span>Sair</span>
            </Button>
          </div>

          <Tabs defaultValue="dashboard" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="dashboard" className="flex items-center space-x-2">
                <Home className="w-4 h-4" />
                <span>Dashboard</span>
              </TabsTrigger>
              <TabsTrigger value="chat" className="flex items-center space-x-2">
                <MessageSquare className="w-4 h-4" />
                <span>Chat IA</span>
              </TabsTrigger>
              <TabsTrigger value="security" className="flex items-center space-x-2">
                <Shield className="w-4 h-4" />
                <span>Segurança</span>
              </TabsTrigger>
              <TabsTrigger value="tests" className="flex items-center space-x-2">
                <TestTube className="w-4 h-4" />
                <span>Testes</span>
              </TabsTrigger>
              <TabsTrigger value="docs" className="flex items-center space-x-2">
                <FileText className="w-4 h-4" />
                <span>Docs</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="dashboard" className="mt-6">
              <MultiSobrietyDashboard />
            </TabsContent>

            <TabsContent value="chat" className="mt-6">
              <ChatInterface />
            </TabsContent>

            <TabsContent value="security" className="mt-6">
              <SecurityDashboard />
            </TabsContent>

            <TabsContent value="tests" className="mt-6">
              <TestSuite />
            </TabsContent>

            <TabsContent value="docs" className="mt-6">
              <Documentation />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Index;
