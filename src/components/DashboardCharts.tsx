
import React from 'react';
import { Card } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { useSobriety } from '@/hooks/useSobriety';
import { useMoodHistory } from '@/hooks/useMoodHistory';

export const DashboardCharts = () => {
  const { records } = useSobriety();
  const { moodHistory } = useMoodHistory();

  // Dados de streak ao longo do tempo
  const streakData = records.map(record => ({
    name: record.addiction_types?.name || 'Vício',
    streak: record.current_streak_days,
    best: record.best_streak_days,
    economia: ((record.daily_cost || 0) * (record.current_streak_days || 0)),
  }));

  // Dados de humor dos últimos 30 dias
  const moodData = moodHistory.slice(0, 30).reverse().map(entry => ({
    date: new Date(entry.entry_date).toLocaleDateString('pt-BR', { month: 'short', day: 'numeric' }),
    humor: entry.mood_value,
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Gráfico de Streaks */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Progresso de Streaks</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={streakData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="streak" fill="#6366f1" name="Streak Atual" />
            <Bar dataKey="best" fill="#10b981" name="Melhor Streak" />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Gráfico de Humor */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Histórico de Humor</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={moodData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis domain={[1, 5]} />
            <Tooltip />
            <Line 
              type="monotone" 
              dataKey="humor" 
              stroke="#f59e0b" 
              strokeWidth={2}
              dot={{ fill: '#f59e0b' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      {/* Gráfico de Economia */}
      <Card className="p-6 lg:col-span-2">
        <h3 className="text-lg font-semibold mb-4">Economia Acumulada</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={streakData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip formatter={(value) => [`R$ ${Number(value).toFixed(2)}`, 'Economia']} />
            <Bar dataKey="economia" fill="#059669" name="Economia Total" />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
};
