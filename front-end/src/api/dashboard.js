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
    
    // Buscar todas as reservas para calcular faturamento real
    const reservas = await fetchReservas();
    
    // Calcular faturamento total real
    let faturamentoReal = 0;
    for (const reserva of reservas) {
      const valorReal = await calcularValorRealReserva(reserva);
      faturamentoReal += valorReal;
    }
    
    // Calcular faturamento mensal (últimos 30 dias)
    let faturamentoMensal = 0;
    const dataLimite = new Date();
    dataLimite.setDate(dataLimite.getDate() - 30);
    
    for (const reserva of reservas) {
      const dataReserva = new Date(reserva.dataReserva);
      if (dataReserva >= dataLimite) {
        const valorReal = await calcularValorRealReserva(reserva);
        faturamentoMensal += valorReal;
      }
    }
    
    return {
      ...metricasBasicas,
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
    
    // Buscar todas as reservas
    const reservas = await fetchReservas();
    
    // Criar um mapa de faturamento por mês com valores reais
    const faturamentoPorMes = {};
    
    for (const reserva of reservas) {
      const dataReserva = new Date(reserva.dataReserva);
      const chaveData = `${dataReserva.getFullYear()}-${(dataReserva.getMonth() + 1).toString().padStart(2, '0')}`;
      
      if (!faturamentoPorMes[chaveData]) {
        faturamentoPorMes[chaveData] = 0;
      }
      
      const valorReal = await calcularValorRealReserva(reserva);
      faturamentoPorMes[chaveData] += valorReal;
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
    
    // Buscar todas as reservas para calcular valores reais
    const reservas = await fetchReservas();
    
    // Calcular valores reais por cliente
    const clientesComValores = await Promise.all(
      clientesBasicos.map(async (cliente) => {
        // Filtrar reservas do cliente
        const reservasCliente = reservas.filter(reserva => {
          const emailMatch = reserva.email && reserva.email.toLowerCase() === cliente.email.toLowerCase();
          const nomeMatch = reserva.cliente && reserva.cliente.toLowerCase() === cliente.nome.toLowerCase();
          return emailMatch || nomeMatch;
        });
        
        // Calcular total gasto real
        let totalGasto = 0;
        for (const reserva of reservasCliente) {
          const valorReal = await calcularValorRealReserva(reserva);
          totalGasto += valorReal;
        }
        
        // Determinar tier baseado no valor gasto
        let tier = 'Bronze';
        if (totalGasto >= 50000) {
          tier = 'Platinum';
        } else if (totalGasto >= 25000) {
          tier = 'Gold';
        } else if (totalGasto >= 10000) {
          tier = 'Silver';
        }
        
        return {
          ...cliente,
          totalSpent: totalGasto,
          tier: tier
        };
      })
    );
    
    // Ordenar por valor gasto (decrescente)
    return clientesComValores.sort((a, b) => b.totalSpent - a.totalSpent);
    
  } catch (error) {
    console.error("Erro ao calcular clientes frequentes com valores reais:", error);
    // Fallback para dados básicos em caso de erro
    return await fetchClientesFrequentes();
  }
};
