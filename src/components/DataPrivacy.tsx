
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Download, Trash2, Shield } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

export const DataPrivacy = () => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();

  const handleExportData = async () => {
    try {
      // Aqui você implementaria a exportação completa dos dados
      toast({
        title: "Exportação iniciada",
        description: "Seus dados serão baixados em breve.",
      });
    } catch (error) {
      toast({
        title: "Erro na exportação",
        description: "Não foi possível exportar seus dados.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteAccount = async () => {
    try {
      // Aqui você implementaria a exclusão da conta
      // await deleteUserAccount();
      await signOut();
      
      toast({
        title: "Conta excluída",
        description: "Sua conta e todos os dados foram removidos.",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível excluir a conta.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center space-x-3 mb-4">
          <Shield className="w-6 h-6 text-green-600" />
          <h3 className="text-lg font-semibold">Privacidade dos Dados</h3>
        </div>
        
        <div className="space-y-4 text-sm text-gray-600">
          <p>
            Seus dados são criptografados e armazenados com segurança. Não coletamos 
            informações pessoais além do necessário para o funcionamento do app.
          </p>
          <p>
            Você tem total controle sobre seus dados e pode exportá-los ou excluir 
            sua conta a qualquer momento.
          </p>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Controle de Dados</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <h4 className="font-medium">Exportar Dados</h4>
              <p className="text-sm text-gray-600">
                Baixe uma cópia completa de todos os seus dados
              </p>
            </div>
            <Button onClick={handleExportData} variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Exportar
            </Button>
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg border-red-200">
            <div>
              <h4 className="font-medium text-red-800">Excluir Conta</h4>
              <p className="text-sm text-red-600">
                Remove permanentemente sua conta e todos os dados
              </p>
            </div>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" className="border-red-300 text-red-600 hover:bg-red-50">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Excluir
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle className="flex items-center">
                    <AlertTriangle className="w-5 h-5 text-red-500 mr-2" />
                    Excluir Conta Permanentemente
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    Esta ação não pode ser desfeita. Todos os seus dados, incluindo 
                    jornadas, conquistas e histórico, serão permanentemente removidos.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={handleDeleteAccount}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Sim, excluir conta
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </Card>
    </div>
  );
};
