import React, { useState, useEffect } from "react";
import fundo from "../assets/fundoHome.jpg";
import SimplePackageCard from "../components/common/SimplePackageCard";
import Button from "../components/common/Button";

export default function Packages() {
  const [packages, setPackages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      const response = await fetch("http://localhost:5295/api/Pacote");
      if (response.ok) {
        const data = await response.json();
        console.log("Pacotes carregados da API:", data);
        
        // Usar o mesmo mapeamento da Home.jsx
        const adaptedPackages = data.map((pkg, index) => {
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
            categoria: pkg.Categorias || pkg.categorias || "PACOTE",
            inclusions: "Hotel + Aéreo",
            economia: 5000,
            rating: 7.5 + Math.random() * 1.5,
            ofertaEspecial: index === 0,
            imagem: imagemUrl,
            descricao: pkg.Descricao || pkg.descricao,
          };
        });
        
        console.log("Pacotes adaptados:", adaptedPackages);
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

  // Separar por categorias baseado na categoria do pacote
  const nacionais = packages.filter(pkg => {
    const categoria = (pkg.categoria || '').toLowerCase();
    return categoria.includes('nacional') || 
           categoria.includes('brasil') || 
           categoria.includes('domestico') ||
           categoria.includes('nacional');
  });
  
  const internacionais = packages.filter(pkg => {
    const categoria = (pkg.categoria || '').toLowerCase();
    return categoria.includes('internacional') || 
           categoria.includes('exterior') ||
           categoria.includes('internacional');
  });

  // Se não há nenhum pacote categorizado especificamente, distribuir por destino
  if (nacionais.length === 0 && internacionais.length === 0 && packages.length > 0) {
    const destinosBrasil = ['rio de janeiro', 'são paulo', 'salvador', 'fortaleza', 'recife', 'brasília', 'manaus', 'curitiba'];
    
    packages.forEach(pkg => {
      const destino = (pkg.destino || '').toLowerCase();
      const ehBrasil = destinosBrasil.some(cidade => destino.includes(cidade));
      
      if (ehBrasil) {
        nacionais.push(pkg);
      } else {
        internacionais.push(pkg);
      }
    });
  }

  console.log("Total de pacotes:", packages.length);
  console.log("Pacotes nacionais:", nacionais.length, nacionais);
  console.log("Pacotes internacionais:", internacionais.length, internacionais);

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
              <span className="block text-yellow-300 text-2xl sm:text-4xl md:text-5xl mt-2">
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
              className="bg-yellow-500 hover:bg-yellow-400 text-blue-900 font-bold py-3 sm:py-4 px-6 sm:px-8 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg text-sm sm:text-base"
            >
              Ver Pacotes Nacionais
            </button>
            <button 
              onClick={() => document.getElementById('pacotes-internacionais')?.scrollIntoView({ behavior: 'smooth' })}
              className="border-2 border-white text-white hover:bg-white hover:text-blue-900 font-bold py-3 sm:py-4 px-6 sm:px-8 rounded-full transition-all duration-300 text-sm sm:text-base"
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
        {/* Layout responsivo - mobile: 1 coluna, tablet: 2 colunas, desktop: 3-4 colunas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center">
          {isLoading ? (
            Array.from({ length: 6 }, (_, i) => (
              <div key={i} className="w-full max-w-[340px] h-[400px] bg-gray-200 rounded-xl animate-pulse"></div>
            ))
          ) : nacionais.length > 0 ? (
            nacionais.map((pkg, idx) => (
              <div key={`nacional-${pkg.id || idx}`} className="w-full max-w-[340px]">
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
            <div className="bg-white rounded-xl shadow p-8 mt-6 w-full max-w-md col-span-full">
              <h3 className="text-blue-800 text-xl font-semibold mb-2">Em breve!</h3>
              <p className="text-gray-600">Estamos preparando ofertas especiais para você aproveitar o melhor do turismo nacional.</p>
            </div>
          )}
        </div>
      </section>

      {/* Pacotes Internacionais */}
      <section id="pacotes-internacionais" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <h2 className="text-blue-900 text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
          Pacotes Internacionais
        </h2>
        <p className="text-blue-700 text-base sm:text-lg mb-8 font-medium max-w-2xl mx-auto">
          Viva experiências únicas em destinos ao redor do mundo com a Decola Tour.
        </p>
        {/* Layout responsivo - mobile: 1 coluna, tablet: 2 colunas, desktop: 3-4 colunas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center">
          {isLoading ? (
            Array.from({ length: 6 }, (_, i) => (
              <div key={i} className="w-full max-w-[340px] h-[400px] bg-gray-200 rounded-xl animate-pulse"></div>
            ))
          ) : internacionais.length > 0 ? (
            internacionais.map((pkg, idx) => (
              <div key={`internacional-${pkg.id || idx}`} className="w-full max-w-[340px]">
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
            <div className="bg-white rounded-xl shadow p-8 mt-6 w-full max-w-md col-span-full">
              <h3 className="text-blue-800 text-xl font-semibold mb-2">Em breve!</h3>
              <p className="text-gray-600">Em breve você poderá conferir nossos pacotes internacionais exclusivos.</p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}