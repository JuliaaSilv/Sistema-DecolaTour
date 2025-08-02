/**
 * DOCUMENTAÇÃO - Sistema de Exportação DecolaTour
 * 
 * Este sistema de exportação permite aos administradores extrair dados 
 * completos do painel administrativo em diferentes formatos.
 * 
 * FUNCIONALIDADES IMPLEMENTADAS:
 * 
 * 1. EXPORTAÇÃO EXCEL (.xlsx)
 *    - Métricas gerais (reservas, clientes, pacotes, faturamento)
 *    - Faturamento mensal detalhado
 *    - Destinos mais populares
 *    - Clientes frequentes com número de reservas
 *    - Promoções ativas com detalhes
 *    - Arquivo organizado em múltiplas planilhas
 * 
 * 2. EXPORTAÇÃO PDF
 *    - Relatório visual formatado
 *    - Todas as métricas com tabelas organizadas
 *    - Design responsivo com cores por seção
 *    - Paginação automática
 *    - Rodapé com informações do sistema
 * 
 * 3. RELATÓRIO MENSAL
 *    - Foco nos dados do mês atual
 *    - Comparativo com dados gerais
 *    - Formato PDF otimizado
 * 
 * FLUXO DE FUNCIONAMENTO:
 * 
 * 1. Usuário clica no botão de exportação
 * 2. Sistema exibe toast de "Iniciando geração..."
 * 3. Busca dados via API do AdminDashboardController
 * 4. Processa e formata os dados
 * 5. Gera arquivo (Excel/PDF)
 * 6. Inicia download automático
 * 7. Exibe toast de sucesso com nome do arquivo
 * 
 * TRATAMENTO DE ERROS:
 * - Conexão com backend
 * - Dados ausentes ou corrompidos
 * - Falhas na geração de arquivos
 * - Feedback visual via toast notifications
 * 
 * DEPENDÊNCIAS:
 * - xlsx: Para geração de arquivos Excel
 * - jspdf + jspdf-autotable: Para geração de PDFs
 * - Sistema de toast personalizado
 * 
 * SEGURANÇA:
 * - Requer autenticação (token JWT)
 * - Apenas usuários tipo 1 (Admin) e 2 (Atendente)
 * - Dados sensíveis são tratados adequadamente
 */

export const EXPORT_DOCUMENTATION = {
  version: "1.0.0",
  lastUpdate: "2025-08-01",
  features: ["Excel Export", "PDF Export", "Monthly Reports", "Toast Notifications"],
  author: "GitHub Copilot",
  status: "Production Ready"
};