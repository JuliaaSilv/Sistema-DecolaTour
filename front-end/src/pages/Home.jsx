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
          // Adapta os dados do backend
          const adaptedPackages = data.slice(0, 8).map((pkg, index) => {
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
                  : "/packages/default.jpg",
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
          <div
            className="w-full max-w-[320px] sm:max-w-[500px] md:max-w-[700px] lg:max-w-[900px] xl:max-w-[1000px] mx-auto bg-white rounded-xl border border-gray-200"
            style={{ borderWidth: "0.5px" }}
          >
            <FunctionalSearchBar onSearch={handleSearch} />
          </div>
        </div>
      </section>

      {/* DEBUG: Carrossel de Destinos Populares */}
      {isLoading ? (
        <section className="relative py-8 sm:py-12 md:py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="mt-16 mb-8">
              <div className="h-8 bg-gray-200 rounded-lg w-64 mb-3 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded-lg w-96 animate-pulse"></div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {Array.from({ length: 4 }, (_, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden animate-pulse"
                >
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
        <section className="relative mt-16 py-8 sm:py-12 md:py-16 px-4 sm:px-6 lg:px-8 bg-[#E6E6EB]">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <h1 className="text-blue-900 text-2xl sm:text-3xl md:text-4xl font-bold text-center lg:text-left">
                Destinos Populares
              </h1>
              <p className="text-blue-700 text-sm sm:text-base md:text-lg mt-3 text-center lg:text-left max-w-2xl">
                Explore os melhores destinos selecionados especialmente para
                você
              </p>
            </div>

            {/* Se houver mais de 4 pacotes, exibe carrossel. Caso contrário, grid simples */}
            {featuredPackages.length > 4 ? (
              <PackageCarousel packages={featuredPackages} />
            ) : (
              <div className="flex flex-wrap justify-evenly items-stretch">
                {featuredPackages.length > 0 ? (
                  featuredPackages.map((pkg, index) => (
                    <SimplePackageCard
                      key={`simple-card-${pkg.id || index}`}
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
                  ))
                ) : (
                  <div className="col-span-full text-center py-12">
                    <div className="text-gray-400 mb-4">
                      <Package className="w-16 h-16 mx-auto mb-4" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">
                      Nenhum pacote disponível
                    </h3>
                    <p className="text-gray-500">
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
      <section className="relative py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <p className="text-blue-700 text-sm sm:text-base md:text-lg mb-6 sm:mb-8 font-medium">
            Não encontrou o destino ideal? Temos muito mais opções para você!
          </p>
          <Button
            variant="primary"
            size="large"
            className="px-8 sm:px-12 py-3 sm:py-4 text-base sm:text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            onClick={() => navigate("/packages")}
          >
            Ver Todos os Destinos
          </Button>
        </div>
      </section>
    </main>
  );
}
