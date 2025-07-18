
// HOME PAGE - DecolaTour


// Imports das imagens dos destinos
import fundo from "../assets/fundoHome.jpg";
import paris from "../assets/home_images/paris.png";
import lasVegas from "../assets/home_images/lasVegas.png";
import roma from "../assets/home_images/roma.png";
import milao from "../assets/home_images/milao.jpg";
import React from "react";
import veneza from "../assets/home_images/veneza.jpg";
import toquio from "../assets/home_images/toquio.jpg";
import dortmund from "../assets/home_images/dortmund.jpg";
import inglaterra from "../assets/home_images/inglaterra.jpg";
import monaco from "../assets/home_images/monaco.png";

// Imports dos componentes
import FunctionalSearchBar from "../components/common/FunctionalSearchBar";
import Button from "../components/common/Button";
import DestinationCard from "../components/common/DestinationCard";

// Dados dos destinos populares
// (exemplo, você pode substituir por dados reais ou de uma API)
const destinos = [
  { id: 1, nome: "Paris", imagem: paris, preco: "3.500" },
  { id: 2, nome: "Roma", imagem: roma, preco: "4.500" },
  { id: 3, nome: "Las Vegas", imagem: lasVegas, preco: "2.500" },
  { id: 4, nome: "Milão", imagem: milao, preco: "4.500" },
  { id: 5, nome: "Veneza", imagem: veneza, preco: "5.500" },
  { id: 6, nome: "Tóquio", imagem: toquio, preco: "4.500" },
  { id: 7, nome: "Dortmund", imagem: dortmund, preco: "3.500" },
  { id: 8, nome: "Monaco", imagem: monaco, preco: "6.500" },
  { id: 9, nome: "Londres", imagem: inglaterra, preco: "2.500" },
];

// Componente principal da página Home
export default function Home() {
  // Função para lidar com a busca
  const handleSearch = (searchData) => {
    console.log('Realizando busca com:', searchData);
    // Aqui você implementaria a lógica de busca/navegação
    // Por exemplo: navegar para página de resultados com os filtros
  };

  return (
    <main className="min-h-screen bg-[#E6E6EB]">
      {/* Seção do banner principal com busca integrada */}
      <section className="relative w-full min-h-[50vh] sm:min-h-[60vh] lg:min-h-[70vh]">
        {/* Banner de fundo */}
        <div className="w-full h-[50vh] sm:h-[60vh] md:h-[65vh] lg:h-[70vh] overflow-hidden bg-blue-400">
          <img 
            src={fundo} 
            alt="Banner principal - Decola Tour" 
            className="w-full h-full object-cover object-center hover:scale-105 transition-transform duration-500 opacity-60"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
          {/* Overlay com gradiente da identidade visual */}
          <div className="absolute inset-0 bg-gradient-to-t from-blue-600/30 via-blue-400/10 to-transparent"></div>
        </div>
        
        {/* Barra de busca sobreposta - Posicionamento centralizado */}
        <div className="absolute top-1/2 left-0 right-0 flex items-center justify-center px-4 transform -translate-y-1/2">
          <div className="w-full max-w-[320px] sm:max-w-[500px] md:max-w-[700px] lg:max-w-[900px] xl:max-w-[1000px] mx-auto">
            <FunctionalSearchBar onSearch={handleSearch} />
          </div>
        </div>
      </section>

      {/* Seção de Destinos Populares */}
      <section className="relative py-8 sm:py-12 md:py-16 lg:py-20 xl:py-24 px-4 sm:px-6 lg:px-8">
        {/* Título da seção - Tipografia responsiva com cores da identidade */}
        <div className="max-w-7xl mx-auto mb-6 sm:mb-8 lg:mb-12 relative z-10">
          <h1 className="text-blue-900 text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-center lg:text-left lg:ml-[5%] leading-tight"> 
            Destinos Populares 
          </h1>
          <p className="text-blue-700 text-sm sm:text-base md:text-lg mt-2 sm:mt-3 text-center lg:text-left lg:ml-[5%] max-w-2xl font-medium">
            Explore os melhores destinos selecionados especialmente para você
          </p>
        </div>
        
        {/* Container principal dos cards */}
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 lg:gap-6 xl:gap-8 justify-items-center">
            {destinos.map((destino) => (
              <DestinationCard
                key={destino.id}
                nome={destino.nome}
                imagem={destino.imagem}
                preco={destino.preco}
              />
            ))}
          </div>
        </div>

        {/* Seção adicional */}
        <div className="max-w-4xl mx-auto mt-12 sm:mt-16 lg:mt-20 text-center relative z-10">
          <p className="text-blue-700 text-sm sm:text-base md:text-lg mb-6 sm:mb-8 font-medium">
            Não encontrou o destino ideal? Temos muito mais opções para você!
          </p>
          <Button 
            variant="primary" 
            size="large" 
            className="bg-orange-500 hover:bg-orange-600 text-white px-8 sm:px-12 py-3 sm:py-4 text-base sm:text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Ver Todos os Destinos
          </Button>
        </div>
      </section>
    </main>
  );
}
