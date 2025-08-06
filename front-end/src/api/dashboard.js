const API_BASE_URL = "http://localhost:5295/api";

// Buscar métricas gerais do dashboard
export const fetchMetricasGerais = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/AdminDashboard/metricas-gerais`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Erro ao buscar métricas: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Erro na requisição de métricas:", error);
    throw error;
  }
};

// Buscar faturamento mensal
export const fetchFaturamentoMensal = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/AdminDashboard/faturamento-mensal`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Erro ao buscar faturamento: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Erro na requisição de faturamento:", error);
    throw error;
  }
};

// Buscar destinos populares
export const fetchDestinosPopulares = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/AdminDashboard/destinos-populares`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Erro ao buscar destinos: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Erro na requisição de destinos:", error);
    throw error;
  }
};

// Buscar destinos populares incluindo dados mock
export const fetchDestinosPopularesComMocks = async () => {
  try {
    // Buscar dados básicos do backend
    const destinosBasicos = await fetchDestinosPopulares();
    
    // Destinos dos mocks baseados nos pacotes reais do sistema
    const destinosMock = [
      { destino: 'Pantanal, Mato Grosso do Sul', reservas: 1 },
      { destino: 'Buenos Aires, Argentina', reservas: 1 },
      { destino: 'Foz do Iguaçu, Paraná', reservas: 1 },
      { destino: 'Tóquio, Japão', reservas: 1 },
      { destino: 'Manaus, Amazonas', reservas: 1 },
      { destino: 'Cancún, México', reservas: 1 },
      { destino: 'Lençóis, Bahia', reservas: 1 },
      { destino: 'Paris, França', reservas: 1 }
    ];
    
    // Combinar destinos do backend com destinos mock
    const destinosCombinados = {};
    
    // Adicionar destinos do backend
    destinosBasicos.forEach(destino => {
      const key = destino.destino || destino.nome;
      destinosCombinados[key] = (destinosCombinados[key] || 0) + (destino.reservas || destino.quantidade || 0);
    });
    
    // Adicionar destinos mock
    destinosMock.forEach(destino => {
      const key = destino.destino;
      destinosCombinados[key] = (destinosCombinados[key] || 0) + destino.reservas;
    });
    
    // Converter de volta para array e ordenar por quantidade de reservas
    return Object.entries(destinosCombinados)
      .map(([destino, reservas]) => ({ destino, reservas }))
      .sort((a, b) => b.reservas - a.reservas);
    
  } catch (error) {
    console.error("Erro ao buscar destinos populares com mocks:", error);
    // Fallback para apenas dados mock
    return [
      { destino: 'Pantanal, Mato Grosso do Sul', reservas: 1 },
      { destino: 'Buenos Aires, Argentina', reservas: 1 },
      { destino: 'Foz do Iguaçu, Paraná', reservas: 1 },
      { destino: 'Tóquio, Japão', reservas: 1 },
      { destino: 'Manaus, Amazonas', reservas: 1 },
      { destino: 'Cancún, México', reservas: 1 },
      { destino: 'Lençóis, Bahia', reservas: 1 },
      { destino: 'Paris, França', reservas: 1 }
    ];
  }
};

// Buscar clientes frequentes
export const fetchClientesFrequentes = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/AdminDashboard/clientes-frequentes`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Erro ao buscar clientes: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Erro na requisição de clientes:", error);
    throw error;
  }
};

