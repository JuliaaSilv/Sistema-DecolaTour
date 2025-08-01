import { FileText, Download, Calendar as CalendarIcon } from "lucide-react";
import { useState } from "react";
import Button from "./ui/Button";
import Card from "./ui/Card";
import CardContent from "./ui/CardContent";
import { exportarParaExcel, exportarParaPDF, exportarRelatorioMensal } from "../../services/exportService";
import { useToast } from "../../hooks/useToast";
import { ToastContainer } from "../common/Toast";

export default function ExportButtons() {
  const [carregandoExcel, setCarregandoExcel] = useState(false);
  const [carregandoPDF, setCarregandoPDF] = useState(false);
  const [carregandoMensal, setCarregandoMensal] = useState(false);
  const { toasts, toast, removeToast } = useToast();

  const handleExportarExcel = async () => {
    try {
      setCarregandoExcel(true);
      toast.info('Iniciando geração do relatório Excel...', 2000);
      
      const resultado = await exportarParaExcel();
      toast.success(`Relatório Excel gerado com sucesso! Arquivo: ${resultado.arquivo}`, 4000);
    } catch (error) {
      console.error('Erro ao exportar Excel:', error);
      toast.error('Erro ao gerar relatório Excel. Verifique sua conexão e tente novamente.', 5000);
    } finally {
      setCarregandoExcel(false);
    }
  };

  const handleExportarPDF = async () => {
    try {
      setCarregandoPDF(true);
      toast.info('Iniciando geração do relatório PDF...', 2000);
      
      const resultado = await exportarParaPDF();
      toast.success(`Relatório PDF gerado com sucesso! Arquivo: ${resultado.arquivo}`, 4000);
    } catch (error) {
      console.error('Erro ao exportar PDF:', error);
      toast.error('Erro ao gerar relatório PDF. Verifique sua conexão e tente novamente.', 5000);
    } finally {
      setCarregandoPDF(false);
    }
  };

  const handleExportarMensal = async () => {
    try {
      setCarregandoMensal(true);
      toast.info('Iniciando geração do relatório mensal...', 2000);
      
      const resultado = await exportarRelatorioMensal();
      toast.success(`Relatório mensal gerado com sucesso! Arquivo: ${resultado.arquivo}`, 4000);
    } catch (error) {
      console.error('Erro ao exportar relatório mensal:', error);
      toast.error('Erro ao gerar relatório mensal. Verifique sua conexão e tente novamente.', 5000);
    } finally {
      setCarregandoMensal(false);
    }
  };
  return (
    <>
      <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-lg">
        <CardContent className="p-4 md:p-6">
          <div className="flex flex-col space-y-4">
            <div className="text-center sm:text-left">
              <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-1">Exportar Relatórios</h3>
              <p className="text-xs md:text-sm text-gray-600">Baixe relatórios detalhados em diferentes formatos</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <Button 
                className="bg-green-600 hover:bg-green-700 text-white flex items-center justify-center disabled:opacity-50 text-sm md:text-base py-2 px-3 md:py-2 md:px-4"
                onClick={handleExportarExcel}
                disabled={carregandoExcel}
              >
                <FileText className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                {carregandoExcel ? 'Gerando...' : 'Excel'}
              </Button>
              <Button 
                className="bg-red-600 hover:bg-red-700 text-white flex items-center justify-center disabled:opacity-50 text-sm md:text-base py-2 px-3 md:py-2 md:px-4"
                onClick={handleExportarPDF}
                disabled={carregandoPDF}
              >
                <Download className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                {carregandoPDF ? 'Gerando...' : 'PDF'}
              </Button>
              <Button 
                className="bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center disabled:opacity-50 text-sm md:text-base py-2 px-3 md:py-2 md:px-4"
                onClick={handleExportarMensal}
                disabled={carregandoMensal}
              >
                <CalendarIcon className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                {carregandoMensal ? 'Gerando...' : 'Mensal'}
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