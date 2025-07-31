// Importações das imagens de pacotes
import foz from "../assets/packages_images/foz_do_iguacu.avif";
import rio from "../assets/packages_images/rio_de_janeiro.jpg";
import florianopolis from "../assets/packages_images/florianopolis.jpg";
import maceio from "../assets/packages_images/maceio.jpeg";
import puntaCana from "../assets/packages_images/punta_cana.jpg";
import santiago from "../assets/packages_images/santiago.jpg";
import buenosAires from "../assets/packages_images/buenos_aires.jpg";
import portoDeGalinhas from "../assets/packages_images/porto_de_galinhas.jpg";

// Importações das imagens da Home page
import paris from "../assets/home_images/paris.png";
import roma from "../assets/home_images/roma.png";
import lasVegas from "../assets/home_images/lasVegas.png";
import milao from "../assets/home_images/milao.jpg";
import veneza from "../assets/home_images/veneza.jpg";
import toquio from "../assets/home_images/toquio.jpg";
import dortmund from "../assets/home_images/dortmund.jpg";
import inglaterra from "../assets/home_images/inglaterra.jpg";
import monaco from "../assets/home_images/monaco.png";

// Dados dos destinos da Home page
export const homeDestinations = [
  {
    nome: "Paris",
    destino: "Paris, França", 
    imagem: paris,
    preco: "R$ 3.500",
    descricao: "Descubra a cidade luz com seus monumentos icônicos e cultura única.",
    detalhes: [
      { label: "Hospedagem", valor: "4 noites em hotel 4 estrelas no centro" },
      { label: "Aéreo", valor: "Ida e volta inclusos" },
      { label: "Passeios", valor: "Torre Eiffel, Louvre, Champs-Élysées" },
      { label: "Café da manhã", valor: "Incluído" },
    ],
    politicas: "Cancelamento grátis até 7 dias antes do embarque.",
    categoria: "internacional",
  },
  {
    nome: "Roma",
    destino: "Roma, Itália",
    imagem: roma,
    preco: "R$ 4.500", 
    descricao: "Explore a cidade eterna com sua história milenar e gastronomia.",
    detalhes: [
      { label: "Hospedagem", valor: "5 noites em hotel boutique 4 estrelas" },
      { label: "Aéreo", valor: "Ida e volta inclusos" },
      { label: "Passeios", valor: "Coliseu, Vaticano, Fontana di Trevi" },
      { label: "Café da manhã", valor: "Incluído" },
    ],
    politicas: "Cancelamento grátis até 7 dias antes do embarque.",
    categoria: "internacional",
  },
  {
    nome: "Las Vegas",
    destino: "Las Vegas, Estados Unidos",
    imagem: lasVegas,
    preco: "R$ 2.500",
    descricao: "Viva a experiência única da cidade que nunca dorme.",
    detalhes: [
      { label: "Hospedagem", valor: "4 noites em resort 5 estrelas na Strip" },
      { label: "Aéreo", valor: "Ida e volta inclusos" },
      { label: "Passeios", valor: "Shows, cassinos, Grand Canyon opcional" },
      { label: "Café da manhã", valor: "Incluído" },
    ],
    politicas: "Cancelamento grátis até 7 dias antes do embarque.",
    categoria: "internacional",
  },
  {
    nome: "Milão",
    destino: "Milão, Itália", 
    imagem: milao,
    preco: "R$ 4.500",
    descricao: "Capital da moda italiana com arquitetura deslumbrante.",
    detalhes: [
      { label: "Hospedagem", valor: "4 noites em hotel design 4 estrelas" },
      { label: "Aéreo", valor: "Ida e volta inclusos" },
      { label: "Passeios", valor: "Duomo, La Scala, Quadrilátero da Moda" },
      { label: "Café da manhã", valor: "Incluído" },
    ],
    politicas: "Cancelamento grátis até 7 dias antes do embarque.",
    categoria: "internacional",
  },
  {
    nome: "Veneza",
    destino: "Veneza, Itália",
    imagem: veneza,
    preco: "R$ 5.500",
    descricao: "Navegue pelos canais da cidade mais romântica do mundo.",
    detalhes: [
      { label: "Hospedagem", valor: "3 noites em palazzo histórico 4 estrelas" },
      { label: "Aéreo", valor: "Ida e volta inclusos" },
      { label: "Passeios", valor: "Praça São Marcos, Gôndola, Murano" },
      { label: "Café da manhã", valor: "Incluído" },
    ],
    politicas: "Cancelamento grátis até 7 dias antes do embarque.",
    categoria: "internacional",
  },
  {
    nome: "Tóquio",
    destino: "Tóquio, Japão",
    imagem: toquio,
    preco: "R$ 4.500",
    descricao: "Mergulhe na cultura japonesa entre tradição e modernidade.",
    detalhes: [
      { label: "Hospedagem", valor: "5 noites em hotel moderno 4 estrelas" },
      { label: "Aéreo", valor: "Ida e volta inclusos" },
      { label: "Passeios", valor: "Templos, Shibuya, Monte Fuji" },
      { label: "Café da manhã", valor: "Incluído" },
    ],
    politicas: "Cancelamento grátis até 7 dias antes do embarque.",
    categoria: "internacional",
  },
  {
    nome: "Dortmund", 
    destino: "Dortmund, Alemanha",
    imagem: dortmund,
    preco: "R$ 3.500",
    descricao: "Conheça a cidade alemã rica em história e futebol.",
    detalhes: [
      { label: "Hospedagem", valor: "4 noites em hotel moderno 4 estrelas" },
      { label: "Aéreo", valor: "Ida e volta inclusos" },
      { label: "Passeios", valor: "Signal Iduna Park, centro histórico" },
      { label: "Café da manhã", valor: "Incluído" },
    ],
    politicas: "Cancelamento grátis até 7 dias antes do embarque.",
    categoria: "internacional",
  },
  {
    nome: "Londres",
    destino: "Londres, Reino Unido",
    imagem: inglaterra,
    preco: "R$ 2.500", 
    descricao: "Explore a capital britânica com sua rica história e cultura.",
    detalhes: [
      { label: "Hospedagem", valor: "4 noites em hotel tradicional 4 estrelas" },
      { label: "Aéreo", valor: "Ida e volta inclusos" },
      { label: "Passeios", valor: "Big Ben, Buckingham Palace, London Eye" },
      { label: "Café da manhã", valor: "Incluído" },
    ],
    politicas: "Cancelamento grátis até 7 dias antes do embarque.",
    categoria: "internacional",
  },
  {
    nome: "Monaco",
    destino: "Mônaco, França",
    imagem: monaco,
    preco: "R$ 6.500",
    descricao: "Luxo e glamour no principado mais exclusivo da Europa.",
    detalhes: [
      { label: "Hospedagem", valor: "3 noites em hotel de luxo 5 estrelas" },
      { label: "Aéreo", valor: "Ida e volta inclusos" },
      { label: "Passeios", valor: "Cassino Monte Carlo, Porto, Palácio Real" },
      { label: "Café da manhã", valor: "Incluído" },
    ],
    politicas: "Cancelamento grátis até 7 dias antes do embarque.",
    categoria: "internacional",
  },
];

