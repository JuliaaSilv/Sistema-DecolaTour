import { FileText, Download } from "lucide-react";
import { useState } from "react";
import Button from "./ui/Button";
import Card from "./ui/Card";
import CardContent from "./ui/CardContent";
import { cn } from "../../lib/utils";
import { exportarParaExcel, exportarParaPDF } from "../../services/exportService";
import useToast from "../../hooks/useToast";
import { ToastContainer } from "../common/Toast";

export default function ExportButtons() {
  const [carregandoExcel, setCarregandoExcel] = useState(false);
  const [carregandoPDF, setCarregandoPDF] = useState(false);
  const { toasts, showSuccess, showError, showInfo, removeToast } = useToast();

  const handleExportarExcel = async () => {
    try {
      setCarregandoExcel(true);
      showInfo('🔄 Coletando dados e gerando planilhas Excel...', 2000);
      
      const resultado = await exportarParaExcel();
      showSuccess(`✅ Relatório Excel gerado! Arquivo: ${resultado.arquivo}. Dados organizados em múltiplas planilhas com formatação profissional.`, 5000);
    } catch (error) {
      console.error('Erro ao exportar Excel:', error);
      showError('❌ Erro ao gerar relatório Excel. Verifique sua conexão e tente novamente.', 5000);
    } finally {
      setCarregandoExcel(false);
    }
  };

  const handleExportarPDF = async () => {
    try {
      setCarregandoPDF(true);
      showInfo('Gerando relatório PDF com design profissional...', 2000);
      
      const resultado = await exportarParaPDF();
      showSuccess(`✅ Relatório PDF criado! Arquivo: ${resultado.arquivo}. Layout visual com cores e gráficos organizados.`, 5000);
    } catch (error) {
      console.error('Erro ao exportar PDF:', error);
      showError('❌ Erro ao gerar relatório PDF. Verifique sua conexão e tente novamente.', 5000);
    } finally {
      setCarregandoPDF(false);
    }
  };

  return (
    <>
      <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-lg">
        <CardContent className="p-4 md:p-6">
          <div className="flex flex-col space-y-4">
            <div className="text-center sm:text-left">
              <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-1 flex items-center">
                <Download className="mr-2 w-4 h-4 md:w-5 md:h-5" />
                Exportar Relatórios
              </h3>
              <p className="text-xs md:text-sm text-gray-600">
                Baixe relatórios detalhados e profissionais em diferentes formatos
              </p>
              <p className="text-xs text-gray-500 mt-1">
                
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <Button 
                className="bg-green-600 hover:bg-green-700 text-white flex items-center justify-center disabled:opacity-50 text-sm md:text-base py-2 px-3 md:py-2 md:px-4 transition-all duration-200 hover:shadow-lg"
                onClick={handleExportarExcel}
                disabled={carregandoExcel}
                title="Gerar relatório em Excel com múltiplas planilhas organizadas"
              >
                <FileText className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                {carregandoExcel ? '📊 Gerando Excel...' : 'Relatório Excel'}
              </Button>
              <Button 
                className="bg-red-600 hover:bg-red-700 text-white flex items-center justify-center disabled:opacity-50 text-sm md:text-base py-2 px-3 md:py-2 md:px-4 transition-all duration-200 hover:shadow-lg"
                onClick={handleExportarPDF}
                disabled={carregandoPDF}
                title="Gerar relatório em PDF com design visual e cores"
              >
                <Download className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                {carregandoPDF ? 'Gerando PDF...' : 'Relatório PDF'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Container de notificações toast */}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </>
  );
}