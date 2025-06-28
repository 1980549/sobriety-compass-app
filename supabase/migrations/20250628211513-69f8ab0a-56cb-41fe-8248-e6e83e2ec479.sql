
-- Habilitar extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabela de tipos de vícios (se não existir)
CREATE TABLE IF NOT EXISTS public.addiction_types (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  icon TEXT DEFAULT '🚫',
  color TEXT DEFAULT '#6366f1',
  created_by_user UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de perfis de usuário (se não existir)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  nome TEXT,
  data_cadastro TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de jornadas de sobriedade (se não existir)
CREATE TABLE IF NOT EXISTS public.sobriety_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  user_email TEXT,
  addiction_type_id UUID REFERENCES public.addiction_types(id) ON DELETE CASCADE,
  start_date DATE NOT NULL,
  current_streak_days INTEGER DEFAULT 0,
  best_streak_days INTEGER DEFAULT 0,
  total_relapses INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  daily_cost DECIMAL,
  personal_goal TEXT,
  motivation_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de histórico de humor (se não existir)
CREATE TABLE IF NOT EXISTS public.mood_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  mood_value INTEGER NOT NULL CHECK (mood_value >= 1 AND mood_value <= 5),
  notes TEXT,
  entry_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, entry_date)
);

-- NOVAS TABELAS PARA FUNCIONALIDADES AVANÇADAS

-- 1. Sistema de lembretes
CREATE TABLE public.user_reminders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT,
  reminder_time TIME NOT NULL,
  days_of_week INTEGER[] DEFAULT '{1,2,3,4,5,6,7}',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Sistema de diário
CREATE TABLE public.journal_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  sobriety_record_id UUID REFERENCES public.sobriety_records(id) ON DELETE SET NULL,
  title TEXT,
  content TEXT NOT NULL,
  mood_before INTEGER CHECK (mood_before >= 1 AND mood_before <= 5),
  mood_after INTEGER CHECK (mood_after >= 1 AND mood_after <= 5),
  triggers TEXT[],
  coping_strategies TEXT[],
  gratitude_items TEXT[],
  entry_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE public.common_triggers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  category TEXT,
  icon TEXT DEFAULT '⚠️'
);

CREATE TABLE public.coping_strategies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  category TEXT,
  icon TEXT DEFAULT '💪',
  description TEXT
);

-- 3. Sistema de conquistas
CREATE TABLE public.achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT DEFAULT '🏆',
  category TEXT,
  requirement_type TEXT NOT NULL,
  requirement_value INTEGER NOT NULL,
  badge_color TEXT DEFAULT '#ffd700'
);

CREATE TABLE public.user_achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  achievement_id UUID REFERENCES public.achievements(id) ON DELETE CASCADE,
  sobriety_record_id UUID REFERENCES public.sobriety_records(id) ON DELETE CASCADE,
  earned_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, achievement_id, sobriety_record_id)
);

-- 4. Sistema de apoio
CREATE TABLE public.emergency_contacts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  relationship TEXT,
  is_primary BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE public.support_resources (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL,
  contact_info TEXT,
  url TEXT,
  availability TEXT,
  is_emergency BOOLEAN DEFAULT FALSE,
  country_code TEXT DEFAULT 'BR'
);

-- 5. Métricas diárias
CREATE TABLE public.daily_metrics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE DEFAULT CURRENT_DATE,
  stress_level INTEGER CHECK (stress_level >= 1 AND stress_level <= 5),
  energy_level INTEGER CHECK (energy_level >= 1 AND energy_level <= 5),
  motivation_level INTEGER CHECK (motivation_level >= 1 AND motivation_level <= 5),
  sleep_hours DECIMAL,
  exercise_minutes INTEGER DEFAULT 0,
  meditation_minutes INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, date)
);

-- 6. Configurações do usuário
CREATE TABLE public.user_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  theme TEXT DEFAULT 'light',
  language TEXT DEFAULT 'pt-BR',
  timezone TEXT DEFAULT 'America/Sao_Paulo',
  notifications_enabled BOOLEAN DEFAULT TRUE,
  reminder_frequency TEXT DEFAULT 'daily',
  privacy_level TEXT DEFAULT 'private',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. Sistema social (opcional)
