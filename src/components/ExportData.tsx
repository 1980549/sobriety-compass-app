
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Download, FileText, Table } from 'lucide-react';
import { useSobriety } from '@/hooks/useSobriety';
import { useMoodHistory } from '@/hooks/useMoodHistory';
import { useJournal } from '@/hooks/useJournal';
import { useToast } from '@/hooks/use-toast';
import jsPDF from 'jspdf';

export const ExportData = () => {
  const { toast } = useToast();
  const { records } = useSobriety();
  const { moodHistory } = useMoodHistory();
  const { entries } = useJournal();
  const [isExporting, setIsExporting] = useState(false);

  const exportToPDF = async () => {
    setIsExporting(true);
    try {
      const doc = new jsPDF();
      
      // Título
      doc.setFontSize(20);
      doc.text('Relatório de Jornada de Sobriedade', 20, 30);
      
      // Data
      doc.setFontSize(12);
      doc.text(`Gerado em: ${new Date().toLocaleDateString('pt-BR')}`, 20, 45);
      
      let yPosition = 60;
      
      // Jornadas
      doc.setFontSize(16);
      doc.text('Jornadas Ativas', 20, yPosition);
      yPosition += 15;
      
      records.forEach((record, index) => {
        doc.setFontSize(12);
        doc.text(`${index + 1}. ${record.addiction_types?.name || 'Vício'}`, 25, yPosition);
        doc.text(`   Streak atual: ${record.current_streak_days} dias`, 25, yPosition + 10);
        doc.text(`   Melhor streak: ${record.best_streak_days} dias`, 25, yPosition + 20);
        const economia = ((record.daily_cost || 0) * (record.current_streak_days || 0)).toFixed(2);
        doc.text(`   Economia: R$ ${economia}`, 25, yPosition + 30);
        yPosition += 45;
      });
      
      // Humor
      if (moodHistory.length > 0) {
        yPosition += 10;
        doc.setFontSize(16);
        doc.text('Histórico de Humor (Últimos 10 dias)', 20, yPosition);
        yPosition += 15;
        
        moodHistory.slice(0, 10).forEach((mood, index) => {
          doc.setFontSize(12);
          const date = new Date(mood.entry_date).toLocaleDateString('pt-BR');
          doc.text(`${date}: ${mood.mood_value}/5`, 25, yPosition);
          yPosition += 10;
        });
      }
      
      doc.save('jornada-sobriedade.pdf');
      
      toast({
        title: "Exportação concluída!",
        description: "Seu relatório foi baixado com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro na exportação",
        description: "Não foi possível gerar o relatório.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const exportToCSV = () => {
    setIsExporting(true);
    try {
      let csvContent = "data:text/csv;charset=utf-8,";
      
      // Cabeçalho
      csvContent += "Tipo,Data Inicio,Streak Atual,Melhor Streak,Custo Diário,Economia Total\n";
      
      // Dados das jornadas
      records.forEach(record => {
        const economia = ((record.daily_cost || 0) * (record.current_streak_days || 0)).toFixed(2);
        csvContent += `"${record.addiction_types?.name || 'Vício'}","${record.start_date}",${record.current_streak_days},${record.best_streak_days},${record.daily_cost || 0},${economia}\n`;
      });
      
      // Criar e baixar arquivo
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", "jornada-sobriedade.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Exportação concluída!",
        description: "Seus dados foram exportados em CSV.",
      });
    } catch (error) {
      toast({
        title: "Erro na exportação",
        description: "Não foi possível exportar os dados.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Exportar Dados</h3>
      <p className="text-gray-600 mb-6">
        Baixe um relatório completo da sua jornada de sobriedade
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <Button 
          onClick={exportToPDF}
          disabled={isExporting}
          className="flex items-center space-x-2"
        >
          <FileText className="w-4 h-4" />
          <span>Exportar PDF</span>
        </Button>
        
        <Button 
          onClick={exportToCSV}
          disabled={isExporting}
          variant="outline"
          className="flex items-center space-x-2"
        >
          <Table className="w-4 h-4" />
          <span>Exportar CSV</span>
        </Button>
      </div>
    </Card>
  );
};
