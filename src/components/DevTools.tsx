
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { TestSuite } from './TestSuite';
import { SecurityDashboard } from './SecurityDashboard';
import { Documentation } from './Documentation';
import { SystemAudit } from './SystemAudit';
import { Bug, Shield, FileText, CheckCircle } from 'lucide-react';

export const DevTools = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <Card className="p-6 mb-6">
          <h1 className="text-3xl font-bold mb-2">Ferramentas de Desenvolvimento</h1>
          <p className="text-gray-600 dark:text-gray-300">
            Ambiente de desenvolvimento e testes para a aplicação de sobriedade
          </p>
        </Card>

        <Tabs defaultValue="audit" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="audit" className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4" />
              <span>Auditoria</span>
            </TabsTrigger>
            <TabsTrigger value="tests" className="flex items-center space-x-2">
              <Bug className="w-4 h-4" />
              <span>Testes</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center space-x-2">
              <Shield className="w-4 h-4" />
              <span>Segurança</span>
            </TabsTrigger>
            <TabsTrigger value="docs" className="flex items-center space-x-2">
              <FileText className="w-4 h-4" />
              <span>Documentação</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="audit" className="mt-6">
            <SystemAudit />
          </TabsContent>

          <TabsContent value="tests" className="mt-6">
            <TestSuite />
          </TabsContent>

          <TabsContent value="security" className="mt-6">
            <SecurityDashboard />
          </TabsContent>

          <TabsContent value="docs" className="mt-6">
            <Documentation />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