// Dados centralizados de todos os pacotes
export const allPackages = [
  {
    id: "1",
    nome: "Foz do Iguaçu",
    destino: "Foz do Iguaçu, Brasil",
    imagem: foz,
    preco: "R$ 2.110",
    descricao: "Pacote completo para Foz do Iguaçu com hotel, aéreo e passeios.",
    detalhes: [
      { label: "Hospedagem", valor: "3 noites em hotel 4 estrelas" },
      { label: "Aéreo", valor: "Ida e volta inclusos" },
      { label: "Passeios", valor: "Cataratas, Itaipu, Parque das Aves" },
      { label: "Café da manhã", valor: "Incluído" },
    ],
    politicas: "Cancelamento grátis até 7 dias antes do embarque.",
    categoria: "completo",
  },
  {
    id: "2",
    nome: "Rio de Janeiro",
    destino: "Rio de Janeiro, Brasil",
    imagem: rio,
    preco: "R$ 1.355",
    descricao: "Aproveite o melhor do Rio com hospedagem e city tour.",
    detalhes: [
      { label: "Hospedagem", valor: "3 noites em hotel 4 estrelas" },
      { label: "Aéreo", valor: "Ida e volta inclusos" },
      { label: "Passeios", valor: "Cristo Redentor, Pão de Açúcar" },
      { label: "Café da manhã", valor: "Incluído" },
    ],
    politicas: "Cancelamento grátis até 7 dias antes do embarque.",
    categoria: "completo",
  },
  {
    id: "3",
    nome: "Florianópolis",
    destino: "Florianópolis, Brasil",
    imagem: florianopolis,
    preco: "R$ 807",
    descricao: "Desfrute das praias de Floripa com conforto e praticidade.",
    detalhes: [
      { label: "Hospedagem", valor: "4 noites em hotel 3 estrelas" },
      { label: "Aéreo", valor: "Ida e volta inclusos" },
      { label: "Passeios", valor: "Praias e Lagoa da Conceição" },
      { label: "Café da manhã", valor: "Incluído" },
    ],
    politicas: "Cancelamento grátis até 7 dias antes do embarque.",
    categoria: "completo",
  },
  {
    id: "4",
    nome: "Maragogi + Porto de Galinhas",
    destino: "Maragogi e Porto de Galinhas, Brasil",
    imagem: portoDeGalinhas,
    preco: "R$ 2.554",
    descricao: "Dois paraísos em uma só viagem, com traslados e passeios.",
    detalhes: [
      { label: "Hospedagem", valor: "6 noites em resorts 4 estrelas" },
      { label: "Aéreo", valor: "Ida e volta inclusos" },
      { label: "Traslado", valor: "Entre cidades incluso" },
      { label: "Passeios", valor: "Piscinas naturais e praias" },
      { label: "Café da manhã", valor: "Incluído" },
    ],
    politicas: "Cancelamento grátis até 7 dias antes do embarque.",
    categoria: "2em1",
  },
  {
    id: "5",
    nome: "Maceió + Maragogi",
    destino: "Maceió e Maragogi, Brasil",
    imagem: maceio,
    preco: "R$ 3.333",
    descricao: "Conheça o melhor do litoral alagoano em uma viagem inesquecível.",
    detalhes: [
      { label: "Hospedagem", valor: "7 noites em hotel à beira-mar 4 estrelas" },
      { label: "Aéreo", valor: "Ida e volta inclusos" },
      { label: "Passeios", valor: "Piscinas naturais e praias" },
      { label: "Café da manhã", valor: "Incluído" },
    ],
    politicas: "Cancelamento grátis até 7 dias antes do embarque.",
    categoria: "2em1",
  },
  {
    id: "lencos",
    nome: "Lençóis Maranhenses",
    destino: "Lençóis Maranhenses, Brasil",
    imagem: "/packages/lencois.jpg", // Placeholder - você pode substituir por uma imagem real
    preco: "R$ 2.800",
    descricao: "Paisagens únicas no deserto brasileiro com lagoas cristalinas.",
    detalhes: [
      { label: "Hospedagem", valor: "4 noites em pousada regional" },
      { label: "Aéreo", valor: "Ida e volta inclusos" },
      { label: "Passeios", valor: "Lagoa Azul, Lagoa Bonita, Passeio de quadriciclo" },
      { label: "Café da manhã", valor: "Incluído" },
    ],
    politicas: "Cancelamento grátis até 7 dias antes do embarque.",
    categoria: "2em1",
  },
  {
    id: "6",
    nome: "Punta Cana",
    destino: "Punta Cana, República Dominicana",
    imagem: puntaCana,
    preco: "R$ 5.542",
    descricao: "Resorts all inclusive nas praias paradisíacas do Caribe.",
    detalhes: [
      { label: "Hospedagem", valor: "6 noites em resort all inclusive 5 estrelas" },
      { label: "Aéreo", valor: "Ida e volta inclusos" },
      { label: "Traslado", valor: "Aeroporto ↔ Resort" },
      { label: "Café da manhã", valor: "Incluído" },
      { label: "Bebidas", valor: "All inclusive" },
    ],
    politicas: "Cancelamento grátis até 7 dias antes do embarque.",
    categoria: "internacional",
  },
  {
    id: "7",
    nome: "Santiago",
    destino: "Santiago, Chile",
    imagem: santiago,
    preco: "R$ 3.960",
    descricao: "Explore a capital chilena com city tour e vinícolas.",
    detalhes: [
      { label: "Hospedagem", valor: "4 noites em hotel central 4 estrelas" },
      { label: "Aéreo", valor: "Ida e volta inclusos" },
      { label: "Passeios", valor: "City tour e vinícola" },
      { label: "Café da manhã", valor: "Incluído" },
    ],
    politicas: "Cancelamento grátis até 7 dias antes do embarque.",
    categoria: "internacional",
  },
  {
    id: "8",
    nome: "Buenos Aires",
    destino: "Buenos Aires, Argentina",
    imagem: buenosAires,
    preco: "R$ 3.103",
    descricao: "Descubra a cultura argentina com tango e gastronomia.",
    detalhes: [
      { label: "Hospedagem", valor: "5 noites em hotel boutique 4 estrelas" },
      { label: "Aéreo", valor: "Ida e volta inclusos" },
      { label: "Passeios", valor: "Show de tango incluso" },
      { label: "Café da manhã", valor: "Incluído" },
    ],
    politicas: "Cancelamento grátis até 7 dias antes do embarque.",
    categoria: "internacional",
  },
];

