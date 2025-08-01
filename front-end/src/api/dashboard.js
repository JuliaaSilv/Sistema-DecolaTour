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