// Calcular métricas com valores reais (incluindo taxas e descontos)
export const fetchMetricasComValoresReais = async () => {
  try {
    // Import dinâmico para evitar dependência circular
    const { fetchReservas, calcularValorRealReserva } = await import('./reservas');
    
    // Buscar métricas básicas do backend
    const metricasBasicas = await fetchMetricasGerais();
    
    // Reservas mock para adicionar às métricas (APENAS CONFIRMADAS PARA RECEITA)
    const mockReservations = [
      {
        id: 1008,
        codigo: '#100010',
        cliente: 'Paulo Henrique Costa',
        email: 'paulo.henrique@email.com',
        dataReserva: '2025-02-05',
        valor: 3200.00,
        valorTotal: 3200.00,
        status: 'confirmada'
      },
      {
        id: 1007,
        codigo: '#100009',
        cliente: 'Juliana Martins Souza',
        email: 'juliana.martins@email.com',
        dataReserva: '2025-02-03',
        valor: 9750.00,
        valorTotal: 9750.00,
        status: 'confirmada'
      },
      {
        id: 1006,
        codigo: '#100008',
        cliente: 'Roberto Santos Almeida',
        email: 'roberto.santos@email.com',
        dataReserva: '2025-02-01',
        valor: 1890.00,
        valorTotal: 1890.00,
        status: 'confirmada'
      },
      {
        id: 1005,
        codigo: '#100007',
        cliente: 'Fernanda Costa Ribeiro',
        email: 'fernanda.costa@email.com',
        dataReserva: '2025-01-30',
        valor: 15800.00,
        valorTotal: 15800.00,
        status: 'confirmada'
      },
      {
        id: 1004,
        codigo: '#100006',
        cliente: 'Carlos Eduardo Lima',
        email: 'carlos.eduardo@email.com',
        dataReserva: '2025-01-25',
        valor: 4200.00,
        valorTotal: 4200.00,
        status: 'confirmada'
      },
      {
        id: 1003,
        codigo: '#100005',
        cliente: 'Ana Carolina Ferreira',
        email: 'ana.carolina@email.com',
        dataReserva: '2025-01-22',
        valor: 12000.00,
        valorTotal: 12000.00,
        status: 'pendente' // NÃO CONTA PARA RECEITA
      },
      {
        id: 1002,
        codigo: '#100004',
        cliente: 'João Pedro Oliveira',
        email: 'joao.pedro@email.com',
        dataReserva: '2025-01-18',
        valor: 2350.00,
        valorTotal: 2350.00,
        status: 'rejeitado' // NÃO CONTA PARA RECEITA
      },
      {
        id: 1001,
        codigo: '#100003',
        cliente: 'Maria Silva Santos',
        email: 'maria.silva@email.com',
        dataReserva: '2025-01-20',
        valor: 8500.00,
        valorTotal: 8500.00,
        status: 'pendente' // NÃO CONTA PARA RECEITA
      }
    ];
    
    // Buscar todas as reservas para calcular faturamento real
    const reservas = await fetchReservas();
    
    // Combinar reservas da API com reservas mock
    const todasReservas = [...reservas, ...mockReservations];
    
    // Calcular faturamento total real (APENAS RESERVAS CONFIRMADAS)
    let faturamentoReal = 0;
    for (const reserva of todasReservas) {
      // APENAS reservas confirmadas OU com pagamento pago contribuem para a receita
      // Alcides e Anna Júlia têm pagamento "pago", logo são confirmadas
      if (reserva.status === 'confirmada' || reserva.statusPagamento === 'pago' || reserva.pagamento === 'pago') {
        const valorReal = await calcularValorRealReserva(reserva);
        faturamentoReal += valorReal;
      }
    }
    
    // Calcular faturamento mensal (últimos 30 dias, APENAS CONFIRMADAS)
    let faturamentoMensal = 0;
    const dataLimite = new Date();
    dataLimite.setDate(dataLimite.getDate() - 30);
    
    for (const reserva of todasReservas) {
      const dataReserva = new Date(reserva.dataReserva);
      if (dataReserva >= dataLimite && (reserva.status === 'confirmada' || reserva.statusPagamento === 'pago' || reserva.pagamento === 'pago')) {
        const valorReal = await calcularValorRealReserva(reserva);
        faturamentoMensal += valorReal;
      }
    }
    
    return {
      ...metricasBasicas,
      totalReservas: (metricasBasicas.totalReservas || 0) + mockReservations.length, // Adicionar reservas mock
      faturamento: faturamentoReal,
      faturamentoMensal: faturamentoMensal
    };
    
  } catch (error) {
    console.error("Erro ao calcular métricas com valores reais:", error);
    // Fallback para métricas básicas em caso de erro
    return await fetchMetricasGerais();
  }
};

// Calcular faturamento mensal com valores reais
export const fetchFaturamentoMensalComValoresReais = async () => {
  try {
    // Import dinâmico para evitar dependência circular
    const { fetchReservas, calcularValorRealReserva } = await import('./reservas');
    
    // Buscar dados básicos do backend para manter a estrutura por mês
    const faturamentoBasico = await fetchFaturamentoMensal();
    
    // Reservas mock confirmadas para adicionar aos gráficos
    const mockReservationsConfirmadas = [
      {
        id: 1008,
        dataReserva: '2025-02-05',
        valor: 3200.00,
        status: 'confirmada'
      },
      {
        id: 1007,
        dataReserva: '2025-02-03',
        valor: 9750.00,
        status: 'confirmada'
      },
      {
        id: 1006,
        dataReserva: '2025-02-01',
        valor: 1890.00,
        status: 'confirmada'
      },
      {
        id: 1005,
        dataReserva: '2025-01-30',
        valor: 15800.00,
        status: 'confirmada'
      },
      {
        id: 1004,
        dataReserva: '2025-01-25',
        valor: 4200.00,
        status: 'confirmada'
      }
    ];
    
    // Buscar todas as reservas
    const reservas = await fetchReservas();
    
    // Combinar com reservas mock confirmadas
    const todasReservas = [...reservas, ...mockReservationsConfirmadas];
    
    // Criar um mapa de faturamento por mês com valores reais (APENAS CONFIRMADAS)
    const faturamentoPorMes = {};
    
    for (const reserva of todasReservas) {
      // APENAS processar reservas confirmadas OU com pagamento pago
      // Alcides e Anna Júlia têm pagamento "pago", logo contam para receita
      if (reserva.status === 'confirmada' || reserva.statusPagamento === 'pago' || reserva.pagamento === 'pago') {
        const dataReserva = new Date(reserva.dataReserva);
        const chaveData = `${dataReserva.getFullYear()}-${(dataReserva.getMonth() + 1).toString().padStart(2, '0')}`;
        
        if (!faturamentoPorMes[chaveData]) {
          faturamentoPorMes[chaveData] = 0;
        }
        
        const valorReal = await calcularValorRealReserva(reserva);
        faturamentoPorMes[chaveData] += valorReal;
      }
    }
    
    // Atualizar os dados básicos com valores reais
    const faturamentoComValoresReais = faturamentoBasico.map(item => {
      const chaveData = item.chave || item.mes; // Adaptar para diferentes formatos de resposta do backend
      const valorReal = faturamentoPorMes[chaveData] || 0;
      
      return {
        ...item,
        valor: valorReal
      };
    });
    
    return faturamentoComValoresReais;
    
  } catch (error) {
    console.error("Erro ao calcular faturamento mensal com valores reais:", error);
    // Fallback para dados básicos em caso de erro
    return await fetchFaturamentoMensal();
  }
};

