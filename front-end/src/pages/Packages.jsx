import React from "react";
import foz from "../assets/packages_images/foz_do_iguacu.avif";
import rio from "../assets/packages_images/rio_de_janeiro.jpg";
import florianopolis from "../assets/packages_images/florianopolis.jpg";
import maceio from "../assets/packages_images/maceio.jpeg";
import puntaCana from "../assets/packages_images/punta_cana.jpg";
import santiago from "../assets/packages_images/santiago.jpg";
import buenosAires from "../assets/packages_images/buenos_aires.jpg";
import portoDeGalinhas from "../assets/packages_images/porto_de_galinhas.jpg";
import fundo from "../assets/fundoHome.jpg";
import DestinationCard from "../components/common/DestinationCard";
import Button from "../components/common/Button";

// Dados dos pacotes organizados por categoria
const pacotesCompletos = [
  { id: 1, nome: "Foz do Iguaçu", imagem: foz, preco: "2.110" },
  { id: 2, nome: "Rio de Janeiro", imagem: rio, preco: "1.355" },
  { id: 3, nome: "Florianópolis", imagem: florianopolis, preco: "807" },
];

const pacotes2em1 = [
  { id: 4, nome: "Maragogi + Porto de Galinhas", imagem: portoDeGalinhas, preco: "2.554" },
  { id: 5, nome: "Maceió + Maragogi", imagem: maceio, preco: "3.333" },
];

const pacotesInternacionais = [
  { id: 6, nome: "Punta Cana", imagem: puntaCana, preco: "5.542" },
  { id: 7, nome: "Santiago", imagem: santiago, preco: "3.960" },
  { id: 8, nome: "Buenos Aires", imagem: buenosAires, preco: "3.103" },
];

export default function Packages() {
  return (
    <main className="min-h-screen bg-[#E6E6EB]">
      {/* Banner de fundo com mesmo tamanho da Home */}
      <section className="relative w-full min-h-[50vh] sm:min-h-[60vh] lg:min-h-[70vh]">
        <div className="w-full h-[50vh] sm:h-[60vh] md:h-[65vh] lg:h-[70vh] overflow-hidden bg-blue-400">
          <img 
            src={fundo} 
            alt="Banner Pacotes - Decola Tour" 
            className="w-full h-full object-cover object-center hover:scale-105 transition-transform duration-500 opacity-60"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
          {/* Overlay com gradiente */}
          <div className="absolute inset-0 bg-gradient-to-t from-blue-600/30 via-blue-400/10 to-transparent"></div>
        </div>
        
        {/* Título centralizado no banner */}
        <div className="absolute top-1/2 left-0 right-0 flex items-center justify-center px-4 transform -translate-y-1/2">
          <h1 className="text-white text-3xl sm:text-4xl md:text-5xl font-bold text-center font-standard">
            Nossos Pacotes
          </h1>
        </div>
      </section>
      {/* Seção Pacotes Completos */}
      <section className="relative py-8 sm:py-12 md:py-16 lg:py-20 xl:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto mb-6 sm:mb-8 lg:mb-12 relative z-10">
          <h2 className="text-blue-900 text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-center lg:text-left lg:ml-[5%] leading-tight"> 
            Pacotes Completos 
          </h2>
          <p className="text-blue-700 text-sm sm:text-base md:text-lg mt-2 sm:mt-3 text-center lg:text-left lg:ml-[5%] max-w-2xl font-medium">
            Destinos nacionais com tudo incluído para sua comodidade
          </p>
        </div>
        
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 lg:gap-6 xl:gap-8 justify-items-center">
            {pacotesCompletos.map((pacote) => (
              <DestinationCard
                key={pacote.id}
                nome={pacote.nome}
                imagem={pacote.imagem}
                preco={pacote.preco}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Seção Pacotes 2 em 1 */}
      <section className="relative py-8 sm:py-12 md:py-16 lg:py-20 xl:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto mb-6 sm:mb-8 lg:mb-12 relative z-10">
          <h2 className="text-blue-900 text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-center lg:text-left lg:ml-[5%] leading-tight"> 
            Pacotes 2 em 1 
          </h2>
          <p className="text-blue-700 text-sm sm:text-base md:text-lg mt-2 sm:mt-3 text-center lg:text-left lg:ml-[5%] max-w-2xl font-medium">
            Combine dois destinos incríveis em uma única viagem
          </p>
        </div>
        
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 lg:gap-6 xl:gap-8 justify-items-center">
            {pacotes2em1.map((pacote) => (
              <DestinationCard
                key={pacote.id}
                nome={pacote.nome}
                imagem={pacote.imagem}
                preco={pacote.preco}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Seção Clássicos Internacionais */}
      <section className="relative py-8 sm:py-12 md:py-16 lg:py-20 xl:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto mb-6 sm:mb-8 lg:mb-12 relative z-10">
          <h2 className="text-blue-900 text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-center lg:text-left lg:ml-[5%] leading-tight"> 
            Clássicos Internacionais 
          </h2>
          <p className="text-blue-700 text-sm sm:text-base md:text-lg mt-2 sm:mt-3 text-center lg:text-left lg:ml-[5%] max-w-2xl font-medium">
            Destinos internacionais para experiências inesquecíveis
          </p>
        </div>
        
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 lg:gap-6 xl:gap-8 justify-items-center">
            {pacotesInternacionais.map((pacote) => (
              <DestinationCard
                key={pacote.id}
                nome={pacote.nome}
                imagem={pacote.imagem}
                preco={pacote.preco}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Seção adicional */}
      <section className="relative py-8 sm:py-12 md:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <p className="text-blue-700 text-sm sm:text-base md:text-lg mb-6 sm:mb-8 font-medium">
            Quer um pacote personalizado? Entre em contato conosco!
          </p>
          <Button 
            variant="primary" 
            size="large" 
            className="bg-orange-500 hover:bg-orange-600 text-white px-8 sm:px-12 py-3 sm:py-4 text-base sm:text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Solicitar Orçamento
          </Button>
        </div>
      </section>
    </main>
  );
}
