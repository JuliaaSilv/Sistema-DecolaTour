import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import fundo from "../assets/fundoHome.jpg";
import Button from "../components/common/Button";
import { useState } from "react";
import { getPackageById, packageDetails, hotelServices } from "../data/packages";
import HotelServices from "../components/common/HotelServices";
// Componentes de package-details
import PackageHero from "../components/package-details/PackageHero";
import HotelInfoCard from "../components/package-details/HotelInfoCard";
import PricingCard from "../components/package-details/PricingCard";
import LocationMap from "../components/package-details/LocationMap";
import PackageInclusions from "../components/package-details/PackageInclusions";
import HotelGallery from "../components/package-details/HotelGallery";
import PackageOverview from "../components/package-details/PackageOverview";
import PackageHighlights from "../components/package-details/PackageHighlights";
import ReviewsSection from "../components/package-details/ReviewsSection";


export default function PackageDetails() {
  // Estados simplificados
  const [galeriaAberta, setGaleriaAberta] = useState(false);
  const [fotoIndex, setFotoIndex] = useState(0);
  
  const { id } = useParams();
  const navigate = useNavigate();
  const pacote = getPackageById(id);

  // Extraindo dados centralizados
  const { imagensGaleria, hotelInfo, descricoes } = packageDetails;

  const handleReserva = () => {
    navigate(`/booking-form/${id}`);
  };

  // Validação de pacote
  if (!pacote) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center bg-[#E6E6EB]">
        <h2 className="text-2xl text-blue-900 font-bold mb-4">Pacote não encontrado</h2>
        <Button onClick={() => navigate("/packages")}>Voltar para pacotes</Button>
      </main>
    );
  }

  return (
    <main className="min-h-screen min-w-screen bg-white">
      {/* Hero banner componentizado */}
      <PackageHero 
        backgroundImage={fundo}
        title={pacote.nome}
        subtitle={pacote.destino}
      />

      <section className="max-w-full md:max-w-6xl mx-auto px-2 sm:px-4 md:px-8 mb-10">
        <h2 className="text-blue-900 text-xl sm:text-2xl md:text-3xl font-bold mb-8 text-left sm:text-center">
          Conheça os detalhes da nossa hospedagem
        </h2>
        <div className="bg-white rounded-2xl p-0 overflow-hidden">
          {/* Galeria de fotos componentizada */}
          <HotelGallery 
            imagensGaleria={imagensGaleria}
            galeriaAberta={galeriaAberta}
            setGaleriaAberta={setGaleriaAberta}
            fotoIndex={fotoIndex}
            setFotoIndex={setFotoIndex}
          />
          
          <div className="flex flex-col md:flex-row justify-between p-4 mt-10 md:p-8 gap-8 bg-transparent">
            {/* Card de info do hotel componentizado */}
            <HotelInfoCard pacote={pacote} hotelInfo={hotelInfo} />
            
            {/* Card de preços componentizado */}
            <PricingCard 
              pacote={pacote} 
              hotelInfo={hotelInfo} 
              onReserve={handleReserva}
            />
          </div>
        </div>
      </section>


      {/* Serviços do hotel componentizados */}
      <HotelServices services={hotelServices} />

      {/* Overview do pacote */}
      <PackageOverview pacote={pacote} />

      {/* Destaques do pacote */}
      <PackageHighlights pacote={pacote} />

      {/* Mapa componentizado */}
      <LocationMap location={pacote.destino} />

      {/* Inclusões do pacote componentizadas */}
      <PackageInclusions pacote={pacote} />

      {/* Seção de avaliações */}
      <ReviewsSection />

      <section className="max-w-full md:max-w-6xl mx-auto mt-12 pb-12 text-center px-2 sm:px-4 md:px-8">
        <p className="text-blue-700 text-base sm:text-lg mb-6 font-medium">
          Tem dúvidas ou quer personalizar seu pacote? Fale com um de nossos especialistas!
        </p>
        <Button
          variant="secondary"
          size="large"
          className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 text-base font-semibold rounded-xl transition-all duration-300"
        >
          Falar com especialista
        </Button>
      </section>
    </main>
  );
}
