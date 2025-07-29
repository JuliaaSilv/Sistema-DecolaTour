// Imports das imagens dos destinos
import fundo from "../assets/fundoHome.jpg";
import React, { useState, useEffect } from "react";
// Imports dos componentes
import FunctionalSearchBar from "../components/common/FunctionalSearchBar";
import Button from "../components/common/Button";
import PackageCarousel from "../components/common/PackageCarousel";

// Componente principal da página Home
export default function Home() {
  const [featuredPackages, setFeaturedPackages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Busca pacotes em destaque do backend
  useEffect(() => {
    fetchFeaturedPackages();
  }, []);

  const fetchFeaturedPackages = async () => {
    try {
      console.log('🔄 Buscando dados do backend...');
      
      const response = await fetch('http://localhost:5295/api/Pacote');
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ Dados do backend recebidos:', data);
        
        if (data && data.length > 0) {
          // Adapta os dados do backend
          const adaptedPackages = data.slice(0, 8).map((pkg, index) => ({
            id: pkg.id,
            nome: pkg.titulo || pkg.nome,
            destino: pkg.destino,
            preco: pkg.valorTotal || pkg.valorUnitario || 0,
            precoOriginal: pkg.valorTotal ? pkg.valorTotal * 1.2 : null,
            duracao: pkg.duracao ? `${pkg.duracao} DIAS / ${pkg.duracao - 1} NOITES` : undefined,
            categoria: pkg.categorias || 'PACOTE',
            origem: pkg.origem || "Saindo de São Paulo",
            inclusions: "Hotel + Aéreo",
            economia: index < 3 ? `R$${Math.floor(Math.random() * 500 + 200)}` : null,
            rating: 7.5 + Math.random() * 1.5,
            ofertaEspecial: index === data.length - 1,
            imagem: (pkg.imagens && pkg.imagens.length > 0) ? 
              pkg.imagens[0].url : 
              '/packages/default.jpg',
            href: `/package/${pkg.id}`,
            descricao: pkg.descricao
          }));
          
          setFeaturedPackages(adaptedPackages);
        } else {
          console.log('⚠️ Nenhum pacote encontrado no backend');
          setFeaturedPackages([]);
        }
      } else {
        console.error('❌ Erro na resposta do backend:', response.status);
        setFeaturedPackages([]);
      }
    } catch (error) {
      console.error('❌ Erro ao buscar pacotes:', error);
      setFeaturedPackages([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Função para lidar com a busca
  const handleSearch = (searchData) => {
    console.log('Realizando busca com:', searchData);
    // Aqui você implementaria a lógica de busca/navegação
    // Por exemplo: navegar para página de resultados com os filtros
  };

  return (
    <main className="min-h-screen bg-[#E6E6EB]">
      {/* Seção do banner principal com busca integrada */}
      <section className="relative w-full min-h-[40vh] sm:min-h-[50vh] lg:min-h-[60vh] mb-10">
        <div className="w-full h-[40vh] sm:h-[50vh] lg:h-[60vh] overflow-hidden bg-blue-400">
          <img
            src={fundo}
            alt="Banner Home - Decola Tour"
            className="w-full h-full object-cover object-center hover:scale-105 transition-transform duration-500 opacity-60"
            onError={(e) => {
              e.target.style.display = "none";
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-blue-600/30 via-blue-400/10 to-transparent"></div>
        </div>
        
        {/* Barra de busca sobreposta, flutuando entre banner e main */}
        <div className="absolute left-0 right-0 bottom-[-5rem] flex items-center justify-center z-10 px-4">
          <div className="w-full max-w-[320px] sm:max-w-[500px] md:max-w-[700px] lg:max-w-[900px] xl:max-w-[1000px] mx-auto bg-white rounded-xl border border-gray-200" style={{ borderWidth: "0.5px" }}>
            <FunctionalSearchBar onSearch={handleSearch} />
          </div>
        </div>
      </section>

      {/* DEBUG: Carrossel de Destinos Populares */}
      {isLoading ? (
        <section className="relative py-8 sm:py-12 md:py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <div className="h-8 bg-gray-200 rounded-lg w-64 mb-3 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded-lg w-96 animate-pulse"></div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {Array.from({ length: 4 }, (_, index) => (
                <div key={index} className="bg-white rounded-2xl shadow-lg overflow-hidden animate-pulse">
                  <div className="h-48 bg-gray-200"></div>
                  <div className="p-6">
                    <div className="h-4 bg-gray-200 rounded w-20 mb-2"></div>
                    <div className="h-6 bg-gray-200 rounded w-full mb-3"></div>
                    <div className="h-4 bg-gray-200 rounded w-24 mb-4"></div>
                    <div className="h-8 bg-gray-200 rounded w-32"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : (
        <section className="relative py-8 sm:py-12 md:py-16 px-4 sm:px-6 lg:px-8 bg-[#E6E6EB]">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <h1 className="text-blue-900 text-2xl sm:text-3xl md:text-4xl font-bold text-center lg:text-left">
                Destinos Populares
              </h1>
              <p className="text-blue-700 text-sm sm:text-base md:text-lg mt-3 text-center lg:text-left max-w-2xl">
                Explore os melhores destinos selecionados especialmente para você
              </p>
            </div>
            
            {/* DEBUG: Cards diretos */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {featuredPackages.length > 0 ? (
                featuredPackages.slice(0, 4).map((pkg, index) => (
                  <div 
                    key={`debug-${pkg.id || index}`}
                    className="bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
                    onClick={() => console.log('Card clicado:', pkg.nome)}
                  >
                    {/* Imagem */}
                    <div className="relative h-48 overflow-hidden bg-gray-100">
                      <img
                        src={pkg.imagem}
                        alt={pkg.nome}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          console.log('Erro na imagem:', pkg.imagem);
                          e.target.style.display = 'none';
                        }}
                      />
                      <div className="absolute top-4 left-4 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-sm">
                        {pkg.duracao || "10 DIAS / 9 NOITES"}
                      </div>
                    </div>
                    
                    {/* Conteúdo */}
                    <div className="p-4">
                      <div className="text-gray-500 text-xs font-semibold uppercase mb-1">
                        PACOTE
                      </div>
                      <h3 className="text-gray-800 text-lg font-bold mb-2">
                        {pkg.nome}
                      </h3>
                      <div className="text-blue-600 text-sm mb-2">
                        {pkg.origem}
                      </div>
                      <div className="text-gray-600 text-sm mb-3">
                        Hotel + Aéreo
                      </div>
                      
                      {/* Preço */}
                      <div className="space-y-1">
                        <div className="text-gray-500 text-xs">Preço por pessoa</div>
                        <div className="flex items-baseline">
                          <span className="text-gray-600 text-sm">R$</span>
                          <span className="text-gray-800 text-xl font-bold ml-1">
                            {typeof pkg.preco === 'number' ? pkg.preco.toLocaleString('pt-BR') : pkg.preco}
                          </span>
                        </div>
                        <div className="text-gray-500 text-xs">
                          Taxas e impostos não inclusos
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <div className="text-gray-400 mb-4">
                    <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m13-8V4a1 1 0 00-1-1H7a1 1 0 00-1 1v1m16 0h-2M4 5h2" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">
                    Nenhum pacote disponível
                  </h3>
                  <p className="text-gray-500">
                    Não há pacotes cadastrados no momento. Tente novamente mais tarde.
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Seção adicional */}
      <section className="relative py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <p className="text-blue-700 text-sm sm:text-base md:text-lg mb-6 sm:mb-8 font-medium">
            Não encontrou o destino ideal? Temos muito mais opções para você!
          </p>
          <Button 
            variant="primary" 
            size="large" 
            className="bg-orange-500 hover:bg-orange-600 text-white px-8 sm:px-12 py-3 sm:py-4 text-base sm:text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            onClick={() => window.location.href = '/packages'}
          >
            Ver Todos os Destinos
          </Button>
        </div>
      </section>
    </main>
  );
}
