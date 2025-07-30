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
import PackageInclusions from "../components/package-details/PackageInclusions";
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

  // Função para gerar dados padrão baseados no pacote
  const generateDefaultData = (packageData) => {
    const isLuxury = packageData.categoria?.toLowerCase().includes('luxo') || 
                     packageData.valorTotal > 5000;
    
    return {
      hotelServices: isLuxury ? [
        { icon: "🏊‍♀️", title: "Piscina", description: "Piscina aquecida" },
        { icon: "🍽️", title: "Restaurante", description: "Culinária gourmet" },
        { icon: "📶", title: "Wi-Fi", description: "Internet de alta velocidade" },
        { icon: "🚗", title: "Valet", description: "Serviço de estacionamento" },
        { icon: "💆‍♀️", title: "Spa", description: "Centro de bem-estar" },
        { icon: "🎯", title: "Concierge", description: "Atendimento personalizado" }
      ] : [
        { icon: "🏊‍♀️", title: "Piscina", description: "Área de lazer" },
        { icon: "🍽️", title: "Restaurante", description: "Opções gastronômicas" },
        { icon: "📶", title: "Wi-Fi", description: "Internet gratuita" },
        { icon: "🅿️", title: "Estacionamento", description: "Vagas disponíveis" }
      ],
      
      highlights: [
        `Localização privilegiada em ${packageData.destino}`,
        `${packageData.duracao || 'Múltiplas'} noites de hospedagem`,
        'Atendimento especializado',
        packageData.origem ? `Saída de ${packageData.origem}` : 'Flexibilidade de origem'
      ],
      
      overview: packageData.descricao || 
        `Descubra ${packageData.destino} em um pacote completo que combina conforto, 
         localização privilegiada e experiências inesquecíveis. Este destino oferece 
         uma mistura perfeita de cultura, gastronomia e paisagens deslumbrantes.`,
      
      inclusions: {
        included: [
          'Hospedagem conforme categoria escolhida',
          'Café da manhã',
          'Taxas de serviço',
          'Suporte 24h durante a viagem'
        ],
        notIncluded: [
          'Passagens aéreas',
          'Refeições não especificadas',
          'Passeios opcionais',
          'Seguro viagem',
          'Despesas pessoais'
        ]
      },
      
      policies: `Cancelamento: Até 48h antes da viagem sem custos. 
                 Check-in: A partir das 14h. Check-out: Até 12h. 
                 Política de não reembolso para no-shows.`
    };
  };

  // Função para fazer merge dos dados backend com fallbacks
  const mergePackageData = (backendData, staticData = null) => {
    if (!backendData) return staticData;
    
    const defaults = generateDefaultData(backendData);
    
    return {
      // Dados principais sempre do backend
      id: backendData.id,
      nome: backendData.titulo || backendData.nome,
      destino: backendData.destino,
      preco: `R$ ${parseFloat(backendData.valorTotal || 0).toLocaleString('pt-BR')}`,
      categoria: backendData.categorias || 'completo',
      imagem: backendData.imagemUrl || 
             (backendData.imagens && backendData.imagens.length > 0 ? 
              `http://localhost:5295${backendData.imagens[0].url}` : '/packages/default.jpg'),
      descricao: backendData.descricao || "Pacote criado pelo sistema administrativo.",
      
      // Detalhes estruturados
      detalhes: [
        { label: "Hospedagem", valor: `${backendData.duracao || 0} noites` },
        { label: "Origem", valor: backendData.origem || "A definir" },
        { label: "Destino", valor: backendData.destino || "A definir" },
        { label: "Valor Total", valor: `R$ ${parseFloat(backendData.valorTotal || 0).toLocaleString('pt-BR')}` },
        { label: "Valor Unitário", valor: `R$ ${parseFloat(backendData.valorUnitario || 0).toLocaleString('pt-BR')}` },
        { label: "Quantidade máxima", valor: `${backendData.quantidadeMaximaPessoas || 0} pessoas` },
        { label: "Data disponível", valor: backendData.dataDisponivel ? new Date(backendData.dataDisponivel).toLocaleDateString('pt-BR') : "A definir" },
      ],
      
      // Galeria de imagens
      galeria: backendData.imagens ? backendData.imagens.map(img => `http://localhost:5295${img.url}`) : [],
      videos: backendData.videos ? backendData.videos.map(video => `http://localhost:5295${video.url}`) : [],
      
      // Dados híbridos (backend tem prioridade, fallback para defaults)
      hotelServices: backendData.hotelServices ? JSON.parse(backendData.hotelServices) : defaults.hotelServices,
      politicas: backendData.politicas || defaults.policies,
      highlights: backendData.highlights ? JSON.parse(backendData.highlights) : defaults.highlights,
      overview: backendData.overview || defaults.overview,
      inclusions: backendData.inclusions ? JSON.parse(backendData.inclusions) : defaults.inclusions,
      
      // Marcadores para componentes
      isFromBackend: true,
      hasCustomData: !!(backendData.hotelServices || backendData.politicas || backendData.highlights)
      
    };
  };

  useEffect(() => {
    async function loadPackage() {
      setIsLoading(true);
      console.log('PackageDetails - identifier:', identifier);
      
      // Buscar apenas no backend
      let backendPackage = await fetchFromBackend(identifier);
      console.log('PackageDetails - pacote do backend encontrado:', backendPackage);
      
      let finalPackage = null;
      
      if (backendPackage) {
        // Se encontrou no backend, faz merge com dados padrão
        finalPackage = mergePackageData(backendPackage);
        console.log('PackageDetails - pacote híbrido criado:', finalPackage);
      } else {
        // Se não encontrou, gera dados padrão indicando que não foi encontrado
        console.log('PackageDetails - Pacote não encontrado, gerando dados padrão');
        finalPackage = {
          id: identifier,
          nome: "Pacote não encontrado",
          destino: "Destino não disponível",
          preco: "R$ 0",
          categoria: "Indisponível",
          descricao: "Este pacote não está disponível no momento.",
          detalhes: [],
          galeria: [],
          isFromBackend: false,
          hasCustomData: false
        };
      }
      
      setPacote(finalPackage);
      setIsLoading(false);
    }
    
    loadPackage();
  }, [identifier]);

  // Extraindo dados centralizados com fallbacks inteligentes
  const { imagensGaleria: defaultImages, hotelInfo, descricoes } = packageDetails;
  
  // Sistema híbrido para imagens
  const imagensGaleria = pacote?.galeria && pacote.galeria.length > 0 ? pacote.galeria : defaultImages;
  
  // Sistema híbrido para serviços do hotel
  const hotelServicesData = pacote?.hotelServices || hotelServices;
  
  // Sistema híbrido para dados do hotel
  const hotelInfoData = pacote?.isFromBackend ? {
    ...hotelInfo,
    // Sobrescreve com dados reais do backend quando disponível
    name: pacote.nome,
    location: pacote.destino,
    rating: hotelInfo.rating, // mantém rating padrão
    reviews: hotelInfo.reviews // mantém reviews padrão
  } : hotelInfo;

  const handleReserva = () => {
    navigate(`/booking-form/${encodeURIComponent(pacote.nome)}`);
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
            <HotelInfoCard pacote={pacote} hotelInfo={hotelInfoData} />
            
            {/* Card de preços componentizado */}
            <PricingCard 
              pacote={pacote} 
              hotelInfo={hotelInfoData} 
              onReserve={handleReserva}
            />
          </div>
        </div>
      </section>


      {/* Serviços do hotel componentizados - agora com dados híbridos */}
      <HotelServices 
        services={hotelServicesData}
        isCustom={pacote?.hasCustomData}
        title={pacote?.isFromBackend ? `Serviços disponíveis em ${pacote.destino}` : "Serviços do Hotel"}
      />

      {/* Overview do pacote - dados híbridos */}
      <PackageOverview 
        pacote={pacote} 
        overview={pacote?.overview}
      />

      {/* Destaques do pacote - dados híbridos */}
      <PackageHighlights 
        pacote={pacote}
        highlights={pacote?.highlights}
      />

      {/* Mapa componentizado */}
      <LocationMap location={pacote.destino} />

      {/* Inclusões do pacote componentizadas - dados híbridos */}
      <PackageInclusions 
        pacote={pacote}
        inclusions={pacote?.inclusions}
        policies={pacote?.politicas}
      />

      {/* Seção de avaliações com espaçamento maior */}
      <div className="mt-16">
        <ReviewsSection />
      </div>
    </main>
  );
}
