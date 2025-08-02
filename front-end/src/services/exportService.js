/**
 * Serviços de exportação para Excel e PDF - DecolaTour
 */

import ExcelJS from 'exceljs';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { buscarDadosCompletos } from '../api/admin';

/**
 * Exportar dados para Excel
 */
export async function exportarParaExcel() {
  try {
    console.log('Iniciando exportação para Excel...');
    
    // Buscar dados do backend
    const dados = await buscarDadosCompletos();
    
    // Criar um novo workbook
    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'DecolaTour Admin Panel';
    workbook.lastModifiedBy = 'Sistema DecolaTour';
    workbook.created = new Date();
    workbook.modified = new Date();
    
    // Planilha 1: Métricas Gerais
    const wsMetricas = workbook.addWorksheet('Métricas Gerais');
    
    // Estilo do cabeçalho
    const headerStyle = {
      font: { bold: true, color: { argb: 'FFFFFF' } },
      fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: '3B82F6' } },
      alignment: { horizontal: 'center', vertical: 'middle' },
      border: {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      }
    };
    
    // Adicionar dados das métricas
    wsMetricas.addRow(['Métrica', 'Valor']);
    wsMetricas.addRow(['Total de Reservas', dados.metricas.totalReservas || 0]);
    wsMetricas.addRow(['Total de Clientes', dados.metricas.totalClientes || 0]);
    wsMetricas.addRow(['Total de Pacotes', dados.metricas.totalPacotes || 0]);
    wsMetricas.addRow(['Faturamento Total', `R$ ${dados.metricas.faturamento?.toFixed(2) || '0,00'}`]);
    wsMetricas.addRow(['Data de Geração', dados.dataGeracao]);
    
    // Aplicar estilo ao cabeçalho
    wsMetricas.getRow(1).eachCell((cell) => {
      cell.style = headerStyle;
    });
    
    // Ajustar largura das colunas
    wsMetricas.getColumn(1).width = 25;
    wsMetricas.getColumn(2).width = 20;
    
    // Planilha 2: Faturamento Mensal
    if (dados.faturamento && dados.faturamento.length > 0) {
      const wsFaturamento = workbook.addWorksheet('Faturamento Mensal');
      
      wsFaturamento.addRow(['Mês/Ano', 'Valor (R$)']);
      dados.faturamento.forEach(item => {
        wsFaturamento.addRow([
          item.mes || 'N/A',
          item.valor?.toFixed(2) || '0,00'
        ]);
      });
      
      // Aplicar estilo ao cabeçalho
      wsFaturamento.getRow(1).eachCell((cell) => {
        cell.style = headerStyle;
      });
      
      wsFaturamento.getColumn(1).width = 15;
      wsFaturamento.getColumn(2).width = 15;
    }
    
    // Planilha 3: Destinos Populares
    if (dados.destinos && dados.destinos.length > 0) {
      const wsDestinos = workbook.addWorksheet('Destinos Populares');
      
      wsDestinos.addRow(['Destino', 'Número de Reservas']);
      dados.destinos.forEach(item => {
        wsDestinos.addRow([
          item.destino || 'N/A',
          item.reservas || 0
        ]);
      });
      
      // Aplicar estilo ao cabeçalho
      wsDestinos.getRow(1).eachCell((cell) => {
        cell.style = headerStyle;
      });
      
      wsDestinos.getColumn(1).width = 25;
      wsDestinos.getColumn(2).width = 20;
    }
    
    // Planilha 4: Clientes Frequentes
    if (dados.clientes && dados.clientes.length > 0) {
      const wsClientes = workbook.addWorksheet('Clientes Frequentes');
      
      wsClientes.addRow(['Nome', 'Email', 'Número de Reservas']);
      dados.clientes.forEach(item => {
        wsClientes.addRow([
          item.nome || 'N/A',
          item.email || 'N/A',
          item.reservas || 0
        ]);
      });
      
      // Aplicar estilo ao cabeçalho
      wsClientes.getRow(1).eachCell((cell) => {
        cell.style = headerStyle;
      });
      
      wsClientes.getColumn(1).width = 25;
      wsClientes.getColumn(2).width = 30;
      wsClientes.getColumn(3).width = 20;
    }
    
    // Planilha 5: Promoções Ativas
    if (dados.promocoes && dados.promocoes.length > 0) {
      const wsPromocoes = workbook.addWorksheet('Promoções Ativas');
      
      wsPromocoes.addRow(['Nome', 'Descrição', 'Desconto (%)', 'Data Início', 'Data Fim']);
      dados.promocoes.forEach(item => {
        wsPromocoes.addRow([
          item.nome || 'N/A',
          item.descricao || 'N/A',
          item.descontoPercentual || 0,
          item.dataInicio ? new Date(item.dataInicio).toLocaleDateString('pt-BR') : 'N/A',
          item.dataFim ? new Date(item.dataFim).toLocaleDateString('pt-BR') : 'N/A'
        ]);
      });
      
      // Aplicar estilo ao cabeçalho
      wsPromocoes.getRow(1).eachCell((cell) => {
        cell.style = headerStyle;
      });
      
      wsPromocoes.getColumn(1).width = 20;
      wsPromocoes.getColumn(2).width = 30;
      wsPromocoes.getColumn(3).width = 15;
      wsPromocoes.getColumn(4).width = 15;
      wsPromocoes.getColumn(5).width = 15;
    }
    
    // Gerar nome do arquivo com data atual
    const agora = new Date();
    const dataFormatada = agora.toISOString().split('T')[0];
    const nomeArquivo = `relatorio-decolatour-${dataFormatada}.xlsx`;
    
    // Fazer download do arquivo
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = nomeArquivo;
    link.click();
    window.URL.revokeObjectURL(url);
    
    console.log('Exportação para Excel concluída com sucesso!');
    return { sucesso: true, arquivo: nomeArquivo };
    
  } catch (error) {
    console.error('Erro ao exportar para Excel:', error);
    throw new Error('Falha ao gerar relatório Excel: ' + error.message);
  }
}

