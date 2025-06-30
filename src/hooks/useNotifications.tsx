
import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { useToast } from '@/hooks/use-toast';

export function useNotifications() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    setIsSupported('Notification' in window);
    if ('Notification' in window) {
      setPermission(Notification.permission);
    }
  }, []);

  const requestPermission = async () => {
    if (!isSupported) {
      toast({
        title: "Não suportado",
        description: "Seu navegador não suporta notificações.",
        variant: "destructive",
      });
      return false;
    }

    const result = await Notification.requestPermission();
    setPermission(result);
    
    if (result === 'granted') {
      toast({
        title: "Notificações ativadas!",
        description: "Você receberá lembretes importantes.",
      });
      return true;
    } else {
      toast({
        title: "Permissão negada",
        description: "Você pode ativar notificações nas configurações do navegador.",
        variant: "destructive",
      });
      return false;
    }
  };

  const sendNotification = (title: string, body: string, icon?: string) => {
    if (permission !== 'granted') return;

    const notification = new Notification(title, {
      body,
      icon: icon || '/favicon.ico',
      badge: '/favicon.ico',
      tag: 'sobriety-app',
    });

    notification.onclick = () => {
      window.focus();
      notification.close();
    };

    setTimeout(() => notification.close(), 5000);
  };

  const scheduleReminder = (message: string, delayMs: number) => {
    if (permission !== 'granted') return;

    setTimeout(() => {
      sendNotification('Lembrete de Sobriedade', message);
    }, delayMs);
  };

  const sendAchievementNotification = (achievementName: string) => {
    sendNotification(
      '🏆 Nova Conquista!',
      `Parabéns! Você desbloqueou: ${achievementName}`,
    );
  };

  const sendStreakNotification = (days: number, addictionType: string) => {
    sendNotification(
      '🔥 Streak Incrível!',
      `${days} dias sem ${addictionType}. Continue assim!`,
    );
  };

  return {
    permission,
    isSupported,
    requestPermission,
    sendNotification,
    scheduleReminder,
    sendAchievementNotification,
    sendStreakNotification,
  };
}
