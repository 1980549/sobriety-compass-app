
import { useAuth } from "@/hooks/useAuth";
import { AuthPages } from "@/components/AuthPages";
import { MultiSobrietyDashboard } from "@/components/MultiSobrietyDashboard";
import { ChatInterface } from "@/components/ChatInterface";
import { SecurityDashboard } from "@/components/SecurityDashboard";
import { TestSuite } from "@/components/TestSuite";
import { Documentation } from "@/components/Documentation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageSquare, Shield, TestTube, FileText, Home } from "lucide-react";

const Index = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return <AuthPages />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
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
