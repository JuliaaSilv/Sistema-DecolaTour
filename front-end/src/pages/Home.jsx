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
      console.log('🔄 Tentando buscar dados do backend...');
      
      // TEMPORÁRIO: Força uso de dados mockados para debug
      console.log('🧪 DEBUG: Forçando uso de dados mockados...');
      setFeaturedPackages(getMockedPackages());
      setIsLoading(false);
      return;
      
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
                    `http://localhost:5295${pkg.imagens[0].url}` : 
                    (pkg.imagemUrl ? `http://localhost:5295${pkg.imagemUrl}` : '/packages/default.jpg'),
            descricao: pkg.descricao
          }));
          
          setFeaturedPackages(adaptedPackages);
          return;
        }
      }
      
      console.log('⚠️ Backend sem dados ou erro. Usando dados mockados...');
      // Fallback para dados mockados
      setFeaturedPackages(getMockedPackages());
      
    } catch (error) {
      console.error('❌ Erro ao carregar dados do backend:', error);
      console.log('🔄 Carregando dados mockados como fallback...');
      setFeaturedPackages(getMockedPackages());
    } finally {
      setIsLoading(false);
    }
  };

  // Dados mockados como fallback
  const getMockedPackages = () => {
    return [
      {
        id: 'mock-1',
        nome: 'Pacotes para Rio de Janeiro',
        destino: 'Rio de Janeiro, RJ',
        preco: 1092,
        precoOriginal: 1310,
        duracao: '10 DIAS / 9 NOITES',
        categoria: 'PACOTE',
        origem: 'Saindo de São Paulo',
        inclusions: 'Hotel + Aéreo',
        economia: 'R$318',
        rating: 8.3,
        ofertaEspecial: false,
        imagem: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=400',
        descricao: 'Descubra a Cidade Maravilhosa com suas praias icônicas'
      },
      {
        id: 'mock-2',
        nome: 'Pacotes para Maceió',
        destino: 'Maceió, AL',
        preco: 2562,
        precoOriginal: 3024,
        duracao: '11 DIAS / 10 NOITES',
        categoria: 'PACOTE',
        origem: 'Saindo de São Paulo',
        inclusions: 'Hotel + Aéreo',
        economia: 'R$462',
        rating: 8.5,
        ofertaEspecial: false,
        imagem: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400',
        descricao: 'Praias paradisíacas com águas cristalinas'
      },
      {
        id: 'mock-3',
        nome: 'Pacotes para Natal',
        destino: 'Natal, RN',
        preco: 2506,
        precoOriginal: 2898,
        duracao: '10 DIAS / 9 NOITES',
        categoria: 'PACOTE',
        origem: 'Saindo de São Paulo',
        inclusions: 'Hotel + Aéreo',
        economia: 'R$392',
        rating: 7.8,
        ofertaEspecial: false,
        imagem: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400',
        descricao: 'Dunas, lagoas e praias deslumbrantes'
      },
      {
        id: 'mock-4',
        nome: 'Pacotes para São Paulo',
        destino: 'São Paulo, SP',
        preco: 545,
        precoOriginal: null,
        duracao: '4 DIAS / 3 NOITES',
        categoria: 'PACOTE',
        origem: 'Saindo de Rio de Janeiro',
        inclusions: 'Hotel + Aéreo',
        economia: null,
        rating: 8.4,
        ofertaEspecial: true,
        imagem: 'https://images.unsplash.com/photo-1541742126113-cc51c22f86a6?w=400',
        descricao: 'A metrópole que nunca dorme'
      },
      {
        id: 'mock-5',
        nome: 'Pacotes para Florianópolis',
        destino: 'Florianópolis, SC',
        preco: 1890,
        precoOriginal: 2150,
        duracao: '7 DIAS / 6 NOITES',
        categoria: 'PACOTE',
        origem: 'Saindo de São Paulo',
        inclusions: 'Hotel + Aéreo',
        economia: 'R$260',
        rating: 8.7,
        ofertaEspecial: false,
        imagem: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400',
        descricao: 'Ilha da Magia com praias paradisíacas'
      },
      {
        id: 'mock-6',
        nome: 'Pacotes para Salvador',
        destino: 'Salvador, BA',
        preco: 1650,
        precoOriginal: 1890,
        duracao: '8 DIAS / 7 NOITES',
        categoria: 'PACOTE',
        origem: 'Saindo de São Paulo',
        inclusions: 'Hotel + Aéreo',
        economia: 'R$240',
        rating: 8.2,
        ofertaEspecial: false,
        imagem: 'https://images.unsplash.com/photo-1516306580123-e6e52b1b7b5f?w=400',
        descricao: 'História, cultura e praias incríveis'
      },
      {
        id: 'mock-7',
        nome: 'Pacotes para Fortaleza',
        destino: 'Fortaleza, CE',
        preco: 2100,
        precoOriginal: 2400,
        duracao: '9 DIAS / 8 NOITES',
        categoria: 'PACOTE',
        origem: 'Saindo de São Paulo',
        inclusions: 'Hotel + Aéreo',
        economia: 'R$300',
        rating: 8.1,
        ofertaEspecial: false,
        imagem: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400',
        descricao: 'Sol, praia e cultura nordestina'
      },
      {
        id: 'mock-8',
        nome: 'Pacotes para Gramado',
        destino: 'Gramado, RS',
        preco: 980,
        precoOriginal: 1200,
        duracao: '5 DIAS / 4 NOITES',
        categoria: 'PACOTE',
        origem: 'Saindo de São Paulo',
        inclusions: 'Hotel + Aéreo',
        economia: 'R$220',
        rating: 9.1,
        ofertaEspecial: false,
        imagem: 'https://images.unsplash.com/photo-1570718561584-34de807b4527?w=400',
        descricao: 'Charme europeu no sul do Brasil'
      }
    ];
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
                          e.target.src = 'https://via.placeholder.com/400x300/e5e5e5/999999?text=Sem+Imagem';
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
                <div className="col-span-full text-center py-8">
                  <p className="text-red-500 text-lg">DEBUG: Nenhum pacote encontrado</p>
                  <p className="text-gray-500">featuredPackages.length = {featuredPackages.length}</p>
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
