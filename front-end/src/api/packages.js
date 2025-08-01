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
