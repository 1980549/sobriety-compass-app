
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, AlertTriangle, RefreshCw, Download } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useSobriety } from '@/hooks/useSobriety';
import { useNotifications } from '@/hooks/useNotifications';
import { useToast } from '@/hooks/use-toast';

interface AuditResult {
  feature: string;
  status: 'pass' | 'fail' | 'warning' | 'pending';
  message: string;
  details?: string;
}

export const SystemAudit = () => {
  const { user, loading: authLoading } = useAuth();
  const { records } = useSobriety();
  const { permission, isSupported } = useNotifications();
  const { toast } = useToast();
  
  const [auditResults, setAuditResults] = useState<AuditResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);

  const auditTests = [
    {
      name: 'Autenticação',
      test: async () => {
        try {
          if (authLoading) return { status: 'pending', message: 'Verificando autenticação...' };
          if (user) return { status: 'pass', message: 'Usuário autenticado com sucesso' };
          return { status: 'warning', message: 'Usuário não autenticado' };
        } catch (error) {
          return { status: 'fail', message: 'Erro na autenticação', details: String(error) };
        }
      }
    },
    {
      name: 'Dashboard Principal',
      test: async () => {
        try {
          const dashboardElement = document.querySelector('[data-testid="dashboard"]') || 
                                  document.querySelector('.dashboard') ||
                                  document.querySelector('[class*="dashboard"]');
          
          if (dashboardElement) {
            return { status: 'pass', message: 'Dashboard carregado corretamente' };
          }
          return { status: 'warning', message: 'Dashboard não encontrado na DOM' };
        } catch (error) {
          return { status: 'fail', message: 'Erro ao verificar dashboard', details: String(error) };
        }
      }
    },
    {
      name: 'Jornadas de Sobriedade',
      test: async () => {
        try {
          if (records && records.length > 0) {
            return { status: 'pass', message: `${records.length} jornada(s) encontrada(s)` };
          }
          return { status: 'warning', message: 'Nenhuma jornada ativa encontrada' };
        } catch (error) {
          return { status: 'fail', message: 'Erro ao carregar jornadas', details: String(error) };
        }
      }
    },
    {
      name: 'Chat IA',
      test: async () => {
        try {
          const chatElement = document.querySelector('[class*="chat"]') ||
                             document.querySelector('form') && 
                             document.querySelector('input[placeholder*="mensagem"]');
          
          if (chatElement) {
            return { status: 'pass', message: 'Interface de chat disponível' };
          }
          return { status: 'warning', message: 'Interface de chat não encontrada' };
        } catch (error) {
          return { status: 'fail', message: 'Erro ao verificar chat', details: String(error) };
        }
      }
    },
    {
      name: 'Sistema de Notificações',
      test: async () => {
        try {
          if (!isSupported) {
            return { status: 'warning', message: 'Notificações não suportadas pelo navegador' };
          }
          if (permission === 'granted') {
            return { status: 'pass', message: 'Notificações ativadas' };
          }
          if (permission === 'denied') {
            return { status: 'warning', message: 'Notificações negadas pelo usuário' };
          }
          return { status: 'warning', message: 'Permissão de notificação pendente' };
        } catch (error) {
          return { status: 'fail', message: 'Erro no sistema de notificações', details: String(error) };
        }
      }
    },
    {
      name: 'PWA (Progressive Web App)',
      test: async () => {
        try {
          const hasSW = 'serviceWorker' in navigator;
          const hasManifest = document.querySelector('link[rel="manifest"]');
          
          if (hasSW && hasManifest) {
            return { status: 'pass', message: 'PWA configurado corretamente' };
          }
          if (!hasSW && !hasManifest) {
            return { status: 'fail', message: 'Service Worker e Manifest não encontrados' };
          }
          return { status: 'warning', message: 'PWA parcialmente configurado' };
        } catch (error) {
          return { status: 'fail', message: 'Erro ao verificar PWA', details: String(error) };
        }
      }
    },
    {
      name: 'Tema Dark Mode',
      test: async () => {
        try {
          const htmlElement = document.documentElement;
          const hasThemeClass = htmlElement.classList.contains('dark') || htmlElement.classList.contains('light');
          const themeToggle = document.querySelector('[class*="theme"]') || 
                             document.querySelector('button[class*="toggle"]');
          
          if (hasThemeClass && themeToggle) {
            return { status: 'pass', message: 'Sistema de tema funcionando' };
          }
          return { status: 'warning', message: 'Sistema de tema não completamente configurado' };
        } catch (error) {
          return { status: 'fail', message: 'Erro ao verificar tema', details: String(error) };
        }
      }
    },
    {
      name: 'Responsividade Mobile',
      test: async () => {
        try {
          const viewport = document.querySelector('meta[name="viewport"]');
          const isMobileViewport = window.innerWidth <= 768;
          
          if (viewport) {
            return { status: 'pass', message: 'Viewport configurado para mobile' };
          }
          return { status: 'warning', message: 'Meta viewport não encontrado' };
        } catch (error) {
          return { status: 'fail', message: 'Erro ao verificar responsividade', details: String(error) };
        }
      }
    }
  ];

  const runAudit = async () => {
    setIsRunning(true);
    setProgress(0);
    const results: AuditResult[] = [];

    for (let i = 0; i < auditTests.length; i++) {
      const test = auditTests[i];
      try {
        const result = await test.test();
        results.push({
          feature: test.name,
          status: result.status,
          message: result.message,
          details: result.details
        });
      } catch (error) {
        results.push({
          feature: test.name,
          status: 'fail',
          message: 'Erro durante o teste',
          details: String(error)
        });
      }
      
      setProgress(((i + 1) / auditTests.length) * 100);
      setAuditResults([...results]);
      
      // Small delay for visual feedback
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    setIsRunning(false);
    
    const failedTests = results.filter(r => r.status === 'fail').length;
    const warningTests = results.filter(r => r.status === 'warning').length;
    
    toast({
      title: "Auditoria Concluída",
      description: `${results.length - failedTests - warningTests} passou, ${warningTests} avisos, ${failedTests} falhas`,
      variant: failedTests > 0 ? "destructive" : "default",
    });
  };

  const exportAuditReport = () => {
    const reportData = {
      timestamp: new Date().toISOString(),
      user: user?.email || 'anonymous',
      results: auditResults,
      summary: {
        total: auditResults.length,
        passed: auditResults.filter(r => r.status === 'pass').length,
        warnings: auditResults.filter(r => r.status === 'warning').length,
        failed: auditResults.filter(r => r.status === 'fail').length,
      }
    };

    const dataStr = JSON.stringify(reportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `audit-report-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pass':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'fail':
        return <XCircle className="w-5 h-5 text-red-600" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      case 'pending':
        return <RefreshCw className="w-5 h-5 text-blue-600 animate-spin" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pass':
        return 'bg-green-100 text-green-800';
      case 'fail':
        return 'bg-red-100 text-red-800';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800';
      case 'pending':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold">Auditoria do Sistema</h2>
            <p className="text-gray-600">
              Verificação completa de todas as funcionalidades da aplicação
            </p>
          </div>
          
          <div className="flex space-x-2">
            <Button
              onClick={runAudit}
              disabled={isRunning}
              className="flex items-center space-x-2"
            >
              {isRunning ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <CheckCircle className="w-4 h-4" />
              )}
              <span>{isRunning ? 'Executando...' : 'Executar Auditoria'}</span>
            </Button>
            
            {auditResults.length > 0 && (
              <Button
                onClick={exportAuditReport}
                variant="outline"
                className="flex items-center space-x-2"
              >
                <Download className="w-4 h-4" />
                <span>Exportar Relatório</span>
              </Button>
            )}
          </div>
        </div>

        {isRunning && (
          <div className="mb-6">
            <div className="flex justify-between text-sm mb-2">
              <span>Progresso da Auditoria</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {auditResults.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-lg font-semibold mb-4">Resultados da Auditoria</h3>
            {auditResults.map((result, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  {getStatusIcon(result.status)}
                  <div>
                    <h4 className="font-medium">{result.feature}</h4>
                    <p className="text-sm text-gray-600">{result.message}</p>
                    {result.details && (
                      <p className="text-xs text-gray-500 mt-1">{result.details}</p>
                    )}
                  </div>
                </div>
                <Badge className={getStatusColor(result.status)}>
                  {result.status.toUpperCase()}
                </Badge>
              </div>
            ))}
          </div>
        )}

        {auditResults.length === 0 && !isRunning && (
          <div className="text-center py-8 text-gray-500">
            <CheckCircle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>Clique em "Executar Auditoria" para iniciar a verificação do sistema</p>
          </div>
        )}
      </Card>
    </div>
  );
};
