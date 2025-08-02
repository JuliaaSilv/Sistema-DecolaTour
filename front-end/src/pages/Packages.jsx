import React, { useState, useEffect } from "react";
import fundo from "../assets/fundoHome.jpg";
import Button from "../components/common/Button";
import ModernPackageCard from "../components/common/ModernPackageCard";

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
        setPackages(data);
      } else {
        setPackages([]);
      }
    } catch (error) {
      setPackages([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Separar por categorias (usando a lógica anterior)
  const nacionais = packages.filter(pkg => 
    pkg.categorias && (
      pkg.categorias.toLowerCase().includes('nacional') ||
      pkg.categorias.toLowerCase().includes('cidade') ||
      pkg.categorias.toLowerCase().includes('praia') && !pkg.categorias.toLowerCase().includes('internacional')
    )
  );
  const internacionais = packages.filter(pkg => 
    pkg.categorias && pkg.categorias.toLowerCase().includes('internacional')
  );

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
          
          <div className="flex flex-col sm:flex-row gap-4 mt-6">
            <button 
              onClick={() => document.getElementById('pacotes-nacionais')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-yellow-500 hover:bg-yellow-400 text-blue-900 font-bold py-4 px-8 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Ver Pacotes Nacionais
            </button>
            <button 
              onClick={() => document.getElementById('pacotes-internacionais')?.scrollIntoView({ behavior: 'smooth' })}
              className="border-2 border-white text-white hover:bg-white hover:text-blue-900 font-bold py-4 px-8 rounded-full transition-all duration-300"
            >
              Pacotes Internacionais
            </button>
          </div>
        </div>
      </section>

      {/* Pacotes Nacionais */}
      <section id="pacotes-nacionais" className="max-w-full md:max-w-4xl mx-auto px-2 sm:px-4 md:px-8 py-12 text-center">
        <h2 className="text-blue-900 text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
          Pacotes Nacionais
        </h2>
        <p className="text-blue-700 text-base sm:text-lg mb-4 font-medium">
          Descubra destinos incríveis pelo Brasil com toda comodidade e segurança.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 justify-items-center">
          {isLoading ? (
            Array.from({ length: 2 }, (_, i) => (
              <div key={i} className="w-full max-w-[320px] h-[300px] bg-gray-200 rounded-xl animate-pulse"></div>
            ))
          ) : nacionais.length > 0 ? (
            nacionais.map((pkg, idx) => (
              <ModernPackageCard
                key={`nacional-${pkg.id || idx}`}
                id={pkg.id}
                nome={pkg.titulo || pkg.nome}
                destino={pkg.destino}
                imagem={pkg.imagens && pkg.imagens.length > 0 ? `http://localhost:5295${pkg.imagens[0].url}` : (pkg.imagemUrl ? `http://localhost:5295${pkg.imagemUrl}` : '/packages/default.jpg')}
                preco={pkg.valorTotal || pkg.valorUnitario || 0}
                precoOriginal={pkg.valorTotal ? pkg.valorTotal * 1.15 : null}
                duracao={pkg.duracao ? `${pkg.duracao} DIAS / ${pkg.duracao - 1} NOITES` : undefined}
                categoria={pkg.categorias || 'NACIONAL'}
                // origem={pkg.origem || "Saindo de São Paulo"}
                inclusions="Hotel + Aéreo"
                rating={pkg.rating || 8.5}
                economia={null}
                ofertaEspecial={false}
              />
            ))
          ) : (
            <div className="bg-white rounded-xl shadow p-8 mt-6 col-span-full">
              <h3 className="text-blue-800 text-xl font-semibold mb-2">Em breve!</h3>
              <p className="text-gray-600">Estamos preparando ofertas especiais para você aproveitar o melhor do turismo nacional.</p>
            </div>
          )}
        </div>
      </section>

      {/* Pacotes Internacionais */}
      <section id="pacotes-internacionais" className="max-w-full md:max-w-4xl mx-auto px-2 sm:px-4 md:px-8 py-12 text-center">
        <h2 className="text-blue-900 text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
          Pacotes Internacionais
        </h2>
        <p className="text-blue-700 text-base sm:text-lg mb-4 font-medium">
          Viva experiências únicas em destinos ao redor do mundo com a Decola Tour.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 justify-items-center">
          {isLoading ? (
            Array.from({ length: 2 }, (_, i) => (
              <div key={i} className="w-full max-w-[320px] h-[300px] bg-gray-200 rounded-xl animate-pulse"></div>
            ))
          ) : internacionais.length > 0 ? (
            internacionais.map((pkg, idx) => (
              <ModernPackageCard
                key={`internacional-${pkg.id || idx}`}
                id={pkg.id}
                nome={pkg.titulo || pkg.nome}
                destino={pkg.destino}
                imagem={pkg.imagens && pkg.imagens.length > 0 ? `http://localhost:5295${pkg.imagens[0].url}` : (pkg.imagemUrl ? `http://localhost:5295${pkg.imagemUrl}` : '/packages/default.jpg')}
                preco={pkg.valorTotal || pkg.valorUnitario || 0}
                precoOriginal={pkg.valorTotal ? pkg.valorTotal * 1.15 : null}
                duracao={pkg.duracao ? `${pkg.duracao} DIAS / ${pkg.duracao - 1} NOITES` : undefined}
                categoria={pkg.categorias || 'INTERNACIONAL'}
                // origem={pkg.origem || "Saindo de São Paulo"}
                inclusions="Hotel + Aéreo"
                rating={pkg.rating || 8.5}
                economia={null}
                ofertaEspecial={false}
              />
            ))
          ) : (
            <div className="bg-white rounded-xl shadow p-8 mt-6 col-span-full">
              <h3 className="text-blue-800 text-xl font-semibold mb-2">Em breve!</h3>
              <p className="text-gray-600">Em breve você poderá conferir nossos pacotes internacionais exclusivos.</p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}