
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Download, X } from 'lucide-react';

export const PWAInstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setShowPrompt(false);
    }
    
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('pwa-install-dismissed', 'true');
  };

  // Não mostrar se já foi dispensado
  if (localStorage.getItem('pwa-install-dismissed') === 'true') {
    return null;
  }

  if (!showPrompt) return null;

  return (
    <Card className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-80 p-4 shadow-lg z-50 bg-white border-indigo-200">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-2">
          <Download className="w-5 h-5 text-indigo-600" />
          <h4 className="font-semibold text-gray-900">Instalar App</h4>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleDismiss}
          className="p-1 h-auto"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>
      
      <p className="text-sm text-gray-600 mb-4">
        Instale o app em seu dispositivo para acesso offline e notificações.
      </p>
      
      <div className="flex space-x-2">
        <Button onClick={handleInstall} size="sm" className="flex-1">
          Instalar
        </Button>
        <Button onClick={handleDismiss} variant="outline" size="sm">
          Agora não
        </Button>
      </div>
    </Card>
  );
};
