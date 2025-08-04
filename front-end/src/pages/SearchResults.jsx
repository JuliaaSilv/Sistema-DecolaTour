import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Package, ArrowLeft, Filter, MapPin, Calendar, Users } from 'lucide-react';
import { searchPackagesWithFilter } from '../api/packages';
import SimplePackageCard from '../components/common/SimplePackageCard';
import Button from '../components/common/Button';

const SearchResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [packages, setPackages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchFilters, setSearchFilters] = useState({});

  useEffect(() => {
    // Obter os filtros da navegação (passados pela Home)
    const filters = location.state?.searchData || {};
    setSearchFilters(filters);
    performSearch(filters);
  }, [location]);

  const performSearch = async (filters) => {
    setIsLoading(true);
    try {
      console.log('Realizando busca com filtros:', filters);
      const results = await searchPackagesWithFilter(filters);
      console.log('Resultados da API:', results);
      
      // Verificar a estrutura de um pacote
      if (results.length > 0) {
        console.log('Estrutura do primeiro pacote:', JSON.stringify(results[0], null, 2));
        console.log('Verificando imagens do primeiro pacote:');
        console.log('- pkg.Imagens:', results[0].Imagens);
        console.log('- pkg.imagens:', results[0].imagens);
        console.log('- pkg.ImagemUrl:', results[0].ImagemUrl);
        console.log('- pkg.imagemUrl:', results[0].imagemUrl);
      }
      
      // Usar o mesmo mapeamento da Home.jsx
      const adaptedPackages = results.map((pkg, index) => {
        // Log detalhado do mapeamento de imagem
        console.log(`Mapeando pacote ${index + 1}:`, {
          'pkg.Imagens': pkg.Imagens,
          'pkg.imagens': pkg.imagens,
          'pkg.ImagemUrl': pkg.ImagemUrl,
          'pkg.imagemUrl': pkg.imagemUrl
        });

        // Lógica de imagem melhorada
        let imagemUrl = null;
        
        // Prioridade 1: Coleção Imagens (maiúsculo)
        if (pkg.Imagens && pkg.Imagens.length > 0) {
          imagemUrl = `http://localhost:5295${pkg.Imagens[0].Url}`;
        }
        // Prioridade 2: Coleção imagens (minúsculo)
        else if (pkg.imagens && pkg.imagens.length > 0) {
          imagemUrl = `http://localhost:5295${pkg.imagens[0].url || pkg.imagens[0].Url}`;
        }
        // Prioridade 3: Campo ImagemUrl
        else if (pkg.ImagemUrl) {
          imagemUrl = `http://localhost:5295${pkg.ImagemUrl}`;
        }
        // Prioridade 4: Campo imagemUrl
        else if (pkg.imagemUrl) {
          imagemUrl = `http://localhost:5295${pkg.imagemUrl}`;
        }
        // Fallback: Placeholder
        else {
          imagemUrl = `https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&h=300&fit=crop&q=80`;
        }

        console.log(`Imagem final para ${pkg.Titulo}: ${imagemUrl}`);

        return {
          id: pkg.id,
          titulo: pkg.Titulo || pkg.titulo || pkg.nome,
          destino: pkg.Destino || pkg.destino,
          estrelas: pkg.Estrelas || pkg.estrelas || 0,
          preco: pkg.ValorTotal || pkg.valorTotal || pkg.valorUnitario || 0,
          precoOriginal: 10000,
          duracao: pkg.Duracao || pkg.duracao
            ? `${(pkg.Duracao || pkg.duracao)} DIAS / ${(pkg.Duracao || pkg.duracao) - 1} NOITES`
            : undefined,
          categoria: "PACOTE",
          inclusions: "Hotel + Aéreo",
          economia: 5000,
          rating: 7.5 + Math.random() * 1.5,
          ofertaEspecial: index === 0,
          imagem: imagemUrl,
          descricao: pkg.Descricao || pkg.descricao,
        };
      });

      console.log('Pacotes adaptados para SearchResults:', adaptedPackages);
      setPackages(adaptedPackages);
    } catch (error) {
      console.error('Erro ao buscar pacotes:', error);
      setPackages([]);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  const handlePackageClick = (packageData) => {
    navigate(`/packages/${packageData.id}`, { state: { packageData } });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header com informações da busca */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between mb-4">
            <Button
              onClick={handleBackToHome}
              variant="outline"
              className="flex items-center gap-2"
            >
              <ArrowLeft size={16} />
              Voltar à página inicial
            </Button>
          </div>

          {/* Resumo da busca */}
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Filter size={20} className="text-blue-600" />
              <h2 className="text-lg font-semibold text-gray-900">
                Resultados da busca
              </h2>
            </div>
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
              {searchFilters.destino && (
                <div className="flex items-center gap-1">
                  <MapPin size={14} />
                  <span>Destino: <strong>{searchFilters.destino}</strong></span>
                </div>
              )}
              {searchFilters.dataIda && (
                <div className="flex items-center gap-1">
                  <Calendar size={14} />
                  <span>Ida: <strong>{formatDate(searchFilters.dataIda)}</strong></span>
                </div>
              )}
              {searchFilters.dataVolta && (
                <div className="flex items-center gap-1">
                  <Calendar size={14} />
                  <span>Volta: <strong>{formatDate(searchFilters.dataVolta)}</strong></span>
                </div>
              )}
              {searchFilters.pessoas && (
                <div className="flex items-center gap-1">
                  <Users size={14} />
                  <span>Viajantes: <strong>{searchFilters.pessoas}</strong></span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Resultados */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? (
          // Loading state
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }, (_, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-lg overflow-hidden animate-pulse">
                <div className="h-48 bg-gray-200"></div>
                <div className="p-6">
                  <div className="h-4 bg-gray-200 rounded w-20 mb-2"></div>
                  <div className="h-6 bg-gray-200 rounded w-full mb-3"></div>
                  <div className="h-4 bg-gray-200 rounded w-16 mb-4"></div>
                  <div className="h-8 bg-gray-200 rounded w-24"></div>
                </div>
              </div>
            ))}
          </div>
        ) : packages.length > 0 ? (
          <>
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {packages.length} {packages.length === 1 ? 'pacote encontrado' : 'pacotes encontrados'}
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {packages.map((packageData) => (
                <div key={packageData.id} onClick={() => handlePackageClick(packageData)}>
                  <SimplePackageCard
                    {...packageData}
                    className="cursor-pointer hover:shadow-xl transition-shadow duration-300"
                  />
                </div>
              ))}
            </div>
          </>
        ) : (
          // No results state
          <div className="text-center py-12">
            <Package size={64} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Nenhum pacote encontrado
            </h3>
            <p className="text-gray-600 mb-6">
              Não encontramos pacotes que correspondam aos seus critérios de busca.
              Tente ajustar os filtros ou remover algumas restrições.
            </p>
            <Button
              onClick={handleBackToHome}
              variant="primary"
              className="bg-blue-600 hover:bg-blue-700"
            >
              Nova busca
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResults;
