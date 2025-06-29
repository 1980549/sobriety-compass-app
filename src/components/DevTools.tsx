
import { SecurityDashboard } from "./SecurityDashboard"
import { TestSuite } from "./TestSuite"
import { Documentation } from "./Documentation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Shield, TestTube, FileText } from "lucide-react"

/**
 * Componente de ferramentas de desenvolvimento
 * Acesso restrito apenas para ambiente de desenvolvimento
 */
export function DevTools() {
  // Verifica se está em ambiente de desenvolvimento
  const isDevelopment = import.meta.env.DEV

  if (!isDevelopment) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Acesso negado. Ferramentas disponíveis apenas em desenvolvimento.</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Ferramentas de Desenvolvimento
          </h1>
          <p className="text-gray-600">
            Painel administrativo para monitoramento e testes
          </p>
        </div>

        <Tabs defaultValue="security" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
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
              <span>Documentação</span>
            </TabsTrigger>
          </TabsList>

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
  )
}