CREATE TABLE public.support_groups (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  addiction_type_id UUID REFERENCES public.addiction_types(id),
  is_private BOOLEAN DEFAULT TRUE,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE public.group_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  group_id UUID REFERENCES public.support_groups(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'member',
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(group_id, user_id)
);

-- Habilitar RLS em todas as tabelas
ALTER TABLE public.addiction_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sobriety_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mood_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.journal_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.common_triggers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coping_strategies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.emergency_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_members ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para tabelas existentes
CREATE POLICY "Anyone can view default addiction types" ON public.addiction_types
  FOR SELECT USING (created_by_user IS NULL OR auth.uid() = created_by_user);

CREATE POLICY "Users can create custom addiction types" ON public.addiction_types
  FOR INSERT WITH CHECK (auth.uid() = created_by_user);

CREATE POLICY "Users can update own custom addiction types" ON public.addiction_types
  FOR UPDATE USING (auth.uid() = created_by_user);

CREATE POLICY "Users can delete own custom addiction types" ON public.addiction_types
  FOR DELETE USING (auth.uid() = created_by_user);

CREATE POLICY "Users can manage own sobriety records" ON public.sobriety_records
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own mood history" ON public.mood_history
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own profile" ON public.profiles
  FOR ALL USING (auth.uid() = id);

-- Políticas RLS para novas tabelas
CREATE POLICY "Users can manage own reminders" ON public.user_reminders
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own journal entries" ON public.journal_entries
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Everyone can view common triggers" ON public.common_triggers
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Everyone can view coping strategies" ON public.coping_strategies
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Everyone can view achievements" ON public.achievements
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can manage own achievements" ON public.user_achievements
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own emergency contacts" ON public.emergency_contacts
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Everyone can view support resources" ON public.support_resources
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can manage own daily metrics" ON public.daily_metrics
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own settings" ON public.user_settings
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view public groups" ON public.support_groups
  FOR SELECT USING (NOT is_private OR created_by = auth.uid());

CREATE POLICY "Users can create groups" ON public.support_groups
  FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can manage own groups" ON public.support_groups
  FOR UPDATE USING (auth.uid() = created_by);

CREATE POLICY "Group members can view memberships" ON public.group_members
  FOR SELECT USING (auth.uid() = user_id OR EXISTS (
    SELECT 1 FROM public.support_groups 
    WHERE id = group_id AND created_by = auth.uid()
  ));

CREATE POLICY "Users can join groups" ON public.group_members
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Popular dados iniciais
INSERT INTO public.addiction_types (name, icon, color) VALUES
  ('Cigarro/Tabaco', '🚬', '#ef4444'),
  ('Álcool', '🍺', '#f97316'),
  ('Drogas', '💊', '#dc2626'),
  ('Apostas', '🎰', '#7c3aed'),
  ('Compras Compulsivas', '🛍️', '#ec4899'),
  ('Redes Sociais', '📱', '#3b82f6'),
  ('Jogos', '🎮', '#10b981'),
  ('Comida', '🍔', '#f59e0b'),
  ('Outro', '❓', '#6b7280')
ON CONFLICT DO NOTHING;

-- Popular gatilhos comuns
INSERT INTO public.common_triggers (name, category, icon) VALUES
  ('Estresse', 'Emocional', '😰'),
  ('Tédio', 'Emocional', '😴'),
  ('Ansiedade', 'Emocional', '😟'),
  ('Solidão', 'Social', '😢'),
  ('Pressão Social', 'Social', '👥'),
  ('Trabalho', 'Situacional', '💼'),
  ('Problemas Financeiros', 'Situacional', '💰'),
  ('Discussões', 'Relacionamento', '😡'),
  ('Cansaço', 'Físico', '😴'),
  ('Dor', 'Físico', '🤕')
ON CONFLICT DO NOTHING;

-- Popular estratégias de enfrentamento
INSERT INTO public.coping_strategies (name, category, icon, description) VALUES
  ('Respiração Profunda', 'Relaxamento', '🧘', 'Técnica de respiração para reduzir ansiedade'),
  ('Exercício Físico', 'Atividade', '🏃', 'Atividade física para liberar endorfinas'),
  ('Meditação', 'Relaxamento', '🧘‍♀️', 'Prática de mindfulness e meditação'),
  ('Conversar com Amigo', 'Social', '👨‍👩‍👧‍👦', 'Buscar apoio social'),
  ('Escrever no Diário', 'Reflexão', '📝', 'Registrar pensamentos e sentimentos'),
  ('Ouvir Música', 'Distração', '🎵', 'Música relaxante ou energizante'),
  ('Tomar Banho', 'Autocuidado', '🛁', 'Momento de relaxamento e autocuidado'),
  ('Ler', 'Distração', '📚', 'Leitura para ocupar a mente'),
  ('Caminhada', 'Atividade', '🚶', 'Caminhada ao ar livre'),
  ('Técnica 5-4-3-2-1', 'Grounding', '🔢', '5 coisas que vê, 4 que ouve, 3 que toca, 2 que cheira, 1 que saboreia')
ON CONFLICT DO NOTHING;

-- Popular conquistas padrão
INSERT INTO public.achievements (name, description, icon, category, requirement_type, requirement_value, badge_color) VALUES
  ('Primeiro Dia', 'Complete seu primeiro dia de sobriedade', '🌟', 'Marcos', 'days', 1, '#22c55e'),
  ('Uma Semana Forte', 'Complete 7 dias consecutivos', '📅', 'Marcos', 'days', 7, '#3b82f6'),
  ('Mês de Vitória', 'Complete 30 dias consecutivos', '🏆', 'Marcos', 'days', 30, '#f59e0b'),
  ('Trimestre Determinado', 'Complete 90 dias consecutivos', '💎', 'Marcos', 'days', 90, '#8b5cf6'),
  ('Meio Ano Heroico', 'Complete 180 dias consecutivos', '🦸', 'Marcos', 'days', 180, '#ef4444'),
  ('Ano Incrível', 'Complete 365 dias consecutivos', '👑', 'Marcos', 'days', 365, '#ffd700'),
  ('Economista', 'Economize R$ 100', '💰', 'Economia', 'money_saved', 100, '#22c55e'),
  ('Poupador', 'Economize R$ 500', '🏦', 'Economia', 'money_saved', 500, '#3b82f6'),
  ('Investidor', 'Economize R$ 1000', '📈', 'Economia', 'money_saved', 1000, '#f59e0b'),
  ('Escritor Reflexivo', 'Escreva 10 entradas no diário', '✍️', 'Diário', 'journal_entries', 10, '#8b5cf6'),
  ('Cronista Dedicado', 'Escreva 30 entradas no diário', '📖', 'Diário', 'journal_entries', 30, '#ef4444'),
  ('Autobiógrafo', 'Escreva 100 entradas no diário', '📚', 'Diário', 'journal_entries', 100, '#ffd700')
ON CONFLICT DO NOTHING;

-- Popular recursos de apoio
INSERT INTO public.support_resources (title, description, type, contact_info, url, availability, is_emergency, country_code) VALUES
  ('CVV - Centro de Valorização da Vida', 'Apoio emocional e prevenção do suicídio', 'hotline', '188', 'https://www.cvv.org.br', '24 horas', true, 'BR'),
  ('SAMU', 'Serviço de Atendimento Móvel de Urgência', 'hotline', '192', null, '24 horas', true, 'BR'),
  ('Alcoólicos Anônimos', 'Grupo de apoio para dependentes de álcool', 'website', null, 'https://www.aa.org.br', 'Vários horários', false, 'BR'),
  ('Narcóticos Anônimos', 'Grupo de apoio para dependentes de drogas', 'website', null, 'https://www.na.org.br', 'Vários horários', false, 'BR'),
  ('CAPS - Centro de Atenção Psicossocial', 'Atendimento público em saúde mental', 'location', 'Varia por cidade', null, 'Horário comercial', false, 'BR'),
  ('Jogadores Anônimos', 'Grupo de apoio para viciados em jogos', 'website', null, 'https://www.jogadoresanonimos.org.br', 'Vários horários', false, 'BR')
ON CONFLICT DO NOTHING;

-- Função para auto-criar perfil do usuário
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, nome)
  VALUES (new.id, new.email, COALESCE(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1)));
  
  -- Criar configurações padrão para o usuário
  INSERT INTO public.user_settings (user_id)
  VALUES (new.id);
  
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para criar perfil automaticamente quando usuário se registra
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
