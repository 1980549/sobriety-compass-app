
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { User, Target, Smile } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

const avatarEmojis = ['😊', '😎', '🌟', '💪', '🚀', '🎯', '🌈', '⚡', '🔥', '✨'];
const moodEmojis = ['😢', '😕', '😐', '😊', '😄'];

export const UserProfile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedAvatar, setSelectedAvatar] = useState('😊');
  const [personalGoals, setPersonalGoals] = useState('');
  const [motivationText, setMotivationText] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Aqui você salvaria no backend
      // await updateUserProfile({ avatar: selectedAvatar, goals: personalGoals, motivation: motivationText });
      
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

      <Button onClick={handleSave} disabled={isSaving} className="w-full">
        {isSaving ? 'Salvando...' : 'Salvar Configurações'}
      </Button>
    </div>
  );
};
