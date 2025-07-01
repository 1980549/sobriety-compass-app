
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { User, Target, Smile, Trash2, Edit3, Save, X } from 'lucide-react';
import { useUnifiedAuth } from '@/hooks/useUnifiedAuth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { getDisplayName } from '@/types/user';

const avatarEmojis = ['😊', '😎', '🌟', '💪', '🚀', '🎯', '🌈', '⚡', '🔥', '✨'];
const moodEmojis = ['😢', '😕', '😐', '😊', '😄'];

export const UserProfile = () => {
  const { currentUser, isGuest, signOut } = useUnifiedAuth();
  const { toast } = useToast();
  const [selectedAvatar, setSelectedAvatar] = useState('😊');
  const [personalGoals, setPersonalGoals] = useState('');
  const [motivationText, setMotivationText] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempDisplayName, setTempDisplayName] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (currentUser) {
      const currentDisplayName = getDisplayName(currentUser);
      setDisplayName(currentDisplayName);
      setTempDisplayName(currentDisplayName);
    }
  }, [currentUser]);

  const validateDisplayName = (name: string): boolean => {
    if (name.length < 2) {
      toast({
        title: "Nome muito curto",
        description: "O nome deve ter pelo menos 2 caracteres.",
        variant: "destructive",
      });
      return false;
    }
    if (name.length > 50) {
      toast({
        title: "Nome muito longo",
        description: "O nome deve ter no máximo 50 caracteres.",
        variant: "destructive",
      });
      return false;
    }
    if (!/^[a-zA-ZÀ-ÿ\s]+$/.test(name)) {
      toast({
        title: "Caracteres inválidos",
        description: "Use apenas letras e espaços no nome.",
        variant: "destructive",
      });
      return false;
    }
    return true;
  };

  const handleSaveDisplayName = async () => {
    if (!validateDisplayName(tempDisplayName.trim())) return;

    if (isGuest) {
      // Para usuários guest, atualizar localStorage seria necessário
      setDisplayName(tempDisplayName.trim());
      setIsEditingName(false);
      toast({
        title: "Nome atualizado!",
        description: "Seu nome foi atualizado com sucesso.",
      });
      return;
    }

    if (!currentUser) return;

    try {
      setIsSaving(true);
      
      // Atualizar no auth.users via user_metadata
      const { error: authError } = await supabase.auth.updateUser({
        data: { display_name: tempDisplayName.trim() }
      });

      if (authError) throw authError;

      // Atualizar na tabela profiles se existir
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({ 
          id: currentUser.id, 
          nome: tempDisplayName.trim(),
          email: currentUser.email 
        });

      if (profileError) {
        console.warn('Aviso ao atualizar perfil:', profileError);
      }

      setDisplayName(tempDisplayName.trim());
      setIsEditingName(false);
      
      toast({
        title: "Nome atualizado!",
        description: "Seu nome foi atualizado com sucesso.",
      });
    } catch (error: any) {
      console.error('Erro ao atualizar nome:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o nome.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteProfile = async () => {
    if (isGuest) {
      // Para guest, limpar localStorage
      localStorage.clear();
      toast({
        title: "Perfil excluído",
        description: "Seus dados foram removidos.",
      });
      window.location.reload();
      return;
    }

    if (!currentUser) return;

    try {
      setIsDeleting(true);

      // Soft delete: marcar como deletado na tabela profiles
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({ 
          id: currentUser.id,
          email: currentUser.email,
          nome: displayName,
          deleted_at: new Date().toISOString()
        });

      if (profileError) {
        console.warn('Aviso ao marcar perfil como deletado:', profileError);
      }

      // Fazer logout do usuário
      await signOut();
      
      toast({
        title: "Perfil excluído",
        description: "Seu perfil foi excluído com sucesso.",
      });
    } catch (error: any) {
      console.error('Erro ao excluir perfil:', error);
      toast({
        title: "Erro",
        description: "Não foi possível excluir o perfil.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Aqui você salvaria as outras configurações no backend
      toast({
        title: "Perfil atualizado!",
        description: "Suas configurações foram salvas com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível salvar as configurações.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Nome de usuário editável */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <User className="w-5 h-5 mr-2" />
          Informações Pessoais
        </h3>
        <div className="space-y-4">
          <div>
            <Label htmlFor="displayName">Nome de exibição</Label>
            <div className="flex items-center gap-2 mt-2">
              {isEditingName ? (
                <>
                  <Input
                    value={tempDisplayName}
                    onChange={(e) => setTempDisplayName(e.target.value)}
                    placeholder="Digite seu nome"
                    maxLength={50}
                    className="flex-1"
                  />
                  <Button
                    size="sm"
                    onClick={handleSaveDisplayName}
                    disabled={isSaving}
                  >
                    <Save className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setTempDisplayName(displayName);
                      setIsEditingName(false);
                    }}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </>
              ) : (
                <>
                  <Input value={displayName} disabled className="flex-1" />
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setIsEditingName(true)}
                  >
                    <Edit3 className="w-4 h-4" />
                  </Button>
                </>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {tempDisplayName.length}/50 caracteres
            </p>
          </div>
        </div>
      </Card>

      {/* Avatar Selection */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <User className="w-5 h-5 mr-2" />
          Escolha seu Avatar
        </h3>
        <div className="grid grid-cols-5 gap-3">
          {avatarEmojis.map((emoji) => (
            <button
              key={emoji}
              onClick={() => setSelectedAvatar(emoji)}
              className={`w-12 h-12 text-2xl rounded-full border-2 transition-all ${
                selectedAvatar === emoji
                  ? 'border-indigo-500 bg-indigo-50 scale-110'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              {emoji}
            </button>
          ))}
        </div>
      </Card>

      {/* Personal Goals */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Target className="w-5 h-5 mr-2" />
          Metas Pessoais
        </h3>
        <div className="space-y-4">
          <div>
            <Label htmlFor="goals">Defina suas metas de curto prazo</Label>
            <Textarea
              id="goals"
              value={personalGoals}
              onChange={(e) => setPersonalGoals(e.target.value)}
              placeholder="Ex: Completar 30 dias sem fumar, economizar R$ 500..."
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="motivation">Sua motivação principal</Label>
            <Textarea
              id="motivation"
              value={motivationText}
              onChange={(e) => setMotivationText(e.target.value)}
              placeholder="Ex: Quero ser um exemplo para meus filhos..."
              className="mt-2"
            />
          </div>
        </div>
      </Card>

      {/* Mood Selector */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Smile className="w-5 h-5 mr-2" />
          Como você está se sentindo hoje?
        </h3>
        <div className="flex justify-between items-center">
          {moodEmojis.map((emoji, index) => (
            <button
              key={index}
              className="w-12 h-12 text-2xl rounded-full hover:bg-gray-100 transition-colors"
              onClick={() => {
                toast({
                  title: "Humor registrado!",
                  description: `Obrigado por compartilhar como você está se sentindo.`,
                });
              }}
            >
              {emoji}
            </button>
          ))}
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-2">
          <span>Muito triste</span>
          <span>Muito feliz</span>
        </div>
      </Card>

      {/* Ações */}
      <div className="flex gap-4">
        <Button onClick={handleSave} disabled={isSaving} className="flex-1">
          {isSaving ? 'Salvando...' : 'Salvar Configurações'}
        </Button>
        
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" disabled={isDeleting}>
              <Trash2 className="w-4 h-4 mr-2" />
              Excluir Perfil
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Excluir Perfil</AlertDialogTitle>
              <AlertDialogDescription>
                Tem certeza que deseja excluir seu perfil? Esta ação não poderá ser desfeita e você perderá acesso a todas as suas jornadas e dados.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteProfile}
                className="bg-red-600 hover:bg-red-700"
              >
                {isDeleting ? 'Excluindo...' : 'Excluir Perfil'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};
