import React, { useState, useEffect } from "react";
import fundo from "../assets/fundoHome.jpg";
import Button from "../components/common/Button";
import ModernPackageCard from "../components/common/ModernPackageCard";

export default function Packages() {
  const [backendPackages, setBackendPackages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchBackendPackages();
  }, []);

  const fetchBackendPackages = async () => {
    try {
      console.log('🔄 Packages - Tentando buscar dados do backend...');
      const response = await fetch('http://localhost:5295/api/Pacote');
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ Packages - Dados do backend recebidos:', data);
        
        if (data && data.length > 0) {
          // Adapta os dados do backend para o formato esperado pelos novos cards
          const adaptedPackages = data.map((pkg, index) => {
            const adapted = {
              id: pkg.id,
              nome: pkg.titulo || pkg.nome,
              destino: pkg.destino,
              preco: pkg.valorTotal || pkg.valorUnitario || 0,
              precoOriginal: pkg.valorTotal ? pkg.valorTotal * 1.15 : null,
              duracao: pkg.duracao ? `${pkg.duracao} DIAS / ${pkg.duracao - 1} NOITES` : undefined,
              categoria: pkg.categorias || 'PACOTE',
              origem: pkg.origem || "Saindo de São Paulo",
              inclusions: "Hotel + Aéreo",
              economia: index % 3 === 0 ? `R$${Math.floor(Math.random() * 400 + 150)}` : null,
              rating: 7.5 + Math.random() * 1.5,
              ofertaEspecial: index % 5 === 4,
              imagem: (pkg.imagens && pkg.imagens.length > 0) ? 
                      `http://localhost:5295${pkg.imagens[0].url}` : 
                      (pkg.imagemUrl ? `http://localhost:5295${pkg.imagemUrl}` : '/packages/default.jpg'),
              descricao: pkg.descricao
            };
            return adapted;
          });
          setBackendPackages(adaptedPackages);
          return;
        }
      }
      
      console.log('⚠️ Packages - Backend sem dados. Usando dados mockados...');
      setBackendPackages(getMockedPackagesData());
      
    } catch (error) {
      console.error('❌ Packages - Erro ao carregar dados do backend:', error);
      console.log('🔄 Packages - Carregando dados mockados como fallback...');
      setBackendPackages(getMockedPackagesData());
    } finally {
      setIsLoading(false);
    }
  };

  // Dados mockados expandidos para a página Packages
  const getMockedPackagesData = () => {
    return [
      {
        id: 'mock-p1',
        nome: 'Rio de Janeiro Completo',
        destino: 'Rio de Janeiro, RJ',
        preco: 1092,
        precoOriginal: 1310,
        duracao: '10 DIAS / 9 NOITES',
        categoria: 'completo',
        origem: 'Saindo de São Paulo',
        inclusions: 'Hotel + Aéreo',
        economia: 'R$218',
        rating: 8.3,
        ofertaEspecial: false,
        imagem: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=400',
        descricao: 'Cristo Redentor, Pão de Açúcar e praias famosas'
      },
      {
        id: 'mock-p2',
        nome: 'Maceió Paradise',
        destino: 'Maceió, AL',
        preco: 2562,
        precoOriginal: 3024,
        duracao: '11 DIAS / 10 NOITES',
        categoria: 'completo',
        origem: 'Saindo de São Paulo',
        inclusions: 'Hotel + Aéreo',
        economia: 'R$462',
        rating: 8.5,
        ofertaEspecial: false,
        imagem: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400',
        descricao: 'Praias paradisíacas e piscinas naturais'
      },
      {
        id: 'mock-p3',
        nome: 'Salvador Cultural',
        destino: 'Salvador, BA',
        preco: 1650,
        precoOriginal: 1890,
        duracao: '8 DIAS / 7 NOITES',
        categoria: '2em1',
        origem: 'Saindo de São Paulo',
        inclusions: 'Hotel + Aéreo',
        economia: 'R$240',
        rating: 8.2,
        ofertaEspecial: false,
        imagem: 'https://images.unsplash.com/photo-1516306580123-e6e52b1b7b5f?w=400',
        descricao: 'Pelourinho, praias e cultura afro-brasileira'
      },
      {
        id: 'mock-p4',
        nome: 'Fortaleza Beach',
        destino: 'Fortaleza, CE',
        preco: 2100,
        precoOriginal: 2400,
        duracao: '9 DIAS / 8 NOITES',
        categoria: '2em1',
        origem: 'Saindo de São Paulo',
        inclusions: 'Hotel + Aéreo',
        economia: 'R$300',
        rating: 8.1,
        ofertaEspecial: false,
        imagem: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400',
        descricao: 'Jericoacoara e praias do Ceará'
      },
      {
        id: 'mock-p5',
        nome: 'Paris Romance',
        destino: 'Paris, França',
        preco: 4500,
        precoOriginal: 5200,
        duracao: '7 DIAS / 6 NOITES',
        categoria: 'internacional',
        origem: 'Saindo de São Paulo',
        inclusions: 'Hotel + Aéreo',
        economia: 'R$700',
        rating: 9.2,
        ofertaEspecial: true,
        imagem: 'https://images.unsplash.com/photo-1502602898536-47ad22581b52?w=400',
        descricao: 'Torre Eiffel, Louvre e charme francês'
      },
      {
        id: 'mock-p6',
        nome: 'Londres Histórica',
        destino: 'Londres, Inglaterra',
        preco: 5200,
        precoOriginal: 6000,
        duracao: '8 DIAS / 7 NOITES',
        categoria: 'internacional',
        origem: 'Saindo de São Paulo',
        inclusions: 'Hotel + Aéreo',
        economia: 'R$800',
        rating: 8.9,
        ofertaEspecial: false,
        imagem: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=400',
        descricao: 'Big Ben, Museus e tradição britânica'
      },
      {
        id: 'mock-p7',
        nome: 'Tóquio Futurista',
        destino: 'Tóquio, Japão',
        preco: 6800,
        precoOriginal: 7500,
        duracao: '10 DIAS / 9 NOITES',
        categoria: 'internacional',
        origem: 'Saindo de São Paulo',
        inclusions: 'Hotel + Aéreo',
        economia: 'R$700',
        rating: 9.1,
        ofertaEspecial: false,
        imagem: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400',
        descricao: 'Tecnologia, tradição e cultura milenar'
      },
      {
        id: 'mock-p8',
        nome: 'Nova York Aventura',
        destino: 'Nova York, EUA',
        preco: 5800,
        precoOriginal: 6500,
        duracao: '9 DIAS / 8 NOITES',
        categoria: 'internacional',
        origem: 'Saindo de São Paulo',
        inclusions: 'Hotel + Aéreo',
        economia: 'R$700',
        rating: 8.8,
        ofertaEspecial: false,
        imagem: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=400',
        descricao: 'Broadway, Central Park e arranha-céus'
      }
    ];
  };

  // Função para categorizar pacotes dinamicamente
  const categorizePackages = (packages) => {
    const completos = packages.filter(pkg => {
      const categorias = (pkg.categoria || '').toLowerCase();
      const isInternacional = categorias.includes('internacional') || 
                              categorias.includes('luxo') || 
                              categorias.includes('all-inclusive');
      const is2em1 = categorias.includes('2 em 1') || categorias.includes('2em1');
      
      return !isInternacional && !is2em1;
    });

    const pacotes2em1 = packages.filter(pkg => {
      const categorias = (pkg.categoria || '').toLowerCase();
      return categorias.includes('2 em 1') || categorias.includes('2em1');
    });

    const internacionais = packages.filter(pkg => {
      const categorias = (pkg.categoria || '').toLowerCase();
      return categorias.includes('internacional') || 
             categorias.includes('luxo') || 
             categorias.includes('all-inclusive');
    });

    return { completos, pacotes2em1, internacionais };
  };

  // Combina pacotes do backend em categorias
  const { completos, pacotes2em1, internacionais } = categorizePackages(backendPackages);

  return (
    <main className="min-h-screen bg-[#E6E6EB]">
      {/* Banner de fundo */}
      <section className="relative w-full min-h-[40vh] sm:min-h-[50vh] lg:min-h-[60vh] mb-10">
        <div className="w-full h-[40vh] sm:h-[50vh] lg:h-[60vh] overflow-hidden bg-blue-400">
          <img
            src={fundo}
            alt="Banner Pacotes - Decola Tour"
            className="w-full h-full object-cover object-center hover:scale-105 transition-transform duration-500 opacity-60"
            onError={(e) => {
              e.target.style.display = "none";
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-blue-600/30 via-blue-400/10 to-transparent"></div>
        </div>
        <div className="absolute top-1/2 left-0 right-0 flex items-center justify-center px-2 sm:px-4 md:px-8 transform -translate-y-1/2">
          <h1 className="text-white text-2xl sm:text-4xl md:text-5xl font-bold text-center font-standard">
            Conheçam Nossos Pacotes
          </h1>
        </div>
      </section>

      {/* Pacotes Completos */}
      <section className="max-w-full md:max-w-6xl mx-auto px-2 sm:px-4 md:px-8 mb-14">
        <div className="mb-8">
          <h2 className="text-blue-900 text-xl sm:text-2xl md:text-3xl font-bold mb-2 text-center md:text-left">
            Pacotes Completos
          </h2>
          <p className="text-blue-700 text-sm sm:text-base mt-1 text-center md:text-left max-w-2xl font-medium mx-auto md:mx-0">
            Destinos nacionais com tudo incluído para sua comodidade
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8 justify-items-center">
          {isLoading ? (
            // Loading skeleton
            Array.from({ length: 3 }, (_, index) => (
              <div key={index} className="w-full max-w-[320px] h-[300px] bg-gray-200 rounded-xl animate-pulse"></div>
            ))
          ) : completos.length > 0 ? (
            completos.map((pacote, index) => (
              <ModernPackageCard 
                key={`completo-${pacote.id || index}-${pacote.nome}`} 
                id={pacote.id}
                nome={pacote.nome} 
                destino={pacote.destino}
                imagem={pacote.imagem} 
                preco={pacote.preco}
                precoOriginal={pacote.precoOriginal}
                duracao={pacote.duracao}
                categoria={pacote.categoria?.toUpperCase() || "PACOTE COMPLETO"}
                rating={pacote.rating}
                origem={pacote.origem}
                inclusions={pacote.inclusions}
                economia={pacote.economia}
                ofertaEspecial={pacote.ofertaEspecial}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-8">
              <p className="text-gray-500">Nenhum pacote completo disponível no momento.</p>
            </div>
          )}
        </div>
      </section>

      {/* Pacotes 2 em 1 */}
      <section className="max-w-full md:max-w-6xl mx-auto px-2 sm:px-4 md:px-8 mb-14">
        <div className="mb-8">
          <h2 className="text-blue-900 text-xl sm:text-2xl md:text-3xl font-bold mb-2 text-center md:text-left">
            Pacotes 2 em 1
          </h2>
          <p className="text-blue-700 text-sm sm:text-base mt-1 text-center md:text-left max-w-2xl font-medium mx-auto md:mx-0">
            Combine dois destinos incríveis em uma única viagem
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8 justify-items-center">
          {isLoading ? (
            // Loading skeleton
            Array.from({ length: 3 }, (_, index) => (
              <div key={index} className="w-full max-w-[320px] h-[300px] bg-gray-200 rounded-xl animate-pulse"></div>
            ))
          ) : pacotes2em1.length > 0 ? (
            pacotes2em1.map((pacote, index) => (
              <ModernPackageCard 
                key={`2em1-${pacote.id || index}-${pacote.nome}`} 
                id={pacote.id}
                nome={pacote.nome} 
                destino={pacote.destino}
                imagem={pacote.imagem} 
                preco={pacote.preco}
                precoOriginal={pacote.precoOriginal}
                duracao={pacote.duracao}
                categoria={pacote.categoria?.toUpperCase() || "PACOTE 2 EM 1"}
                rating={pacote.rating}
                origem={pacote.origem}
                inclusions={pacote.inclusions}
                economia={pacote.economia}
                ofertaEspecial={pacote.ofertaEspecial}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-8">
              <p className="text-gray-500">Nenhum pacote 2 em 1 disponível no momento.</p>
            </div>
          )}
        </div>
      </section>

      {/* Clássicos Internacionais */}
      <section className="max-w-full md:max-w-6xl mx-auto px-2 sm:px-4 md:px-8 mb-14">
        <div className="mb-8">
          <h2 className="text-blue-900 text-xl sm:text-2xl md:text-3xl font-bold mb-2 text-center md:text-left">
            Clássicos Internacionais
          </h2>
          <p className="text-blue-700 text-sm sm:text-base mt-1 text-center md:text-left max-w-2xl font-medium mx-auto md:mx-0">
            Destinos internacionais para experiências inesquecíveis
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8 justify-items-center">
          {isLoading ? (
            // Loading skeleton
            Array.from({ length: 3 }, (_, index) => (
              <div key={index} className="w-full max-w-[320px] h-[300px] bg-gray-200 rounded-xl animate-pulse"></div>
            ))
          ) : internacionais.length > 0 ? (
            internacionais.map((pacote, index) => (
              <ModernPackageCard 
                key={`internacional-${pacote.id || index}-${pacote.nome}`} 
                id={pacote.id}
                nome={pacote.nome} 
                destino={pacote.destino}
                imagem={pacote.imagem} 
                preco={pacote.preco}
                precoOriginal={pacote.precoOriginal}
                duracao={pacote.duracao}
                categoria={pacote.categoria?.toUpperCase() || "PACOTE INTERNACIONAL"}
                rating={pacote.rating}
                origem={pacote.origem}
                inclusions={pacote.inclusions}
                economia={pacote.economia}
                ofertaEspecial={pacote.ofertaEspecial}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-8">
              <p className="text-gray-500">Nenhum pacote internacional disponível no momento.</p>
            </div>
          )}
        </div>
      </section>

      {/* Seção adicional */}
      <section className="max-w-full md:max-w-4xl mx-auto px-2 sm:px-4 py-6 sm:py-8 text-center">
        <p className="text-blue-700 text-sm sm:text-base mb-6 font-medium">
          Quer um pacote personalizado? Entre em contato conosco!
        </p>
        <Button
          variant="primary"
          size="large"
          className="bg-orange-500 hover:bg-orange-600 text-white px-6 sm:px-8 md:px-12 py-3 sm:py-4 text-base sm:text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
        >
          Solicitar Orçamento
        </Button>
      </section>
    </main>
  );
}