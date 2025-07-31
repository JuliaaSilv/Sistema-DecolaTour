import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import fundo from "../assets/fundoHome.jpg";
import Button from "../components/common/Button";
import { packageDetails, hotelServices } from "../data/packages";
import HotelServices from "../components/common/HotelServices";
// Componentes de package-details
import PackageHero from "../components/package-details/PackageHero";
import HotelInfoCard from "../components/package-details/HotelInfoCard";
import PricingCard from "../components/package-details/PricingCard";
import LocationMap from "../components/package-details/LocationMap";
import HotelGallery from "../components/package-details/HotelGallery";
import PackageOverview from "../components/package-details/PackageOverview";
import PackageHighlights from "../components/package-details/PackageHighlights";
import ReviewsSection from "../components/package-details/ReviewsSection";


export default function PackageDetails() {
  // Estados
  const [galeriaAberta, setGaleriaAberta] = useState(false);
  const [fotoIndex, setFotoIndex] = useState(0);
  const [pacote, setPacote] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const { id } = useParams();
  const navigate = useNavigate();
  // Decodifica o parâmetro caso seja um nome com caracteres especiais
  const identifier = decodeURIComponent(id);

  // Função para buscar pacote no backend
  const fetchFromBackend = async (identifier) => {
    try {
      console.log('PackageDetails - Buscando no backend para identifier:', identifier);
      
      // Primeira tentativa: buscar todos os pacotes
      let response = await fetch('http://localhost:5295/api/Pacote');
      if (response.ok) {
        const backendPackages = await response.json();
        console.log('PackageDetails - todos pacotes do backend:', backendPackages);
        
        // Busca por nome, título ou ID
        let foundPackage = backendPackages.find(pkg => 
          (pkg.titulo && pkg.titulo.toLowerCase() === identifier.toLowerCase()) ||
          (pkg.nome && pkg.nome.toLowerCase() === identifier.toLowerCase()) ||
          pkg.id.toString() === identifier
        );
        
        // Se não encontrou, tenta buscar por ID específico
        if (!foundPackage && !isNaN(identifier)) {
          console.log('PackageDetails - Tentando buscar por ID específico:', identifier);
          const idResponse = await fetch(`http://localhost:5295/api/Pacote/${identifier}`);
          if (idResponse.ok) {
            foundPackage = await idResponse.json();
            console.log('PackageDetails - Pacote encontrado por ID:', foundPackage);
          }
        }
        
        return foundPackage;
      }
    } catch (error) {
      console.error('Erro ao buscar pacotes do backend:', error);
      return null;
    }
    return null;
  };

 

  useEffect(() => {
    async function loadPackage() {
      setIsLoading(true);
      console.log('PackageDetails - identifier:', identifier);
      
      // Buscar apenas no backend
      let backendPackage = await fetchFromBackend(identifier);
      console.log('PackageDetails - pacote do backend encontrado:', backendPackage);
      
      if (backendPackage) {
        // Se encontrou no backend, faz merge com dados padrão
        setPacote(backendPackage);
      } else {
        // Se não encontrou, gera dados padrão indicando que não foi encontrado
        console.log('PackageDetails - Pacote não encontrado');
        setPacote(null);
      }
      
      setIsLoading(false);
    }
    
    loadPackage();
  }, [identifier]);

  // // Extraindo dados centralizados com fallbacks inteligentes
  // const { imagensGaleria: defaultImages, hotelInfo, descricoes } = packageDetails;
  
  // Sistema híbrido para imagens
 const imagensGaleria = pacote?.imagens?.map(img => `http://localhost:5295${img.url}`) ?? null;

  

  const handleReserva = () => {
    // Redireciona para a página BookingForm usando o id do pacote
    navigate(`/booking-form/${pacote.id}`);
  };

  // Validação de pacote
  if (isLoading) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center bg-[#E6E6EB]">
        <h2 className="text-2xl text-blue-900 font-bold mb-4">Carregando...</h2>
      </main>
    );
  }
  
  if (!pacote) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center bg-[#E6E6EB]">
        <h2 className="text-2xl text-blue-900 font-bold mb-4">Pacote não encontrado</h2>
        <p className="text-blue-700 mb-4">O pacote "{identifier}" não foi encontrado.</p>
        <Button onClick={() => navigate("/packages")}>Voltar para pacotes</Button>
      </main>
    );
  }

  return (
    <main className="min-h-screen min-w-screen bg-white">
      {/* Hero banner componentizado */}
      <PackageHero 
        backgroundImage={fundo}
        title={pacote.titulo}
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
            <HotelInfoCard pacote={pacote} />
            
            {/* Card de preços componentizado */}
            <PricingCard 
              pacote={pacote} 
              onReserve={handleReserva}
            />
          </div>
        </div>
      </section>

      {/* Overview do pacote */}
      <PackageOverview 
        pacote={pacote} 
      />

      {/* Destaques do pacote */}
      <PackageHighlights 
        pacote={pacote}
      />

      {/* Mapa componentizado */}
      <LocationMap location={pacote.destino} />

      {/* Seção de avaliações com espaçamento maior */}
      <div className="mt-16">
        <ReviewsSection />
      </div>
    </main>
  );
}
