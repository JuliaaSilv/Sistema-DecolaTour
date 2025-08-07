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
    
    // Estilos globais aprimorados
    const headerStyle = {
      font: { bold: true, color: { argb: 'FFFFFF' }, size: 12 },
      fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: '1E40AF' } },
      alignment: { horizontal: 'center', vertical: 'middle' },
      border: {
        top: { style: 'thin', color: { argb: '000000' } },
        left: { style: 'thin', color: { argb: '000000' } },
        bottom: { style: 'thin', color: { argb: '000000' } },
        right: { style: 'thin', color: { argb: '000000' } }
      }
    };

    const dataStyle = {
      font: { size: 11 },
      alignment: { horizontal: 'left', vertical: 'middle' },
      border: {
        top: { style: 'thin', color: { argb: 'D1D5DB' } },
        left: { style: 'thin', color: { argb: 'D1D5DB' } },
        bottom: { style: 'thin', color: { argb: 'D1D5DB' } },
        right: { style: 'thin', color: { argb: 'D1D5DB' } }
      }
    };

    const numberStyle = {
      ...dataStyle,
      alignment: { horizontal: 'right', vertical: 'middle' },
      numFmt: '#,##0'
    };

    const currencyStyle = {
      ...dataStyle,
      alignment: { horizontal: 'right', vertical: 'middle' },
      numFmt: '"R$ "#,##0.00'
    };

    // Planilha 1: Métricas Gerais
    const wsMetricas = workbook.addWorksheet('📊 Métricas Gerais');
    
    // Título da seção
    wsMetricas.mergeCells('A1:C1');
    wsMetricas.getCell('A1').value = 'RELATÓRIO DECOLATOUR - MÉTRICAS GERAIS';
    wsMetricas.getCell('A1').style = {
      font: { bold: true, size: 14, color: { argb: '1E40AF' } },
      alignment: { horizontal: 'center', vertical: 'middle' },
      fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'EBF4FF' } }
    };
    wsMetricas.getRow(1).height = 25;

    // Data de geração
    wsMetricas.getCell('A2').value = `Gerado em: ${dados.dataGeracao}`;
    wsMetricas.getCell('A2').style = {
      font: { italic: true, size: 10, color: { argb: '6B7280' } },
      alignment: { horizontal: 'center' }
    };
    wsMetricas.mergeCells('A2:C2');

    // Cabeçalhos
    wsMetricas.addRow([]);
    wsMetricas.addRow(['Categoria', 'Métrica', 'Valor']);
    
    // Dados das métricas com categorização
    wsMetricas.addRow(['Reservas', 'Total de Reservas', dados.metricas.totalReservas || 0]);
    wsMetricas.addRow(['Clientes', 'Total de Clientes', dados.metricas.totalClientes || 0]);
    wsMetricas.addRow(['Pacotes', 'Total de Pacotes', dados.metricas.totalPacotes || 0]);
    wsMetricas.addRow(['Financeiro', 'Faturamento Total', dados.metricas.faturamento || 0]);
    
    // Aplicar estilos
    wsMetricas.getRow(4).eachCell((cell) => {
      cell.style = headerStyle;
    });

    // Estilizar dados
    for (let i = 5; i <= 8; i++) {
      wsMetricas.getCell(`A${i}`).style = { ...dataStyle, font: { bold: true, size: 11 } };
      wsMetricas.getCell(`B${i}`).style = dataStyle;
      
      if (i === 8) { // Linha do faturamento
        wsMetricas.getCell(`C${i}`).style = currencyStyle;
      } else {
        wsMetricas.getCell(`C${i}`).style = numberStyle;
      }
    }
    
    // Ajustar largura das colunas
    wsMetricas.getColumn(1).width = 18;
    wsMetricas.getColumn(2).width = 28;
    wsMetricas.getColumn(3).width = 20;
    
    // Planilha 2: Faturamento Mensal
    if (dados.faturamento && dados.faturamento.length > 0) {
      const wsFaturamento = workbook.addWorksheet('💰 Faturamento Mensal');
      
      // Título da seção
      wsFaturamento.mergeCells('A1:D1');
      wsFaturamento.getCell('A1').value = 'FATURAMENTO MENSAL - ANÁLISE TEMPORAL';
      wsFaturamento.getCell('A1').style = {
        font: { bold: true, size: 14, color: { argb: 'DC2626' } },
        alignment: { horizontal: 'center', vertical: 'middle' },
        fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FEE2E2' } }
      };
      wsFaturamento.getRow(1).height = 25;

      wsFaturamento.addRow([]);
      wsFaturamento.addRow(['Período', 'Valor (R$)', 'Crescimento', 'Status']);
      
      // Calcular crescimento percentual
      dados.faturamento.forEach((item, index) => {
        const valorAnterior = index > 0 ? dados.faturamento[index - 1].valor : item.valor;
        const crescimento = index > 0 ? ((item.valor - valorAnterior) / valorAnterior * 100) : 0;
        const status = crescimento > 0 ? '📈 Crescimento' : crescimento < 0 ? '📉 Queda' : '➡️ Estável';
        
        wsFaturamento.addRow([
          item.mes || 'N/A',
          item.valor || 0,
          crescimento.toFixed(1) + '%',
          status
        ]);
      });
      
      // Aplicar estilos
      wsFaturamento.getRow(3).eachCell((cell) => {
        cell.style = headerStyle;
      });

      // Estilizar dados
      for (let i = 4; i <= 3 + dados.faturamento.length; i++) {
        wsFaturamento.getCell(`A${i}`).style = dataStyle;
        wsFaturamento.getCell(`B${i}`).style = currencyStyle;
        wsFaturamento.getCell(`C${i}`).style = {
          ...dataStyle,
          alignment: { horizontal: 'center' },
          font: { bold: true, size: 11 }
        };
        wsFaturamento.getCell(`D${i}`).style = {
          ...dataStyle,
          alignment: { horizontal: 'center' }
        };
      }
      
      // Adicionar totais
      const totalRow = 4 + dados.faturamento.length;
      wsFaturamento.addRow([]);
      wsFaturamento.getCell(`A${totalRow}`).value = 'TOTAL GERAL:';
      wsFaturamento.getCell(`A${totalRow}`).style = {
        font: { bold: true, size: 12, color: { argb: 'DC2626' } }
      };
      
      const total = dados.faturamento.reduce((sum, item) => sum + (item.valor || 0), 0);
      wsFaturamento.getCell(`B${totalRow}`).value = total;
      wsFaturamento.getCell(`B${totalRow}`).style = {
        ...currencyStyle,
        font: { bold: true, size: 12, color: { argb: 'DC2626' } }
      };
      
      wsFaturamento.getColumn(1).width = 18;
      wsFaturamento.getColumn(2).width = 18;
      wsFaturamento.getColumn(3).width = 15;
      wsFaturamento.getColumn(4).width = 20;
    }
    
    // Planilha 3: Destinos Populares
    if (dados.destinos && dados.destinos.length > 0) {
      const wsDestinos = workbook.addWorksheet('🌍 Destinos Populares');
      
      // Título da seção
      wsDestinos.mergeCells('A1:E1');
      wsDestinos.getCell('A1').value = 'DESTINOS MAIS PROCURADOS - RANKING';
      wsDestinos.getCell('A1').style = {
        font: { bold: true, size: 14, color: { argb: '059669' } },
        alignment: { horizontal: 'center', vertical: 'middle' },
        fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'D1FAE5' } }
      };
      wsDestinos.getRow(1).height = 25;

      wsDestinos.addRow([]);
      wsDestinos.addRow(['Ranking', 'Destino', 'Reservas', 'Porcentagem', 'Categoria']);
      
      // Calcular total para porcentagens
      const totalReservas = dados.destinos.reduce((sum, item) => sum + (item.reservas || 0), 0);
      
      dados.destinos.forEach((item, index) => {
        const porcentagem = totalReservas > 0 ? ((item.reservas || 0) / totalReservas * 100) : 0;
        let categoria = '🥉 Outros';
        if (index === 0) categoria = '🥇 Top 1';
        else if (index === 1) categoria = '🥈 Top 2';
        else if (index === 2) categoria = '🥉 Top 3';
        
        wsDestinos.addRow([
          `#${index + 1}`,
          item.destino || 'N/A',
          item.reservas || 0,
          porcentagem.toFixed(1) + '%',
          categoria
        ]);
      });
      
      // Aplicar estilos
      wsDestinos.getRow(3).eachCell((cell) => {
        cell.style = headerStyle;
      });

      // Estilizar dados
      for (let i = 4; i <= 3 + dados.destinos.length; i++) {
        // Ranking
        wsDestinos.getCell(`A${i}`).style = {
          ...dataStyle,
          alignment: { horizontal: 'center' },
          font: { bold: true, size: 11, color: { argb: '059669' } }
        };
        
        // Destino
        wsDestinos.getCell(`B${i}`).style = {
          ...dataStyle,
          font: { bold: true, size: 11 }
        };
        
        // Reservas
        wsDestinos.getCell(`C${i}`).style = numberStyle;
        
        // Porcentagem
        wsDestinos.getCell(`D${i}`).style = {
          ...dataStyle,
          alignment: { horizontal: 'center' },
          font: { bold: true }
        };
        
        // Categoria
        wsDestinos.getCell(`E${i}`).style = {
          ...dataStyle,
          alignment: { horizontal: 'center' }
        };
      }
      
      wsDestinos.getColumn(1).width = 12;
      wsDestinos.getColumn(2).width = 25;
      wsDestinos.getColumn(3).width = 15;
      wsDestinos.getColumn(4).width = 15;
      wsDestinos.getColumn(5).width = 18;
    }
    
    // Planilha 4: Clientes Frequentes
    if (dados.clientes && dados.clientes.length > 0) {
      const wsClientes = workbook.addWorksheet('👥 Clientes VIP');
      
      // Título da seção
      wsClientes.mergeCells('A1:F1');
      wsClientes.getCell('A1').value = 'CLIENTES FREQUENTES - PROGRAMA VIP';
      wsClientes.getCell('A1').style = {
        font: { bold: true, size: 14, color: { argb: '7C3AED' } },
        alignment: { horizontal: 'center', vertical: 'middle' },
        fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'EDE9FE' } }
      };
      wsClientes.getRow(1).height = 25;

      wsClientes.addRow([]);
      wsClientes.addRow(['Ranking', 'Nome', 'Email', 'Reservas', 'Valor Gasto', 'Categoria VIP']);
      
      dados.clientes.forEach((item, index) => {
        let categoriaVIP = '🥉 Bronze';
        const reservas = item.reservas || 0;
        
        if (reservas >= 10) categoriaVIP = '💎 Platinum';
        else if (reservas >= 5) categoriaVIP = '🥇 Gold';
        else if (reservas >= 3) categoriaVIP = '🥈 Silver';
        
        wsClientes.addRow([
          `#${index + 1}`,
          item.nome || 'N/A',
          item.email || 'N/A',
          item.reservas || 0,
          item.totalSpent || 0,
          categoriaVIP
        ]);
      });
      
      // Aplicar estilos
      wsClientes.getRow(3).eachCell((cell) => {
        cell.style = headerStyle;
      });

      // Estilizar dados
      for (let i = 4; i <= 3 + dados.clientes.length; i++) {
        // Ranking
        wsClientes.getCell(`A${i}`).style = {
          ...dataStyle,
          alignment: { horizontal: 'center' },
          font: { bold: true, size: 11, color: { argb: '7C3AED' } }
        };
        
        // Nome
        wsClientes.getCell(`B${i}`).style = {
          ...dataStyle,
          font: { bold: true, size: 11 }
        };
        
        // Email
        wsClientes.getCell(`C${i}`).style = dataStyle;
        
        // Reservas
        wsClientes.getCell(`D${i}`).style = numberStyle;
        
        // Valor gasto
        wsClientes.getCell(`E${i}`).style = currencyStyle;
        
        // Categoria VIP
        wsClientes.getCell(`F${i}`).style = {
          ...dataStyle,
          alignment: { horizontal: 'center' },
          font: { bold: true }
        };
      }
      
      // Adicionar estatísticas de resumo
      const statsRow = 4 + dados.clientes.length + 1;
      wsClientes.addRow([]);
      wsClientes.getCell(`A${statsRow}`).value = 'ESTATÍSTICAS:';
      wsClientes.getCell(`A${statsRow}`).style = {
        font: { bold: true, size: 12, color: { argb: '7C3AED' } }
      };
      
      const totalReservasClientes = dados.clientes.reduce((sum, item) => sum + (item.reservas || 0), 0);
      const totalGastoClientes = dados.clientes.reduce((sum, item) => sum + (item.totalSpent || 0), 0);
      
      wsClientes.getCell(`C${statsRow}`).value = 'Total Reservas:';
      wsClientes.getCell(`D${statsRow}`).value = totalReservasClientes;
      wsClientes.getCell(`D${statsRow}`).style = numberStyle;
      
      wsClientes.getCell(`E${statsRow}`).value = totalGastoClientes;
      wsClientes.getCell(`E${statsRow}`).style = currencyStyle;
      
      wsClientes.getColumn(1).width = 12;
      wsClientes.getColumn(2).width = 25;
      wsClientes.getColumn(3).width = 30;
      wsClientes.getColumn(4).width = 15;
      wsClientes.getColumn(5).width = 18;
      wsClientes.getColumn(6).width = 18;
    }
    
    // Planilha 5: Promoções Ativas
    if (dados.promocoes && dados.promocoes.length > 0) {
      const wsPromocoes = workbook.addWorksheet('🎁 Promoções & Ofertas');
      
      // Título da seção
      wsPromocoes.mergeCells('A1:G1');
      wsPromocoes.getCell('A1').value = 'PROMOÇÕES ATIVAS - CAMPANHAS ESPECIAIS';
      wsPromocoes.getCell('A1').style = {
        font: { bold: true, size: 14, color: { argb: 'EA580C' } },
        alignment: { horizontal: 'center', vertical: 'middle' },
        fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FED7AA' } }
      };
      wsPromocoes.getRow(1).height = 25;

      wsPromocoes.addRow([]);
      wsPromocoes.addRow(['ID', 'Nome da Promoção', 'Descrição', 'Desconto', 'Data Início', 'Data Fim', 'Status']);
      
      dados.promocoes.forEach((item, index) => {
        const agora = new Date();
        const dataInicio = item.dataInicio ? new Date(item.dataInicio) : null;
        const dataFim = item.dataFim ? new Date(item.dataFim) : null;
        
        let status = '⏳ Pendente';
        if (dataInicio && dataFim) {
          if (agora < dataInicio) status = '🕐 Agendada';
          else if (agora > dataFim) status = '❌ Expirada';
          else status = '✅ Ativa';
        }
        
        wsPromocoes.addRow([
          index + 1,
          item.nome || 'N/A',
          item.descricao || 'N/A',
          (item.descontoPercentual || 0) + '%',
          dataInicio ? dataInicio.toLocaleDateString('pt-BR') : 'N/A',
          dataFim ? dataFim.toLocaleDateString('pt-BR') : 'N/A',
          status
        ]);
      });
      
      // Aplicar estilos
      wsPromocoes.getRow(3).eachCell((cell) => {
        cell.style = headerStyle;
      });

      // Estilizar dados
      for (let i = 4; i <= 3 + dados.promocoes.length; i++) {
        // ID
        wsPromocoes.getCell(`A${i}`).style = {
          ...dataStyle,
          alignment: { horizontal: 'center' },
          font: { bold: true, color: { argb: 'EA580C' } }
        };
        
        // Nome
        wsPromocoes.getCell(`B${i}`).style = {
          ...dataStyle,
          font: { bold: true, size: 11 }
        };
        
        // Descrição
        wsPromocoes.getCell(`C${i}`).style = dataStyle;
        
        // Desconto
        wsPromocoes.getCell(`D${i}`).style = {
          ...dataStyle,
          alignment: { horizontal: 'center' },
          font: { bold: true, color: { argb: 'DC2626' } }
        };
        
        // Datas
        wsPromocoes.getCell(`E${i}`).style = {
          ...dataStyle,
          alignment: { horizontal: 'center' }
        };
        wsPromocoes.getCell(`F${i}`).style = {
          ...dataStyle,
          alignment: { horizontal: 'center' }
        };
        
        // Status
        wsPromocoes.getCell(`G${i}`).style = {
          ...dataStyle,
          alignment: { horizontal: 'center' },
          font: { bold: true }
        };
      }
      
      wsPromocoes.getColumn(1).width = 8;
      wsPromocoes.getColumn(2).width = 25;
      wsPromocoes.getColumn(3).width = 35;
      wsPromocoes.getColumn(4).width = 12;
      wsPromocoes.getColumn(5).width = 15;
      wsPromocoes.getColumn(6).width = 15;
      wsPromocoes.getColumn(7).width = 15;
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
    const margemDireita = 190;
    let posicaoY = 20;
    
    // Cabeçalho principal simples
    doc.setFontSize(20);
    doc.setTextColor(0, 0, 0);
    doc.text('DECOLATOUR - RELATORIO ADMINISTRATIVO', margemEsquerda, posicaoY);
    
    posicaoY += 10;
    doc.setFontSize(12);
    doc.setTextColor(100, 100, 100);
    doc.text(`Gerado em: ${dados.dataGeracao}`, margemEsquerda, posicaoY);
    
    posicaoY += 20;
    
    // Linha separadora
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.5);
    doc.line(margemEsquerda, posicaoY, margemDireita, posicaoY);
    posicaoY += 15;
    
    // Seção 1: Métricas Gerais
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text('METRICAS GERAIS', margemEsquerda, posicaoY);
    posicaoY += 15;
    
    doc.setFontSize(12);
    doc.setTextColor(50, 50, 50);
    
    const metricas = [
      ['Total de Reservas:', (dados.metricas.totalReservas || 0).toString()],
      ['Total de Clientes:', (dados.metricas.totalClientes || 0).toString()],
      ['Total de Pacotes:', (dados.metricas.totalPacotes || 0).toString()],
      ['Faturamento Total:', `R$ ${(dados.metricas.faturamento || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`]
    ];
    
    metricas.forEach((metrica, index) => {
      doc.text(metrica[0], margemEsquerda, posicaoY + (index * 8));
      doc.text(metrica[1], margemEsquerda + 80, posicaoY + (index * 8));
    });
    
    posicaoY += (metricas.length * 8) + 20;
    
    // Linha separadora
    doc.line(margemEsquerda, posicaoY, margemDireita, posicaoY);
    posicaoY += 15;
    
    // Seção 2: Faturamento Mensal
    if (dados.faturamento && dados.faturamento.length > 0) {
      // Verificar se precisa de nova página
      if (posicaoY > 220) {
        doc.addPage();
        posicaoY = 20;
      }
      
      doc.setFontSize(16);
      doc.setTextColor(0, 0, 0);
      doc.text('FATURAMENTO MENSAL', margemEsquerda, posicaoY);
      posicaoY += 15;
      
      doc.setFontSize(12);
      doc.setTextColor(50, 50, 50);
      
      // Cabeçalhos da tabela
      doc.text('Periodo', margemEsquerda, posicaoY);
      doc.text('Valor', margemEsquerda + 60, posicaoY);
      doc.text('Crescimento', margemEsquerda + 120, posicaoY);
      
      posicaoY += 10;
      
      dados.faturamento.slice(0, 10).forEach((item, index) => {
        const valorAnterior = index > 0 ? dados.faturamento[index - 1].valor : item.valor;
        const crescimento = index > 0 ? ((item.valor - valorAnterior) / valorAnterior * 100) : 0;
        
        doc.text(item.mes || 'N/A', margemEsquerda, posicaoY + (index * 8));
        doc.text(`R$ ${(item.valor || 0).toLocaleString('pt-BR')}`, margemEsquerda + 60, posicaoY + (index * 8));
        doc.text(`${crescimento.toFixed(1)}%`, margemEsquerda + 120, posicaoY + (index * 8));
      });
      
      posicaoY += (Math.min(dados.faturamento.length, 10) * 8) + 20;
      
      // Linha separadora
      doc.line(margemEsquerda, posicaoY, margemDireita, posicaoY);
      posicaoY += 15;
    }
    
    // Seção 3: Destinos Populares
    if (dados.destinos && dados.destinos.length > 0) {
      if (posicaoY > 220) {
        doc.addPage();
        posicaoY = 20;
      }
      
      doc.setFontSize(16);
      doc.setTextColor(0, 0, 0);
      doc.text('DESTINOS POPULARES', margemEsquerda, posicaoY);
      posicaoY += 15;
      
      doc.setFontSize(12);
      doc.setTextColor(50, 50, 50);
      
      // Cabeçalhos
      doc.text('Posicao', margemEsquerda, posicaoY);
      doc.text('Destino', margemEsquerda + 40, posicaoY);
      doc.text('Reservas', margemEsquerda + 120, posicaoY);
      
      posicaoY += 10;
      
      dados.destinos.slice(0, 10).forEach((item, index) => {
        doc.text(`${index + 1}`, margemEsquerda, posicaoY + (index * 8));
        doc.text(item.destino || 'N/A', margemEsquerda + 40, posicaoY + (index * 8));
        doc.text((item.reservas || 0).toString(), margemEsquerda + 120, posicaoY + (index * 8));
      });
      
      posicaoY += (Math.min(dados.destinos.length, 10) * 8) + 20;
      
      // Linha separadora
      doc.line(margemEsquerda, posicaoY, margemDireita, posicaoY);
      posicaoY += 15;
    }
    
    // Nova página para clientes se necessário
    if (posicaoY > 200) {
      doc.addPage();
      posicaoY = 20;
    }
    
    // Seção 4: Clientes Frequentes
    if (dados.clientes && dados.clientes.length > 0) {
      doc.setFontSize(16);
      doc.setTextColor(0, 0, 0);
      doc.text('CLIENTES FREQUENTES', margemEsquerda, posicaoY);
      posicaoY += 15;
      
      doc.setFontSize(10);
      doc.setTextColor(50, 50, 50);
      
      // Cabeçalhos
      doc.text('Nome', margemEsquerda, posicaoY);
      doc.text('Email', margemEsquerda + 60, posicaoY);
      doc.text('Reservas', margemEsquerda + 120, posicaoY);
      doc.text('Valor Gasto', margemEsquerda + 150, posicaoY);
      
      posicaoY += 10;
      
      dados.clientes.slice(0, 15).forEach((item, index) => {
        const yPos = posicaoY + (index * 8);
        
        // Quebrar nome se muito longo
        const nomeQuebrado = doc.splitTextToSize(item.nome || 'N/A', 55);
        const emailQuebrado = doc.splitTextToSize(item.email || 'N/A', 55);
        
        doc.text(nomeQuebrado[0] || '', margemEsquerda, yPos);
        doc.text(emailQuebrado[0] || '', margemEsquerda + 60, yPos);
        doc.text((item.reservas || 0).toString(), margemEsquerda + 120, yPos);
        
        if (item.totalSpent && item.totalSpent > 0) {
          doc.text(`R$ ${item.totalSpent.toLocaleString('pt-BR')}`, margemEsquerda + 150, yPos);
        } else {
          doc.text('R$ 0,00', margemEsquerda + 150, yPos);
        }
      });
      
      posicaoY += (Math.min(dados.clientes.length, 15) * 8) + 20;
      
      // Linha separadora
      doc.line(margemEsquerda, posicaoY, margemDireita, posicaoY);
      posicaoY += 15;
    }
    
    // Seção 5: Promoções Ativas
    if (dados.promocoes && dados.promocoes.length > 0) {
      if (posicaoY > 180) {
        doc.addPage();
        posicaoY = 20;
      }
      
      doc.setFontSize(16);
      doc.setTextColor(0, 0, 0);
      doc.text('PROMOCOES ATIVAS', margemEsquerda, posicaoY);
      posicaoY += 15;
      
      doc.setFontSize(10);
      doc.setTextColor(50, 50, 50);
      
      dados.promocoes.slice(0, 8).forEach((item, index) => {
        const yPos = posicaoY + (index * 20);
        
        // Nome da promoção
        doc.setFontSize(12);
        doc.text(item.nome || 'N/A', margemEsquerda, yPos);
        
        // Desconto
        doc.setFontSize(10);
        doc.text(`Desconto: ${item.descontoPercentual || 0}%`, margemEsquerda + 100, yPos);
        
        // Descrição
        const descricaoQuebrada = doc.splitTextToSize(item.descricao || 'N/A', 150);
        doc.text(descricaoQuebrada[0] || '', margemEsquerda, yPos + 8);
        
        // Datas
        const dataInicio = item.dataInicio ? new Date(item.dataInicio).toLocaleDateString('pt-BR') : 'N/A';
        const dataFim = item.dataFim ? new Date(item.dataFim).toLocaleDateString('pt-BR') : 'N/A';
        doc.text(`Periodo: ${dataInicio} ate ${dataFim}`, margemEsquerda, yPos + 16);
      });
    }
    
    // Adicionar rodapé simples em todas as páginas
    const totalPaginas = doc.internal.getNumberOfPages();
    for (let i = 1; i <= totalPaginas; i++) {
      doc.setPage(i);
      
      // Linha do rodapé
      doc.setDrawColor(200, 200, 200);
      doc.setLineWidth(0.3);
      doc.line(margemEsquerda, doc.internal.pageSize.height - 20, margemDireita, doc.internal.pageSize.height - 20);
      
      // Texto do rodapé
      doc.setFontSize(8);
      doc.setTextColor(100, 100, 100);
      doc.text('DecolaTour Admin Panel - Relatorio Administrativo', margemEsquerda, doc.internal.pageSize.height - 12);
      doc.text(`Pagina ${i} de ${totalPaginas}`, margemDireita - 30, doc.internal.pageSize.height - 12);
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
    
    // Configurações iniciais
    const margemEsquerda = 20;
    const margemDireita = 190;
    let posicaoY = 20;
    
    // Cabeçalho principal simples
    doc.setFontSize(20);
    doc.setTextColor(0, 0, 0);
    doc.text('DECOLATOUR - RELATORIO MENSAL', margemEsquerda, posicaoY);
    
    posicaoY += 10;
    doc.setFontSize(14);
    doc.setTextColor(100, 100, 100);
    doc.text(`Periodo: ${mesAtual.toString().padStart(2, '0')}/${anoAtual}`, margemEsquerda, posicaoY);
    
    posicaoY += 8;
    doc.setFontSize(12);
    doc.text(`Gerado em: ${dados.dataGeracao}`, margemEsquerda, posicaoY);
    
    posicaoY += 20;
    
    // Linha separadora
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.5);
    doc.line(margemEsquerda, posicaoY, margemDireita, posicaoY);
    posicaoY += 15;
    
    // Resumo mensal
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text('RESUMO DO MES', margemEsquerda, posicaoY);
    posicaoY += 15;
    
    // Faturamento do mês
    const faturamentoMes = faturamentoMesAtual.length > 0 ? faturamentoMesAtual[0].valor : 0;
    
    doc.setFontSize(12);
    doc.setTextColor(50, 50, 50);
    
    const resumoMensal = [
      ['Faturamento do Mes:', `R$ ${faturamentoMes.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`],
      ['Total Geral de Reservas:', (dados.metricas.totalReservas || 0).toString()],
      ['Total Geral de Clientes:', (dados.metricas.totalClientes || 0).toString()],
      ['Total Geral de Pacotes:', (dados.metricas.totalPacotes || 0).toString()]
    ];
    
    resumoMensal.forEach((item, index) => {
      doc.text(item[0], margemEsquerda, posicaoY + (index * 10));
      doc.text(item[1], margemEsquerda + 100, posicaoY + (index * 10));
    });
    
    posicaoY += (resumoMensal.length * 10) + 20;
    
    // Linha separadora
    doc.line(margemEsquerda, posicaoY, margemDireita, posicaoY);
    posicaoY += 15;
    
    // Top 5 Destinos
    if (dados.destinos && dados.destinos.length > 0) {
      doc.setFontSize(16);
      doc.setTextColor(0, 0, 0);
      doc.text('TOP 5 DESTINOS POPULARES', margemEsquerda, posicaoY);
      posicaoY += 15;
      
      doc.setFontSize(12);
      doc.setTextColor(50, 50, 50);
      
      // Cabeçalhos
      doc.text('Posicao', margemEsquerda, posicaoY);
      doc.text('Destino', margemEsquerda + 40, posicaoY);
      doc.text('Reservas', margemEsquerda + 120, posicaoY);
      
      posicaoY += 10;
      
      dados.destinos.slice(0, 5).forEach((item, index) => {
        doc.text(`${index + 1}`, margemEsquerda, posicaoY + (index * 8));
        doc.text(item.destino || 'N/A', margemEsquerda + 40, posicaoY + (index * 8));
        doc.text((item.reservas || 0).toString(), margemEsquerda + 120, posicaoY + (index * 8));
      });
      
      posicaoY += 50;
    }
    
    // Análise comparativa
    if (dados.faturamento && dados.faturamento.length > 1) {
      // Linha separadora
      doc.line(margemEsquerda, posicaoY, margemDireita, posicaoY);
      posicaoY += 15;
      
      doc.setFontSize(16);
      doc.setTextColor(0, 0, 0);
      doc.text('ANALISE COMPARATIVA', margemEsquerda, posicaoY);
      posicaoY += 15;
      
      const mesAnterior = dados.faturamento[dados.faturamento.length - 2];
      const crescimento = mesAnterior ? ((faturamentoMes - mesAnterior.valor) / mesAnterior.valor * 100) : 0;
      
      doc.setFontSize(12);
      doc.setTextColor(50, 50, 50);
      
      const comparativo = [
        ['Mes Anterior:', `R$ ${(mesAnterior?.valor || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`],
        ['Mes Atual:', `R$ ${faturamentoMes.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`],
        ['Variacao:', `${crescimento.toFixed(1)}%`],
        ['Status:', crescimento > 0 ? 'Crescimento' : crescimento < 0 ? 'Queda' : 'Estavel']
      ];
      
      comparativo.forEach((item, index) => {
        doc.text(item[0], margemEsquerda, posicaoY + (index * 10));
        doc.text(item[1], margemEsquerda + 80, posicaoY + (index * 10));
      });
    }
    
    // Rodapé simples
    doc.setDrawColor(200, 200, 200);
    doc.line(margemEsquerda, doc.internal.pageSize.height - 20, margemDireita, doc.internal.pageSize.height - 20);
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.text('DecolaTour Admin Panel - Relatorio Mensal', margemEsquerda, doc.internal.pageSize.height - 12);
    
    const nomeArquivo = `relatorio-mensal-${mesAtual.toString().padStart(2, '0')}-${anoAtual}.pdf`;
    doc.save(nomeArquivo);
    
    console.log('Exportação do relatório mensal concluída!');
    return { sucesso: true, arquivo: nomeArquivo };
    
  } catch (error) {
    console.error('Erro ao exportar relatório mensal:', error);
    throw new Error('Falha ao gerar relatório mensal: ' + error.message);
  }
}