/**
 * Exportar dados para PDF
 */
export async function exportarParaPDF() {
  try {
    console.log('Iniciando exportação para PDF...');
    
    // Buscar dados do backend
    const dados = await buscarDadosCompletos();
    
    // Criar novo documento PDF
    const doc = new jsPDF();
    
    // Configurações iniciais
    const margemEsquerda = 20;
    let posicaoY = 20;
    
    // Título principal
    doc.setFontSize(20);
    doc.setTextColor(59, 130, 246); // Azul
    doc.text('DecolaTour - Relatório Administrativo', margemEsquerda, posicaoY);
    
    posicaoY += 15;
    doc.setFontSize(12);
    doc.setTextColor(100, 100, 100);
    doc.text(`Gerado em: ${dados.dataGeracao}`, margemEsquerda, posicaoY);
    
    posicaoY += 25;
    
    // Seção 1: Métricas Gerais
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text('📊 Métricas Gerais', margemEsquerda, posicaoY);
    posicaoY += 15;
    
    // Adicionar métricas como texto formatado
    doc.setFontSize(12);
    doc.setTextColor(50, 50, 50);
    
    const metricas = [
      `• Total de Reservas: ${dados.metricas.totalReservas || 0}`,
      `• Total de Clientes: ${dados.metricas.totalClientes || 0}`,
      `• Total de Pacotes: ${dados.metricas.totalPacotes || 0}`,
      `• Faturamento Total: R$ ${dados.metricas.faturamento?.toFixed(2) || '0,00'}`
    ];
    
    metricas.forEach((metrica, index) => {
      doc.text(metrica, margemEsquerda + 5, posicaoY + (index * 8));
    });
    
    posicaoY += (metricas.length * 8) + 20;
    
    // Seção 2: Faturamento Mensal
    if (dados.faturamento && dados.faturamento.length > 0) {
      // Verificar se precisa de nova página
      if (posicaoY > 220) {
        doc.addPage();
        posicaoY = 20;
      }
      
      doc.setFontSize(16);
      doc.setTextColor(0, 0, 0);
      doc.text('💰 Faturamento Mensal', margemEsquerda, posicaoY);
      posicaoY += 15;
      
      doc.setFontSize(12);
      doc.setTextColor(50, 50, 50);
      
      dados.faturamento.slice(0, 10).forEach((item, index) => {
        const texto = `• ${item.mes || 'N/A'}: R$ ${item.valor?.toFixed(2) || '0,00'}`;
        doc.text(texto, margemEsquerda + 5, posicaoY + (index * 8));
      });
      
      posicaoY += (Math.min(dados.faturamento.length, 10) * 8) + 20;
    }
    
    // Seção 3: Destinos Populares
    if (dados.destinos && dados.destinos.length > 0) {
      if (posicaoY > 220) {
        doc.addPage();
        posicaoY = 20;
      }
      
      doc.setFontSize(16);
      doc.setTextColor(0, 0, 0);
      doc.text('🌍 Destinos Populares', margemEsquerda, posicaoY);
      posicaoY += 15;
      
      doc.setFontSize(12);
      doc.setTextColor(50, 50, 50);
      
      dados.destinos.slice(0, 10).forEach((item, index) => {
        const texto = `• ${item.destino || 'N/A'}: ${item.reservas || 0} reservas`;
        doc.text(texto, margemEsquerda + 5, posicaoY + (index * 8));
      });
      
      posicaoY += (Math.min(dados.destinos.length, 10) * 8) + 20;
    }
    
    // Seção 4: Clientes Frequentes
    if (dados.clientes && dados.clientes.length > 0) {
      if (posicaoY > 200) {
        doc.addPage();
        posicaoY = 20;
      }
      
      doc.setFontSize(16);
      doc.setTextColor(0, 0, 0);
      doc.text('👥 Clientes Frequentes', margemEsquerda, posicaoY);
      posicaoY += 15;
      
      doc.setFontSize(10);
      doc.setTextColor(50, 50, 50);
      
      dados.clientes.slice(0, 8).forEach((item, index) => {
        const texto = `• ${item.nome || 'N/A'} - ${item.email || 'N/A'} (${item.reservas || 0} reservas)`;
        // Quebrar texto longo se necessário
        const textoQuebrado = doc.splitTextToSize(texto, 170);
        doc.text(textoQuebrado, margemEsquerda + 5, posicaoY + (index * 12));
      });
      
      posicaoY += (Math.min(dados.clientes.length, 8) * 12) + 20;
    }
    
    // Seção 5: Promoções Ativas
    if (dados.promocoes && dados.promocoes.length > 0) {
      if (posicaoY > 180) {
        doc.addPage();
        posicaoY = 20;
      }
      
      doc.setFontSize(16);
      doc.setTextColor(0, 0, 0);
      doc.text('🎁 Promoções Ativas', margemEsquerda, posicaoY);
      posicaoY += 15;
      
      doc.setFontSize(10);
      doc.setTextColor(50, 50, 50);
      
      dados.promocoes.slice(0, 5).forEach((item, index) => {
        const dataInicio = item.dataInicio ? new Date(item.dataInicio).toLocaleDateString('pt-BR') : 'N/A';
        const dataFim = item.dataFim ? new Date(item.dataFim).toLocaleDateString('pt-BR') : 'N/A';
        const texto = `• ${item.nome || 'N/A'} - ${item.descontoPercentual || 0}% (${dataInicio} - ${dataFim})`;
        const textoQuebrado = doc.splitTextToSize(texto, 170);
        doc.text(textoQuebrado, margemEsquerda + 5, posicaoY + (index * 15));
      });
    }
    
    // Adicionar rodapé
    const totalPaginas = doc.internal.getNumberOfPages();
    for (let i = 1; i <= totalPaginas; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text(
        `DecolaTour Admin Panel - Página ${i} de ${totalPaginas}`,
        margemEsquerda,
        doc.internal.pageSize.height - 10
      );
    }
    
    // Gerar nome do arquivo com data atual
    const agora = new Date();
    const dataFormatada = agora.toISOString().split('T')[0];
    const nomeArquivo = `relatorio-decolatour-${dataFormatada}.pdf`;
    
    // Fazer download do arquivo
    doc.save(nomeArquivo);
    
    console.log('Exportação para PDF concluída com sucesso!');
    return { sucesso: true, arquivo: nomeArquivo };
    
  } catch (error) {
    console.error('Erro ao exportar para PDF:', error);
    throw new Error('Falha ao gerar relatório PDF: ' + error.message);
  }
}

