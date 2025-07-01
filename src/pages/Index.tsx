
import React from "react";
import { useUnifiedAuth } from "@/hooks/useUnifiedAuth";
import MultiSobrietyDashboard from "@/components/MultiSobrietyDashboard";
import { ChatInterface } from "@/components/ChatInterface";
import { DashboardCharts } from "@/components/DashboardCharts";
import { ExportData } from "@/components/ExportData";
import { UserProfile } from "@/components/UserProfile";
import { DataPrivacy } from "@/components/DataPrivacy";
import { useLocation } from "react-router-dom";
import { getDisplayName } from "@/types/user";

const Index = () => {
  const { currentUser, isGuest } = useUnifiedAuth();
  const location = useLocation();
  
  // Determinar qual componente mostrar baseado na URL
  const getCurrentComponent = () => {
    const path = location.pathname;
    const searchParams = new URLSearchParams(location.search);
    const tab = searchParams.get('tab') || 'dashboard';
    
    switch (tab) {
      case 'chat':
        return <ChatInterface />;
      case 'charts':
        return <DashboardCharts />;
      case 'profile':
        return <UserProfile />;
      case 'export':
        return <ExportData />;
      case 'privacy':
        return <DataPrivacy />;
      default:
        return <MultiSobrietyDashboard />;
    }
  };

  return (
    <div className="w-full">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-3 sm:p-6">
        {/* Header simplificado */}
        <div className="mb-4 sm:mb-6 pb-3 sm:pb-4 border-b dark:border-gray-700">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              {isGuest ? 'Bem-vindo, Visitante!' : 'Jornada de Sobriedade'}
            </h1>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mt-1">
              {isGuest 
                ? 'Experimente todas as funcionalidades. Faça login para sincronizar seus dados!'
                : `Olá, ${getDisplayName(currentUser)}`
              }
            </p>
          </div>
        </div>

        {/* Conteúdo baseado na navegação */}
        <div className="w-full">
          {getCurrentComponent()}
        </div>
      </div>
    </div>
  );
};

export default Index;
