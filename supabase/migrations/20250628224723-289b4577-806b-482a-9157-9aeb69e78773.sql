
-- Tabela de conversas do chatbot
CREATE TABLE public.chat_conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  conversation_id TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de mensagens do chat
CREATE TABLE public.chat_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID NOT NULL REFERENCES public.chat_conversations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  message_type TEXT DEFAULT 'text' CHECK (message_type IN ('text', 'crisis', 'encouragement', 'question')),
  emotion_detected TEXT,
  crisis_level INTEGER CHECK (crisis_level >= 0 AND crisis_level <= 10),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de templates de respostas de crise
CREATE TABLE public.crisis_responses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  trigger_keywords TEXT[] NOT NULL,
  response_template TEXT NOT NULL,
  crisis_level INTEGER NOT NULL CHECK (crisis_level >= 1 AND crisis_level <= 10),
  requires_human_intervention BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de logs de segurança
CREATE TABLE public.security_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  event_type TEXT NOT NULL,
  ip_address INET,
  user_agent TEXT,
  details JSONB,
  risk_level TEXT DEFAULT 'low' CHECK (risk_level IN ('low', 'medium', 'high', 'critical')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de tentativas de login falhadas
CREATE TABLE public.failed_login_attempts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL,
  ip_address INET NOT NULL,
  attempt_count INTEGER DEFAULT 1,
  last_attempt TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  blocked_until TIMESTAMP WITH TIME ZONE
);

-- Tabela de sessões ativas
CREATE TABLE public.active_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  session_token TEXT NOT NULL UNIQUE,
  ip_address INET,
  user_agent TEXT,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  last_activity TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de backups do usuário
CREATE TABLE public.user_backups (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  backup_type TEXT NOT NULL CHECK (backup_type IN ('full', 'incremental', 'manual')),
  data_snapshot JSONB NOT NULL,
  file_size INTEGER,
  checksum TEXT,
  storage_location TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP WITH TIME ZONE
);

-- Tabela de sincronização
CREATE TABLE public.sync_status (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  device_id TEXT NOT NULL,
  last_sync TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  sync_version INTEGER DEFAULT 1,
  conflicts_detected BOOLEAN DEFAULT FALSE,
  sync_errors JSONB
);

-- Tabela de dispositivos registrados para push
CREATE TABLE public.push_subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  endpoint TEXT NOT NULL,
  p256dh_key TEXT NOT NULL,
  auth_key TEXT NOT NULL,
  device_type TEXT,
  device_name TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de notificações enviadas
CREATE TABLE public.notifications_sent (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  notification_type TEXT NOT NULL,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  delivered BOOLEAN DEFAULT FALSE,
  clicked BOOLEAN DEFAULT FALSE
);

-- Tabela de eventos de uso
CREATE TABLE public.usage_analytics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  event_name TEXT NOT NULL,
  event_properties JSONB,
  session_id TEXT,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de insights personalizados
CREATE TABLE public.user_insights (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  insight_type TEXT NOT NULL,
  insight_data JSONB NOT NULL,
  confidence_score DECIMAL CHECK (confidence_score >= 0 AND confidence_score <= 1),
  generated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  acknowledged_at TIMESTAMP WITH TIME ZONE
);

-- Tabela de postagens anônimas
CREATE TABLE public.anonymous_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  group_id UUID REFERENCES public.support_groups(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  is_anonymous BOOLEAN DEFAULT TRUE,
  mood_rating INTEGER CHECK (mood_rating >= 1 AND mood_rating <= 5),
  support_count INTEGER DEFAULT 0,
  reported_count INTEGER DEFAULT 0,
  is_flagged BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Habilitar RLS em todas as novas tabelas
ALTER TABLE public.chat_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crisis_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.security_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.failed_login_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.active_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_backups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sync_status ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.push_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications_sent ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.usage_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.anonymous_posts ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para chatbot
CREATE POLICY "Users can manage own conversations" ON public.chat_conversations
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own messages" ON public.chat_messages
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Anyone can read crisis responses" ON public.crisis_responses
  FOR SELECT USING (true);

-- Políticas de segurança
CREATE POLICY "Users can view own security logs" ON public.security_logs
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can view own sessions" ON public.active_sessions
  FOR ALL USING (auth.uid() = user_id);

-- Políticas para backup e sync
CREATE POLICY "Users can manage own backups" ON public.user_backups
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own sync status" ON public.sync_status
  FOR ALL USING (auth.uid() = user_id);

-- Políticas para notificações
CREATE POLICY "Users can manage own push subscriptions" ON public.push_subscriptions
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own notifications" ON public.notifications_sent
  FOR SELECT USING (auth.uid() = user_id);

-- Políticas para analytics
CREATE POLICY "Users can view own analytics" ON public.usage_analytics
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can view own insights" ON public.user_insights
  FOR ALL USING (auth.uid() = user_id);

-- Políticas para posts anônimos
CREATE POLICY "Users can manage own posts" ON public.anonymous_posts
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view group posts" ON public.anonymous_posts
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.group_members 
      WHERE group_id = anonymous_posts.group_id 
      AND user_id = auth.uid()
    )
  );

-- Popular respostas de crise iniciais
INSERT INTO public.crisis_responses (trigger_keywords, response_template, crisis_level, requires_human_intervention) VALUES
  ('{recaída,recair,usei,bebi,fumei}', 'Entendo que você passou por uma recaída. Isso não significa que você falhou - faz parte do processo de recuperação. Vamos conversar sobre o que aconteceu e como podemos seguir em frente. Você gostaria de conversar sobre os gatilhos que levaram a isso?', 7, true),
  ('{suicídio,suicida,matar,morrer,acabar}', 'Percebo que você está passando por um momento muito difícil. Sua vida tem valor e existem pessoas que se importam com você. Por favor, entre em contato imediatamente com o CVV (188) ou procure ajuda médica. Você não está sozinho nessa jornada.', 10, true),
  ('{sozinho,solitário,isolado,abandonado}', 'Compreendo que você está se sentindo sozinho. A solidão pode ser um grande desafio na recuperação. Lembre-se de que você não está realmente sozinho - estou aqui para conversar e existem pessoas que se importam com você. Que tal conversarmos sobre algumas estratégias para lidar com esses sentimentos?', 5, false),
  ('{ansioso,ansiedade,nervoso,preocupado}', 'Percebo que você está se sentindo ansioso. A ansiedade é comum durante a recuperação. Vamos praticar algumas técnicas de respiração juntos? Inspire profundamente por 4 segundos, segure por 4, expire por 6. Repita algumas vezes e me conte como se sente.', 4, false),
  ('{vontade,desejo,tentação,difícil}', 'Entendo que você está enfrentando uma tentação forte. Isso é normal e mostra que você está sendo consciente dos seus impulsos. Vamos usar a técnica PARE: Pare o que está fazendo, Respire fundo, Avalie a situação, Responda com uma ação saudável. O que você pode fazer agora mesmo para se distrair?', 6, false)
ON CONFLICT DO NOTHING;