/**
 * Exportar relatório mensal (dados do mês atual)
 */
export async function exportarRelatorioMensal() {
  try {
    console.log('Iniciando exportação do relatório mensal...');
    
    const dados = await buscarDadosCompletos();
    const agora = new Date();
    const mesAtual = agora.getMonth() + 1;
    const anoAtual = agora.getFullYear();
    
    // Filtrar dados do mês atual
    const faturamentoMesAtual = dados.faturamento?.filter(item => {
      if (item.mes) {
        const [mes, ano] = item.mes.split('/');
        return parseInt(mes) === mesAtual && parseInt(ano) === anoAtual;
      }
      return false;
    }) || [];
    
    // Criar PDF específico para o mês
    const doc = new jsPDF();
    
    doc.setFontSize(20);
    doc.setTextColor(59, 130, 246);
    doc.text('DecolaTour - Relatório Mensal', 20, 20);
    
    doc.setFontSize(14);
    doc.setTextColor(100, 100, 100);
    doc.text(`Período: ${mesAtual.toString().padStart(2, '0')}/${anoAtual}`, 20, 35);
    doc.text(`Gerado em: ${dados.dataGeracao}`, 20, 45);
    
    // Adicionar dados do mês
    let posicaoY = 65;
    
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text('📊 Resumo do Mês', 20, posicaoY);
    posicaoY += 20;
    
    // Dados do resumo mensal como texto formatado
    doc.setFontSize(12);
    doc.setTextColor(50, 50, 50);
    
    const resumoMensal = [
      `• Faturamento do Mês: ${faturamentoMesAtual.length > 0 ? 
        `R$ ${faturamentoMesAtual[0].valor?.toFixed(2) || '0,00'}` : 'R$ 0,00'}`,
      `• Total Geral de Reservas: ${dados.metricas.totalReservas?.toString() || '0'}`,
      `• Total Geral de Clientes: ${dados.metricas.totalClientes?.toString() || '0'}`,
      `• Total Geral de Pacotes: ${dados.metricas.totalPacotes?.toString() || '0'}`
    ];
    
    resumoMensal.forEach((item, index) => {
      doc.text(item, 25, posicaoY + (index * 12));
    });
    
    posicaoY += (resumoMensal.length * 12) + 20;
    
    // Adicionar informações adicionais se houver espaço
    if (dados.destinos && dados.destinos.length > 0) {
      doc.setFontSize(16);
      doc.setTextColor(0, 0, 0);
      doc.text('🌍 Top 5 Destinos Populares', 20, posicaoY);
      posicaoY += 15;
      
      doc.setFontSize(10);
      doc.setTextColor(50, 50, 50);
      
      dados.destinos.slice(0, 5).forEach((item, index) => {
        doc.text(`${index + 1}. ${item.destino || 'N/A'} - ${item.reservas || 0} reservas`, 25, posicaoY + (index * 8));
      });
    }
    
    // Adicionar rodapé
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(
      'DecolaTour Admin Panel - Relatório Mensal',
      20,
      doc.internal.pageSize.height - 10
    );
    
    const nomeArquivo = `relatorio-mensal-${mesAtual.toString().padStart(2, '0')}-${anoAtual}.pdf`;
    doc.save(nomeArquivo);
    
    console.log('Exportação do relatório mensal concluída!');
    return { sucesso: true, arquivo: nomeArquivo };
    
  } catch (error) {
    console.error('Erro ao exportar relatório mensal:', error);
    throw new Error('Falha ao gerar relatório mensal: ' + error.message);
  }
}
