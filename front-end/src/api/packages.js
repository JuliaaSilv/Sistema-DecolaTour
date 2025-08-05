// API functions for packages
const API_BASE_URL = 'http://localhost:5295/api';

export const getPackage = async (identifier) => {
  try {
    console.log('API - Buscando pacote para identifier:', identifier);
    
    // Primeira tentativa: buscar todos os pacotes
    let response = await fetch(`${API_BASE_URL}/Pacote`);
    if (response.ok) {
      const packages = await response.json();
      console.log('API - todos pacotes do backend:', packages);
      
      // Busca por nome, título ou ID
      let foundPackage = packages.find(pkg => 
        (pkg.titulo && pkg.titulo.toLowerCase() === identifier.toLowerCase()) ||
        (pkg.nome && pkg.nome.toLowerCase() === identifier.toLowerCase()) ||
        pkg.id.toString() === identifier
      );
      
      // Se não encontrou, tenta buscar por ID específico
      if (!foundPackage && !isNaN(identifier)) {
        console.log('API - Tentando buscar por ID específico:', identifier);
        const idResponse = await fetch(`${API_BASE_URL}/Pacote/${identifier}`);
        if (idResponse.ok) {
          foundPackage = await idResponse.json();
          console.log('API - Pacote encontrado por ID:', foundPackage);
        }
      }
      
      return foundPackage;
    }
  } catch (error) {
    console.error('Erro ao buscar pacote:', error);
    return null;
  }
  return null;
};

export const getAllPackages = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/Pacote`);
    if (response.ok) {
      return await response.json();
    }
  } catch (error) {
    console.error('Erro ao buscar pacotes:', error);
    return [];
  }
  return [];
};

// Nova função para buscar pacotes com filtro
export const searchPackagesWithFilter = async (filtro) => {
  try {
    console.log('API - Buscando pacotes com filtro:', filtro);
    
    // Se não há filtros específicos, busca todos os pacotes e aplica filtros no frontend
    const temFiltroBackend = filtro.destino || filtro.dataIda || filtro.dataVolta || filtro.pessoas;
    
    let result = [];
    
    if (temFiltroBackend) {
      // Faz busca com filtros no backend
      const response = await fetch(`${API_BASE_URL}/Pacote/buscar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          Destino: filtro.destino || null,
          DataIda: filtro.dataIda || null,
          DataVolta: filtro.dataVolta || null,
          Viajantes: filtro.pessoas || null,
          PrecoMinimo: filtro.precoMin || null,
          PrecoMaximo: filtro.precoMax || null
        })
      });

      if (response.ok) {
        result = await response.json();
      } else {
        console.warn('Busca no backend falhou, carregando todos os pacotes...');
        // Fallback: buscar todos os pacotes
        const fallbackResponse = await fetch(`${API_BASE_URL}/Pacote`);
        if (fallbackResponse.ok) {
          result = await fallbackResponse.json();
        }
      }
    } else {
      // Se não há filtros de backend, busca todos os pacotes
      const response = await fetch(`${API_BASE_URL}/Pacote`);
      if (response.ok) {
        result = await response.json();
      }
    }
    
    console.log('API - Pacotes encontrados:', result);
    
    // Aplicar filtros de preço no frontend se necessário
    if ((filtro.precoMax && filtro.precoMax < 20000) || filtro.precoMin) {
      const filteredByPrice = result.filter(pkg => {
        const preco = pkg.ValorTotal || pkg.valorTotal || pkg.valorUnitario || 0;
        const dentroPrecoMin = !filtro.precoMin || preco >= filtro.precoMin;
        const dentroPrecoMax = !filtro.precoMax || filtro.precoMax >= 20000 || preco <= filtro.precoMax;
        return dentroPrecoMin && dentroPrecoMax;
      });
      console.log('API - Pacotes filtrados por preço no frontend:', filteredByPrice);
      return filteredByPrice;
    }
    
    return result;
  } catch (error) {
    console.error('Erro ao buscar pacotes com filtro:', error);
    return [];
  }
};
