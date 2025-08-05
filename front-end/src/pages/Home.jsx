// Imports das imagens dos destinos
import fundo from "../assets/fundoHome.jpg";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// Imports dos componentes
import FunctionalSearchBar from "../components/common/FunctionalSearchBar";
import Button from "../components/common/Button";
import PackageCarousel from "../components/common/PackageCarousel";
import ModernPackageCard from "../components/common/ModernPackageCard";
import SimplePackageCard from "../components/common/SimplePackageCard";
import { Package } from "lucide-react";
import { estaLogado, obterTipoUsuario } from "../api/auth";

// Componente principal da página Home
export default function Home() {
  const [featuredPackages, setFeaturedPackages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Busca pacotes em destaque do backend
  useEffect(() => {
    fetchFeaturedPackages();
  }, []);

  const fetchFeaturedPackages = async () => {
    try {
      console.log("🔄 Buscando dados do backend...");
      const response = await fetch("http://localhost:5295/api/Pacote");
      if (response.ok) {
        const data = await response.json();
        console.log("✅ Dados do backend recebidos:", data);
        if (data && data.length > 0) {
          // Log dos campos de cada pacote recebido
          data.forEach((pkg, idx) => {
            console.log(`Pacote[${idx}]:`, {
              id: pkg.id,
              // Campos Pascal Case (DTO)
              Titulo: pkg.Titulo,
              Destino: pkg.Destino,
              Estrelas: pkg.Estrelas,
              ValorTotal: pkg.ValorTotal,
              Imagens: pkg.Imagens,
              // Campos camelCase (possível conversão)
              titulo: pkg.titulo,
              nome: pkg.nome,
              destino: pkg.destino,
              estrelas: pkg.estrelas,
              valorTotal: pkg.valorTotal,
              valorUnitario: pkg.valorUnitario,
              categorias: pkg.categorias,
              ImagemUrl: pkg.ImagemUrl,
              descricao: pkg.descricao,
            });
          });
          // Adapta os dados do backend (máximo 7 pacotes para a Home)
          const adaptedPackages = data.slice(0, 7).map((pkg, index) => {
            return {
              id: pkg.id,
              titulo: pkg.Titulo || pkg.titulo || pkg.nome,  // Renomeado para titulo
              destino: pkg.Destino || pkg.destino,
              estrelas: pkg.Estrelas || pkg.estrelas || 0, // Direto do backend
              preco: pkg.ValorTotal || pkg.valorTotal || pkg.valorUnitario || 0,
              precoOriginal: 10000,
              duracao: pkg.Duracao || pkg.duracao
                ? `${(pkg.Duracao || pkg.duracao)} DIAS / ${(pkg.Duracao || pkg.duracao) - 1} NOITES`
                : undefined,
              categoria: "PACOTE",
              // origem: pkg.origem || "Saindo de São Paulo",
              inclusions: "Hotel + Aéreo",
              economia: 5000,
              rating: 7.5 + Math.random() * 1.5,
              ofertaEspecial: index === data.length - 1,
              imagem:
                pkg.Imagens && pkg.Imagens.length > 0
                  ? `http://localhost:5295${pkg.Imagens[0].Url}`
                  : pkg.imagens && pkg.imagens.length > 0
                  ? `http://localhost:5295${pkg.imagens[0].url}`
                  : `https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&h=300&fit=crop&q=80`,
              descricao: pkg.Descricao || pkg.descricao,
            };
          });
          console.log("Pacotes adaptados para Home:", adaptedPackages);
          setFeaturedPackages(adaptedPackages);
        } else {
          console.log("⚠️ Nenhum pacote encontrado no backend");
          setFeaturedPackages([]);
        }
      } else {
        console.error("❌ Erro na resposta do backend:", response.status);
        setFeaturedPackages([]);
      }
    } catch (error) {
      console.error("❌ Erro ao buscar pacotes:", error);
      setFeaturedPackages([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Função para lidar com a busca
  const handleSearch = (searchData) => {
    console.log("Realizando busca com:", searchData);
    // Navegar para página de resultados com os filtros
    navigate('/search-results', { state: { searchData } });
  };

  return (
    <main className="min-h-screen bg-[#E6E6EB]">
      {/* Seção do banner principal - Versão melhorada e responsiva */}
      <section className="relative w-full min-h-[30vh] sm:min-h-[35vh] md:min-h-[40vh] lg:min-h-[45vh] mb-12 sm:mb-16 md:mb-20">
        <div className="w-full h-[30vh] sm:h-[35vh] md:h-[40vh] lg:h-[45vh] overflow-hidden bg-gradient-to-br from-blue-600 to-blue-800">
          <img
            src={fundo}
            alt="Banner Home - Decola Tour"
            className="w-full h-full object-cover object-center hover:scale-105 transition-transform duration-700 opacity-40"
            onError={(e) => {
              e.target.style.display = "none";
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
          
          {/* Overlay com padrão sutil */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-transparent to-purple-900/20"></div>
        </div>
        
        {/* Conteúdo do banner */}
        <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center">
          {/* Texto removido conforme solicitado */}
        </div>

        {/* Barra de busca sobreposta - Responsiva */}
        <div className="absolute left-0 right-0 bottom-[-2rem] sm:bottom-[-2.5rem] md:bottom-[-3rem] lg:bottom-[-3.5rem] flex items-center justify-center z-20 px-2 sm:px-4 md:px-6 lg:px-8">
          <div className="w-full max-w-[96%] sm:max-w-[95%] md:max-w-[700px] lg:max-w-[900px] xl:max-w-[1000px] mx-auto">
            <FunctionalSearchBar onSearch={handleSearch} />
          </div>
        </div>
      </section>

      {/* DEBUG: Carrossel de Destinos Populares */}
      {isLoading ? (
        <section className="relative py-6 sm:py-8 md:py-12 lg:py-16 px-3 sm:px-4 md:px-6 lg:px-8 mt-8 sm:mt-10 md:mt-12">
          <div className="max-w-7xl mx-auto">
            <div className="mb-6 sm:mb-8">
              <div className="h-5 sm:h-6 md:h-8 bg-gray-200 rounded-lg w-40 sm:w-48 md:w-64 mb-2 sm:mb-3 animate-pulse mx-auto lg:mx-0"></div>
              <div className="h-3 sm:h-4 bg-gray-200 rounded-lg w-56 sm:w-64 md:w-80 lg:w-96 animate-pulse mx-auto lg:mx-0"></div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
              {Array.from({ length: 4 }, (_, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl sm:rounded-2xl shadow-lg overflow-hidden animate-pulse"
                >
                  <div className="h-32 sm:h-40 md:h-48 bg-gray-200"></div>
                  <div className="p-3 sm:p-4 md:p-6">
                    <div className="h-3 sm:h-4 bg-gray-200 rounded w-16 sm:w-20 mb-2"></div>
                    <div className="h-4 sm:h-5 md:h-6 bg-gray-200 rounded w-full mb-2 sm:mb-3"></div>
                    <div className="h-3 sm:h-4 bg-gray-200 rounded w-20 sm:w-24 mb-3 sm:mb-4"></div>
                    <div className="h-6 sm:h-7 md:h-8 bg-gray-200 rounded w-24 sm:w-28 md:w-32"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : (
        <section className="relative py-2 sm:py-4 md:py-6 lg:py-8 px-3 sm:px-4 md:px-6 lg:px-8 bg-[#E6E6EB]">
          <div className="max-w-7xl mx-auto">
            <div className="mb-6 sm:mb-8">
              <h1 className="text-blue-900 text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-center lg:text-left">
                Destinos Populares
              </h1>
              <p className="text-blue-700 text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl mt-2 sm:mt-3 text-center lg:text-left max-w-4xl mx-auto lg:mx-0 whitespace-nowrap">
                Explore os melhores destinos selecionados especialmente para você
              </p>
            </div>

            {/* Se houver mais de 4 pacotes, exibe carrossel. Caso contrário, grid simples */}
            {featuredPackages.length > 4 ? (
              <PackageCarousel packages={featuredPackages} />
            ) : (
              <div className="flex justify-center items-stretch gap-3 sm:gap-4 md:gap-6 flex-wrap xl:flex-nowrap">
                {featuredPackages.length > 0 ? (
                  featuredPackages.map((pkg, index) => (
                    <div key={`simple-card-${pkg.id || index}`} className="flex-shrink-0 w-full sm:w-auto">
                      <SimplePackageCard
                        id={pkg.id}
                        imagem={pkg.imagem}
                        titulo={pkg.titulo}
                        preco={pkg.preco}
                        duracao={pkg.duracao}
                        destino={pkg.destino}
                        categoria={pkg.categoria}
                        inclusions={pkg.inclusions}
                        estrelas={pkg.estrelas}
                      />
                    </div>
                  ))
                ) : (
                  <div className="col-span-full text-center py-8 sm:py-12">
                    <div className="text-gray-400 mb-4">
                      <Package className="w-12 sm:w-16 h-12 sm:h-16 mx-auto mb-4" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-700 mb-2">
                      Nenhum pacote disponível
                    </h3>
                    <p className="text-sm sm:text-base text-gray-500">
                      Não há pacotes cadastrados no momento. Tente novamente
                      mais tarde.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Seção adicional */}
      <section className="relative py-4 sm:py-6 md:py-8 px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <p className="text-blue-700 text-xs sm:text-sm md:text-base lg:text-lg mb-4 sm:mb-6 md:mb-8 font-medium px-2">
            Não encontrou o destino ideal? Temos muito mais opções para você!
          </p>
          <Button
            variant="primary"
            size="large"
            className="px-4 sm:px-6 md:px-8 lg:px-12 py-2 sm:py-3 md:py-4 text-xs sm:text-sm md:text-base lg:text-lg font-semibold rounded-md sm:rounded-lg md:rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 w-full sm:w-auto cursor-pointer"
            onClick={() => navigate("/packages")}
          >
            Ver Todos os Destinos
          </Button>
        </div>
      </section>
    </main>
  );
}
