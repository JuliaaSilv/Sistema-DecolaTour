// Apenas os dados estruturais necessários para fallback são mantidos

// Dados estruturais para PackageDetails (usados como fallback/template)
export const packageDetails = {
  imagensGaleria: [
    '/placeholder-hotel-1.jpg',
    '/placeholder-hotel-2.jpg',
    '/placeholder-hotel-3.jpg',
    '/placeholder-hotel-4.jpg',
    '/placeholder-hotel-5.jpg',
    '/placeholder-hotel-6.jpg'
  ],
  
  hotelInfo: {
    name: "Hotel Padrão",
    location: "Localização não especificada",
    rating: 4.0,
    reviews: 1250
  },
  
  descricoes: {
    overview: "Descrição não disponível no momento.",
    highlights: [
      "Localização privilegiada",
      "Atendimento especializado",
      "Estrutura completa",
      "Experiência única"
    ]
  },
  
  policies: `Cancelamento: Até 48h antes da viagem sem custos. 
             Check-in: A partir das 14h. Check-out: Até 12h. 
             Política de não reembolso para no-shows.`
};

// Serviços padrão do hotel (usados como fallback)
export const hotelServices = [
  { icon: "🏊‍♀️", title: "Piscina", description: "Área de lazer" },
  { icon: "🍽️", title: "Restaurante", description: "Opções gastronômicas" },
  { icon: "📶", title: "Wi-Fi", description: "Internet gratuita" },
  { icon: "🅿️", title: "Estacionamento", description: "Vagas disponíveis" },
  { icon: "🏋️‍♂️", title: "Academia", description: "Equipamentos modernos" },
  { icon: "🛎️", title: "Recepção 24h", description: "Atendimento contínuo" }
];

