import React from "react";
import fundo from "../assets/fundoHome.jpg";
import Button from "../components/common/Button";
import DestinationCard from "../components/common/DestinationCard";
import { pacotesCompletos, pacotes2em1, pacotesInternacionais } from "../data/packages";

export default function Packages() {
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
          {pacotesCompletos.map((pacote) => (
            <DestinationCard key={pacote.id} id={pacote.id} nome={pacote.nome} imagem={pacote.imagem} preco={pacote.preco.replace('R$ ', '')} />
          ))}
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
          {pacotes2em1.map((pacote) => (
            <DestinationCard key={pacote.id} id={pacote.id} nome={pacote.nome} imagem={pacote.imagem} preco={pacote.preco.replace('R$ ', '')} />
          ))}
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
          {pacotesInternacionais.map((pacote) => (
            <DestinationCard key={pacote.id} id={pacote.id} nome={pacote.nome} imagem={pacote.imagem} preco={pacote.preco.replace('R$ ', '')} />
          ))}
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