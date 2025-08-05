import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import fundo from "../assets/fundoHome.jpg";
import SimplePackageCard from "../components/common/SimplePackageCard";
import Button from "../components/common/Button";
import { buscarMediaAvaliacoes } from "../api/avaliacoes";

export default function Packages() {
  const [packages, setPackages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Estados para paginação
  const [currentPageNacional, setCurrentPageNacional] = useState(1);
  const [currentPageInternacional, setCurrentPageInternacional] = useState(1);
  const packagesPerPage = 9;

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      const response = await fetch("http://localhost:5295/api/Pacote");
      if (response.ok) {
        const data = await response.json();
        console.log("Pacotes carregados da API:", data);
        
        // Mapear pacotes e buscar médias de avaliação
        const adaptedPackages = await Promise.all(data.map(async (pkg, index) => {
          // Log detalhado das imagens para debug
          console.log(`Pacote ${index + 1} - ${pkg.Titulo}:`, {
            'pkg.Imagens': pkg.Imagens,
            'pkg.imagens': pkg.imagens,
            'pkg.ImagemUrl': pkg.ImagemUrl,
            'pkg.imagemUrl': pkg.imagemUrl
          });

          // Lógica de imagem igual à SearchResults
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

          // Buscar média de avaliações do pacote
          let mediaAvaliacao = { mediaNota: 0, totalAvaliacoes: 0 };
          try {
            mediaAvaliacao = await buscarMediaAvaliacoes(pkg.id);
            console.log(`Média de avaliações para ${pkg.Titulo}:`, mediaAvaliacao);
          } catch (error) {
            console.error(`Erro ao buscar média de avaliações para pacote ${pkg.id}:`, error);
          }

          return {
            id: pkg.id,
            titulo: pkg.Titulo || pkg.titulo || pkg.nome,
            destino: pkg.Destino || pkg.destino,
            estrelas: Math.round(mediaAvaliacao.mediaNota || 0), // Usar média das avaliações arredondada
            mediaAvaliacao: mediaAvaliacao.mediaNota || 0, // Valor exato da média
            totalAvaliacoes: mediaAvaliacao.totalAvaliacoes || 0,
            preco: pkg.ValorTotal || pkg.valorTotal || pkg.valorUnitario || 0,
            precoOriginal: 10000,
            duracao: pkg.Duracao || pkg.duracao
              ? `${(pkg.Duracao || pkg.duracao)} DIAS / ${(pkg.Duracao || pkg.duracao) - 1} NOITES`
              : undefined,
            categoria: pkg.Categorias || pkg.categorias || "PACOTE",
            inclusions: "Hotel + Aéreo",
            economia: 5000,
            rating: 7.5 + Math.random() * 1.5,
            ofertaEspecial: index === 0,
            imagem: imagemUrl,
            descricao: pkg.Descricao || pkg.descricao,
          };
        }));
        
        console.log("Pacotes adaptados com avaliações:", adaptedPackages);
        setPackages(adaptedPackages);
      } else {
        setPackages([]);
      }
    } catch (error) {
      console.error("Erro ao carregar pacotes:", error);
      setPackages([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Prioriza categorias explícitas e garante exclusividade entre Nacional/Internacional
  const nacionais = packages.filter(pkg => {
    const categoria = (pkg.categoria || '').toLowerCase();
    
    // Se contém 'internacional', NÃO é nacional (prioriza internacional sobre nacional)
    if (categoria.includes('internacional') || categoria.includes('exterior')) {
      return false;
    }
    
    // É nacional se explicitamente marcado como nacional OU se é brasileiro
    return categoria.includes('nacional') || 
           categoria.includes('brasil') || 
           categoria.includes('domestico');
  });
  
  const internacionais = packages.filter(pkg => {
    const categoria = (pkg.categoria || '').toLowerCase();
    
    // É internacional se explicitamente marcado como internacional
    return categoria.includes('internacional') || 
           categoria.includes('exterior');
  });

  console.log("Total de pacotes:", packages.length);
  console.log("Pacotes nacionais:", nacionais.length, nacionais);
  console.log("Pacotes internacionais:", internacionais.length, internacionais);

  // Lógica de paginação para Nacionais
  const totalPagesNacional = Math.ceil(nacionais.length / packagesPerPage);
  const startIndexNacional = (currentPageNacional - 1) * packagesPerPage;
  const endIndexNacional = startIndexNacional + packagesPerPage;
  const currentNacionais = nacionais.slice(startIndexNacional, endIndexNacional);

  // Lógica de paginação para Internacionais
  const totalPagesInternacional = Math.ceil(internacionais.length / packagesPerPage);
  const startIndexInternacional = (currentPageInternacional - 1) * packagesPerPage;
  const endIndexInternacional = startIndexInternacional + packagesPerPage;
  const currentInternacionais = internacionais.slice(startIndexInternacional, endIndexInternacional);

  // Funções de navegação
  const handlePageChangeNacional = (newPage) => {
    setCurrentPageNacional(newPage);
    document.getElementById('pacotes-nacionais')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handlePageChangeInternacional = (newPage) => {
    setCurrentPageInternacional(newPage);
    document.getElementById('pacotes-internacionais')?.scrollIntoView({ behavior: 'smooth' });
  };

  // Componente de Paginação Reutilizável
  const PaginationControls = ({ currentPage, totalPages, onPageChange }) => {
    if (totalPages <= 1) return null;

    return (
      <div className="flex justify-center items-center gap-4 mt-8">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
            currentPage === 1
              ? 'border-gray-300 text-gray-400 cursor-not-allowed'
              : 'border-blue-300 text-blue-700 hover:bg-blue-50 cursor-pointer'
          }`}
        >
          <ChevronLeft className="w-4 h-4" />
          Anterior
        </button>
        
        <div className="flex items-center gap-2">
          {Array.from({ length: totalPages }, (_, index) => {
            const page = index + 1;
            const isCurrentPage = page === currentPage;
            
            if (
              page === 1 || 
              page === totalPages || 
              (page >= currentPage - 1 && page <= currentPage + 1)
            ) {
              return (
                <button
                  key={page}
                  onClick={() => onPageChange(page)}
                  className={`px-3 py-1 rounded text-sm font-medium transition-colors cursor-pointer ${
                    isCurrentPage
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-blue-600 border border-blue-300 hover:bg-blue-50'
                  }`}
                >
                  {page}
                </button>
              );
            } else if (
              page === currentPage - 2 || 
              page === currentPage + 2
            ) {
              return <span key={page} className="px-2 text-gray-400">...</span>;
            }
            return null;
          })}
        </div>
        
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
            currentPage === totalPages
              ? 'border-gray-300 text-gray-400 cursor-not-allowed'
              : 'border-blue-300 text-blue-700 hover:bg-blue-50 cursor-pointer'
          }`}
        >
          Próxima
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    );
  };

  return (
    <main className="min-h-screen bg-[#E6E6EB]">
      {/* Banner de fundo - Versão moderna */}
      <section className="relative w-full min-h-[50vh] sm:min-h-[60vh] lg:min-h-[70vh] mb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800"></div>
        <div className="absolute inset-0 opacity-30">
          <img
            src={fundo}
            alt="Banner Pacotes - Decola Tour"
            className="w-full h-full object-cover object-center"
            onError={(e) => {
              e.target.style.display = "none";
            }}
          />
        </div>
        <div className="absolute inset-0 bg-black/20"></div>
        
        <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center">
          <div className="mb-4">
            <h1 className="text-white text-3xl sm:text-5xl md:text-6xl font-bold mb-3 leading-tight">
              Descubra o mundo
              <span className="block text-orange-400 text-2xl sm:text-4xl md:text-5xl mt-2">
                Com nossos pacotes
              </span>
            </h1>
            <p className="text-white/90 text-lg sm:text-xl md:text-2xl font-light max-w-2xl mx-auto">
              Experiências únicas aguardam por você
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 mt-6 px-4 sm:px-0">
            <button 
              onClick={() => document.getElementById('pacotes-nacionais')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 sm:py-4 px-6 sm:px-8 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg text-sm sm:text-base cursor-pointer"
            >
              Ver Pacotes Nacionais
            </button>
            <button 
              onClick={() => document.getElementById('pacotes-internacionais')?.scrollIntoView({ behavior: 'smooth' })}
              className="border-2 border-white text-white hover:bg-white hover:text-blue-900 font-bold py-3 sm:py-4 px-6 sm:px-8 rounded-full transition-all duration-300 text-sm sm:text-base cursor-pointer"
            >
              Pacotes Internacionais
            </button>
          </div>
        </div>
      </section>

      {/* Pacotes Nacionais */}
      <section id="pacotes-nacionais" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <h2 className="text-blue-900 text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
          Pacotes Nacionais
        </h2>
        <p className="text-blue-700 text-base sm:text-lg mb-8 font-medium max-w-2xl mx-auto">
          Descubra destinos incríveis pelo Brasil com toda comodidade e segurança.
        </p>
        
        {/* Informações da paginação - Nacionais */}
        {!isLoading && nacionais.length > 0 && (
          <div className="flex justify-between items-center text-sm text-gray-600 mb-6">
            <span>
              Mostrando {startIndexNacional + 1} a {Math.min(endIndexNacional, nacionais.length)} de {nacionais.length} pacotes nacionais
            </span>
            <span>Página {currentPageNacional} de {totalPagesNacional}</span>
          </div>
        )}
        
        {/* Layout flex responsivo igual à Home */}
        <div className="flex justify-center items-stretch gap-3 sm:gap-4 md:gap-6 flex-wrap">
          {isLoading ? (
            Array.from({ length: 6 }, (_, i) => (
              <div key={i} className="flex-shrink-0 w-full sm:w-auto">
                <div className="w-full max-w-[340px] h-[400px] bg-gray-200 rounded-xl animate-pulse"></div>
              </div>
            ))
          ) : currentNacionais.length > 0 ? (
            currentNacionais.map((pkg, idx) => (
              <div key={`nacional-${pkg.id || idx}`} className="flex-shrink-0 w-full sm:w-auto">
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
                  totalAvaliacoes={pkg.totalAvaliacoes}
                />
              </div>
            ))
          ) : (
            <div className="bg-white rounded-xl shadow p-8 mt-6 w-full max-w-md">
              <h3 className="text-blue-800 text-xl font-semibold mb-2">Em breve!</h3>
              <p className="text-gray-600">Estamos preparando ofertas especiais para você aproveitar o melhor do turismo nacional.</p>
            </div>
          )}
        </div>
        
        {/* Paginação para Pacotes Nacionais */}
        <PaginationControls 
          currentPage={currentPageNacional}
          totalPages={totalPagesNacional}
          onPageChange={handlePageChangeNacional}
        />
      </section>

      {/* Pacotes Internacionais */}
      <section id="pacotes-internacionais" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <h2 className="text-blue-900 text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
          Pacotes Internacionais
        </h2>
        <p className="text-blue-700 text-base sm:text-lg mb-8 font-medium max-w-2xl mx-auto">
          Viva experiências únicas em destinos ao redor do mundo com a Decola Tour.
        </p>
        
        {/* Informações da paginação - Internacionais */}
        {!isLoading && internacionais.length > 0 && (
          <div className="flex justify-between items-center text-sm text-gray-600 mb-6">
            <span>
              Mostrando {startIndexInternacional + 1} a {Math.min(endIndexInternacional, internacionais.length)} de {internacionais.length} pacotes internacionais
            </span>
            <span>Página {currentPageInternacional} de {totalPagesInternacional}</span>
          </div>
        )}
        
        {/* Layout flex responsivo igual à Home */}
        <div className="flex justify-center items-stretch gap-3 sm:gap-4 md:gap-6 flex-wrap">
          {isLoading ? (
            Array.from({ length: 6 }, (_, i) => (
              <div key={i} className="flex-shrink-0 w-full sm:w-auto">
                <div className="w-full max-w-[340px] h-[400px] bg-gray-200 rounded-xl animate-pulse"></div>
              </div>
            ))
          ) : currentInternacionais.length > 0 ? (
            currentInternacionais.map((pkg, idx) => (
              <div key={`internacional-${pkg.id || idx}`} className="flex-shrink-0 w-full sm:w-auto">
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
                  totalAvaliacoes={pkg.totalAvaliacoes}
                />
              </div>
            ))
          ) : (
            <div className="bg-white rounded-xl shadow p-8 mt-6 w-full max-w-md">
              <h3 className="text-blue-800 text-xl font-semibold mb-2">Em breve!</h3>
              <p className="text-gray-600">Em breve você poderá conferir nossos pacotes internacionais exclusivos.</p>
            </div>
          )}
        </div>
        
        {/* Paginação para Pacotes Internacionais */}
        <PaginationControls 
          currentPage={currentPageInternacional}
          totalPages={totalPagesInternacional}
          onPageChange={handlePageChangeInternacional}
        />
      </section>
    </main>
  );
}