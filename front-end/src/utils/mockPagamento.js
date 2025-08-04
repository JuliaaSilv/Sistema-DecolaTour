/**
 * Dados mock para testes do sistema de pagamento
 */

export const DADOS_TESTE_PAGAMENTO = {
  // Cartões para teste
  cartoes: {
    aprovado: {
      number: "4111 1111 1111 1111",
      name: "João Silva",
      expiry: "12/28",
      cvv: "123"
    },
    rejeitado: {
      number: "4111 1111 1111 0000",
      name: "Maria Santos",
      expiry: "12/25",
      cvv: "000"
    }
  },

  // Chaves PIX para teste
  pix: {
    aprovado: "usuario@exemplo.com",
    rejeitado: "teste@falha.com"
  },

  // Dados de reserva de exemplo
  reservaExemplo: {
    id: 1,
    pacoteId: 1,
    usuarioId: 1,
    valorUnitario: 1500.00
  },

  // Pacote de exemplo
  pacoteExemplo: {
    id: 1,
    titulo: "Pacote Paris Romântico",
    preco: 1500.00,
    imagens: ["https://via.placeholder.com/300x200"]
  },

  // Dados do viajante de exemplo
  viagemExemplo: {
    numeroViajantes: 2,
    email: "teste@decolatour.com.br",
    travelers: [
      {
        name: "João Silva",
        cpf: "123.456.789-00",
        birthDate: "1990-01-01"
      },
      {
        name: "Maria Silva", 
        cpf: "987.654.321-00",
        birthDate: "1992-05-15"
      }
    ]
  }
};

/**
 * Simula resposta de sucesso do pagamento
 */
export function simularRespostaPagamentoSucesso(metodo, pagamentoId = 123) {
  return {
    sucesso: true,
    dados: {
      pagamentoId: pagamentoId,
      status: 'Pendente',
      mensagem: `Pagamento via ${metodo} iniciado com sucesso`,
      comprovante: {
        codigo: `COMP-${Date.now()}`,
        dataProcessamento: new Date().toISOString(),
        valor: 1500.00,
        metodo: metodo
      },
      tempoEstimadoWebhook: metodo === 'boleto' ? 15 : 5
    }
  };
}

/**
 * Simula resposta de erro do pagamento
 */
export function simularRespostaPagamentoErro(motivo = 'Dados inválidos') {
  return {
    sucesso: false,
    erro: motivo,
    dados: {
      status: 'Rejeitado',
      codigoErro: 'PAG_001'
    }
  };
}

/**
 * Mock da API de pagamento para desenvolvimento
 */
export class MockPagamentoAPI {
  static async processarPagamento(dados) {
    // Simula delay de rede
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

    // Lógica de aprovação baseada nos dados de teste
    if (dados.formaDePagamento === 2) { // PIX
      if (dados.dadosPix?.chavePix === DADOS_TESTE_PAGAMENTO.pix.rejeitado) {
        return simularRespostaPagamentoErro('Chave PIX inválida');
      }
      return simularRespostaPagamentoSucesso('PIX');
    }

    if (dados.formaDePagamento === 0 || dados.formaDePagamento === 1) { // Cartão
      if (dados.dadosCartao?.numeroCartao?.includes('0000')) {
        return simularRespostaPagamentoErro('Cartão rejeitado');
      }
      return simularRespostaPagamentoSucesso('Cartão');
    }

    if (dados.formaDePagamento === 3) { // Boleto
      return simularRespostaPagamentoSucesso('Boleto');
    }

    return simularRespostaPagamentoErro('Método de pagamento não suportado');
  }

  static async criarReserva(dados) {
    // Simula delay
    await new Promise(resolve => setTimeout(resolve, 500));

    return {
      sucesso: true,
      dados: {
        id: Math.floor(Math.random() * 1000) + 1,
        pacoteId: dados.pacoteId,
        usuarioId: dados.usuarioId,
        valorUnitario: dados.valorUnitario,
        status: 'Pendente',
        dataReserva: new Date().toISOString()
      }
    };
  }
}

/**
 * Hook para usar dados de teste
 */
export function useDadosTeste() {
  const preencherCartaoAprovado = () => DADOS_TESTE_PAGAMENTO.cartoes.aprovado;
  const preencherCartaoRejeitado = () => DADOS_TESTE_PAGAMENTO.cartoes.rejeitado;
  const preencherPixAprovado = () => DADOS_TESTE_PAGAMENTO.pix.aprovado;
  const preencherPixRejeitado = () => DADOS_TESTE_PAGAMENTO.pix.rejeitado;

  return {
    preencherCartaoAprovado,
    preencherCartaoRejeitado, 
    preencherPixAprovado,
    preencherPixRejeitado,
    dadosExemplo: DADOS_TESTE_PAGAMENTO
  };
}
