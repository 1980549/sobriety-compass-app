-- Adicionar campos necessários para cálculos corretos na tabela sobriety_records
ALTER TABLE public.sobriety_records 
ADD COLUMN IF NOT EXISTS motivation_reason text,
ADD COLUMN IF NOT EXISTS personal_goal text;

-- Garantir que os campos de cálculo existem e têm valores padrão corretos
UPDATE public.sobriety_records 
SET current_streak_days = COALESCE(current_streak_days, 0),
    best_streak_days = COALESCE(best_streak_days, 0),
    total_relapses = COALESCE(total_relapses, 0),
    daily_cost = COALESCE(daily_cost, 0)
WHERE current_streak_days IS NULL 
   OR best_streak_days IS NULL 
   OR total_relapses IS NULL 
   OR daily_cost IS NULL;

-- Criar tabela para métricas diárias (se não existir)
CREATE TABLE IF NOT EXISTS public.daily_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sobriety_record_id UUID NOT NULL REFERENCES public.sobriety_records(id) ON DELETE CASCADE,
    user_id UUID NOT NULL,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    day_clean BOOLEAN DEFAULT true,
    daily_savings DECIMAL(10,2) DEFAULT 0,
    streak_day INTEGER DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(sobriety_record_id, date)
);

-- Habilitar RLS na nova tabela
ALTER TABLE public.daily_progress ENABLE ROW LEVEL SECURITY;

-- Criar política para usuários verem apenas seus próprios dados
CREATE POLICY "Users can manage own daily progress" 
ON public.daily_progress 
FOR ALL 
USING (auth.uid() = user_id);

-- Função para atualizar timestamp automaticamente
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para atualizar updated_at automaticamente
CREATE TRIGGER update_daily_progress_updated_at
    BEFORE UPDATE ON public.daily_progress
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger para atualizar updated_at na tabela sobriety_records
CREATE TRIGGER update_sobriety_records_updated_at
    BEFORE UPDATE ON public.sobriety_records
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();