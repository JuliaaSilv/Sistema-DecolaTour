/**
 * Utilitários para teste da integração de pagamento
 */

import { processarPagamento, criarReserva, converterFormaPagamento, formatarDadosCartao } from '../api/payment.js';
import { obterIdUsuario } from '../api/auth.js';

/**
 * Executa um teste completo de pagamento
 */
export async function testeCompletoPagamento(pacoteId = 17) {
  try {
    console.log('🧪 Iniciando teste completo de pagamento...');
    
    // Passo 1: Criar uma reserva de teste
    console.log('1️⃣ Criando reserva de teste...');
    const usuarioId = obterIdUsuario();
    if (!usuarioId) {
      throw new Error('Usuário não está logado. Faça login primeiro.');
    }
    
    const dadosReserva = {
      pacoteId: pacoteId,
      usuarioId: parseInt(usuarioId),
      valorUnitario: 1500.00, // Valor unitário de teste
      viajantes: [
        {
          nome: 'João Teste',
          documento: '12345678901',
          passaporte: 'BR123456789'
        },
        {
          nome: 'Maria Teste',
          documento: '10987654321',
          passaporte: 'BR987654321'
        }
      ]
    };
    
    console.log('📊 Detalhes do cálculo:');
    console.log(`- Valor unitário: R$ ${dadosReserva.valorUnitario}`);
    console.log(`- Quantidade de viajantes: ${dadosReserva.viajantes.length}`);
    console.log(`- Valor total esperado: R$ ${dadosReserva.valorUnitario * dadosReserva.viajantes.length}`);
    
    const resultadoReserva = await criarReserva(dadosReserva);
    
    if (!resultadoReserva.sucesso) {
      throw new Error(`Falha ao criar reserva: ${resultadoReserva.erro}`);
    }
    
    const reservaId = resultadoReserva.dados.id;
    console.log(`✅ Reserva criada com ID: ${reservaId}`);
    
    // Passo 2: Processar pagamento com cartão de teste
    console.log('2️⃣ Processando pagamento de teste...');
    const dadosCartaoTeste = {
      number: '4111 1111 1111 1111',
      name: 'TESTE USUARIO',
      expiry: '12/25',
      cvv: '123'
    };
    
    const dadosPagamento = {
      reservaId: reservaId,
      formaDePagamento: converterFormaPagamento('credito'),
      email: 'teste@exemplo.com',
      dadosCartao: formatarDadosCartao(dadosCartaoTeste, 1)
    };
    
    const resultadoPagamento = await processarPagamento(dadosPagamento);
    
    if (!resultadoPagamento.sucesso) {
      throw new Error(`Falha no pagamento: ${resultadoPagamento.erro}`);
    }
    
    console.log('✅ Pagamento processado com sucesso:', resultadoPagamento.dados);
    
    return {
      sucesso: true,
      reservaId: reservaId,
      pagamento: resultadoPagamento.dados,
      mensagem: 'Teste completo executado com sucesso!'
    };
    
  } catch (error) {
    console.error('❌ Erro no teste de pagamento:', error);
    return {
      sucesso: false,
      erro: error.message
    };
  }
}

/**
 * Teste apenas do processamento de pagamento (requer ID de reserva existente)
 */
export async function testeApenasPageamento(reservaId, metodoPagamento = 'credito') {
  try {
    console.log(`🧪 Testando pagamento para reserva ${reservaId}...`);
    
    let dadosPagamento = {
      reservaId: reservaId,
      formaDePagamento: converterFormaPagamento(metodoPagamento),
      email: 'teste@exemplo.com'
    };
    
    // Adicionar dados específicos por método
    if (metodoPagamento === 'credito' || metodoPagamento === 'debito') {
      const dadosCartaoTeste = {
        number: '4111 1111 1111 1111',
        name: 'TESTE USUARIO',
        expiry: '12/25',
        cvv: '123'
      };
      dadosPagamento.dadosCartao = formatarDadosCartao(dadosCartaoTeste, 1);
    } else if (metodoPagamento === 'pix') {
      dadosPagamento.dadosPix = {
        chavePix: 'teste@exemplo.com',
        tipoChave: 'email'
      };
    } else if (metodoPagamento === 'boleto') {
      dadosPagamento.dadosBoleto = {
        cpfPagador: '11111111111',
        nomePagador: 'TESTE USUARIO',
        dataVencimento: null
      };
    }
    
    const resultado = await processarPagamento(dadosPagamento);
    
    if (resultado.sucesso) {
      console.log('✅ Pagamento teste executado com sucesso:', resultado.dados);
    } else {
      console.log('❌ Pagamento teste falhou:', resultado.erro);
    }
    
    return resultado;
    
  } catch (error) {
    console.error('❌ Erro no teste de pagamento:', error);
    return {
      sucesso: false,
      erro: error.message
    };
  }
}

/**
 * Gera dados de teste aleatórios
 */
export function gerarDadosTeste() {
  const nomes = ['João Silva', 'Maria Santos', 'Pedro Oliveira', 'Ana Costa'];
  const emails = ['joao@teste.com', 'maria@teste.com', 'pedro@teste.com', 'ana@teste.com'];
  
  return {
    nome: nomes[Math.floor(Math.random() * nomes.length)],
    email: emails[Math.floor(Math.random() * emails.length)],
    cartao: {
      number: '4111 1111 1111 1111',
      name: 'TESTE USUARIO',
      expiry: '12/25',
      cvv: '123'
    }
  };
}