// Apenas dados estruturais mantidos - arrays de pacotes removidos para usar dados dinâmicos

// Dados adicionais para detalhes dos pacotes
export const packageDetails = {
  imagensGaleria: [
    "https://media.staticontent.com/media/pictures/6fa5bc8d-4480-4751-9ad5-20635d6d5053/853x380?op=TRUNCATE&enlarge=false&gravity=ce_0_0&quality=80",
    "https://media.staticontent.com/media/pictures/319e43ac-bbe0-4eb6-bec9-c00b04e42d74/422x250?op=TRUNCATE&enlarge=false&gravity=ce_0_0&quality=80",
    "https://media.staticontent.com/media/pictures/166ead6b-eb6e-43f7-a91c-0e6c05142f34/208x125?op=TRUNCATE&enlarge=false&gravity=ce_0_0&quality=80"
  ],
  hotelInfo: {
    estrelas: 4,
    localizacao: "A 765 m do centro",
  }
};

// Serviços do hotel organizados em array para facilitar renderização
export const hotelServices = [
  { icon: "air-conditioning", text: "Ar-condicionado\nnas áreas comuns" },
  { icon: "pool-indoor", text: "Piscina coberta - o ano todo" },
  { icon: "pool", text: "Piscina" },
  { icon: "wifi", text: "Wi-Fi grátis nas áreas comuns" },
  { icon: "gym", text: "Academia" },
  { icon: "tv", text: "TV nas áreas comuns" },
  { icon: "bar", text: "Bar" }
];

// Função helper para buscar pacote por ID
export const getPackageById = (id) => {
  return allPackages.find(pacote => pacote.id === String(id));
};

// Função helper para buscar pacote por nome (para Home page)
export const getPackageByName = (nome) => {
  // Primeiro busca nos destinos da Home page
  const homePackage = homeDestinations.find(pacote => 
    pacote.nome.toLowerCase() === nome.toLowerCase()
  );
  
  if (homePackage) {
    return homePackage;
  }
  
  // Se não encontrar, busca nos pacotes principais
  return allPackages.find(pacote => 
    pacote.nome.toLowerCase() === nome.toLowerCase()
  );
};

// Função unified para buscar por ID ou nome
export const getPackage = (identifier) => {
  // Tenta buscar por ID primeiro (se for numérico ou string de ID)
  const byId = getPackageById(identifier);
  if (byId) return byId;
  
  // Se não encontrar por ID, busca por nome
  return getPackageByName(identifier);
};