// Buscar clientes frequentes com valores reais gastos
export const fetchClientesFrequentesComValoresReais = async () => {
  try {
    // Import dinâmico para evitar dependência circular
    const { fetchReservas, calcularValorRealReserva } = await import('./reservas');
    
    // Buscar dados básicos de clientes frequentes
    const clientesBasicos = await fetchClientesFrequentes();
    
    // Clientes dos dados mock
    const clientesMock = [
      { nome: 'Paulo Henrique Costa', email: 'paulo.henrique@email.com', reservas: 1, valor: 3200.00 },
      { nome: 'Juliana Martins Souza', email: 'juliana.martins@email.com', reservas: 1, valor: 9750.00 },
      { nome: 'Roberto Santos Almeida', email: 'roberto.santos@email.com', reservas: 1, valor: 1890.00 },
      { nome: 'Fernanda Costa Ribeiro', email: 'fernanda.costa@email.com', reservas: 1, valor: 15800.00 },
      { nome: 'Carlos Eduardo Lima', email: 'carlos.eduardo@email.com', reservas: 1, valor: 4200.00 },
      { nome: 'Ana Carolina Ferreira', email: 'ana.carolina@email.com', reservas: 1, valor: 0 }, // Pendente, não conta
      { nome: 'João Pedro Oliveira', email: 'joao.pedro@email.com', reservas: 1, valor: 0 }, // Rejeitado, não conta
      { nome: 'Maria Silva Santos', email: 'maria.silva@email.com', reservas: 1, valor: 0 } // Pendente, não conta
    ];
    
    // Buscar todas as reservas para calcular valores reais
    const reservas = await fetchReservas();
    
    // Criar mapa de clientes combinados
    const clientesCombinados = {};
    
    // Processar clientes do backend
    for (const cliente of clientesBasicos) {
      const key = cliente.email.toLowerCase();
      
      // Filtrar reservas do cliente
      const reservasCliente = reservas.filter(reserva => {
        const emailMatch = reserva.email && reserva.email.toLowerCase() === key;
        const nomeMatch = reserva.cliente && reserva.cliente.toLowerCase() === cliente.nome.toLowerCase();
        return emailMatch || nomeMatch;
      });
      
      // Calcular total gasto real
      let totalGasto = 0;
      for (const reserva of reservasCliente) {
        const valorReal = await calcularValorRealReserva(reserva);
        totalGasto += valorReal;
      }
      
      clientesCombinados[key] = {
        nome: cliente.nome,
        email: cliente.email,
        reservas: cliente.reservas || reservasCliente.length,
        totalSpent: totalGasto
      };
    }
    
    // Processar clientes mock (apenas os com valor > 0, ou seja, confirmados)
    clientesMock.forEach(cliente => {
      const key = cliente.email.toLowerCase();
      if (cliente.valor > 0) { // Apenas clientes com reservas confirmadas
        if (clientesCombinados[key]) {
          // Cliente já existe, somar valores
          clientesCombinados[key].reservas += cliente.reservas;
          clientesCombinados[key].totalSpent += cliente.valor;
        } else {
          // Novo cliente
          clientesCombinados[key] = {
            nome: cliente.nome,
            email: cliente.email,
            reservas: cliente.reservas,
            totalSpent: cliente.valor
          };
        }
      }
    });
    
    // Converter para array e calcular tiers
    const clientesFinais = Object.values(clientesCombinados).map(cliente => {
      // Determinar tier baseado no valor gasto
      let tier = 'Bronze';
      if (cliente.totalSpent >= 50000) {
        tier = 'Platinum';
      } else if (cliente.totalSpent >= 25000) {
        tier = 'Gold';
      } else if (cliente.totalSpent >= 10000) {
        tier = 'Silver';
      }
      
      return {
        ...cliente,
        tier: tier
      };
    });
    
    // Ordenar por valor gasto (decrescente)
    return clientesFinais.sort((a, b) => b.totalSpent - a.totalSpent);
    
  } catch (error) {
    console.error("Erro ao calcular clientes frequentes com valores reais:", error);
    // Fallback para dados básicos em caso de erro
    return await fetchClientesFrequentes();
  }
};
