// Importações das imagens
import foz from "../assets/packages_images/foz_do_iguacu.avif";
import rio from "../assets/packages_images/rio_de_janeiro.jpg";
import florianopolis from "../assets/packages_images/florianopolis.jpg";
import maceio from "../assets/packages_images/maceio.jpeg";
import puntaCana from "../assets/packages_images/punta_cana.jpg";
import santiago from "../assets/packages_images/santiago.jpg";
import buenosAires from "../assets/packages_images/buenos_aires.jpg";
import portoDeGalinhas from "../assets/packages_images/porto_de_galinhas.jpg";

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

// Pacotes organizados por categoria
export const pacotesCompletos = allPackages.filter(pacote => pacote.categoria === "completo");
export const pacotes2em1 = allPackages.filter(pacote => pacote.categoria === "2em1");
export const pacotesInternacionais = allPackages.filter(pacote => pacote.categoria === "internacional");

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
    nota: 8.2,
    comentarios: 922,
    resumoIA: "A localização é excelente e a equipe é muito simpática. A limpeza e a organização dos quartos são excelentes. Embora o café da manhã pudesse ser melhorado e o restaurante tenha tempos de espera, a experiência geral é muito boa."
  },
  descricoes: {
    resumida: "Localizado no centro de Curitiba, o Mabu Curitiba Business tem dois restaurantes, Wi-Fi gratuito em todo o edifício e 11 salas de reuniões. Você precisa saber: • O estacionamento tem custo adicional. • Há unidades adaptadas para pessoas com mobilidade reduzida. Você poderá desfrutar do buffet de café da manhã no Brasserie Quatro Estações, que oferece frutas, bolos, pães e bebidas. Além disso, o Dumont Restaurant serve uma variedade de pratos internacionais à la carte e o Villa Lobos Piano Bar prepara uma seleção de coquetéis. Conheça os pontos de interesse mais próximos:",
    completa: "Localizado no centro de Curitiba, o Mabu Curitiba Business tem dois restaurantes, Wi-Fi gratuito em todo o edifício e 11 salas de reuniões. Você precisa saber: • O estacionamento tem custo adicional. • Há unidades adaptadas para pessoas com mobilidade reduzida. Você poderá desfrutar do buffet de café da manhã no Brasserie Quatro Estações, que oferece frutas, bolos, pães e bebidas. Além disso, o Dumont Restaurant serve uma variedade de pratos internacionais à la carte e o Villa Lobos Piano Bar prepara uma seleção de coquetéis. Conheça os pontos de interesse mais próximos: • O Centro Cultural Teatro Guaíra fica a 100 m. • Encontra-se a 150 m da Praça Santos Andrade. • A 2 km do Shopping Estação. • O Mabu Curitiba Business está localizado a 3 km do estádio Arena da Baixada. • A 4 km do Jardim Botânico. • O Museu Oscar Niemeyer situa-se a 10 minutos de carro. • Fica a 17 km do Aeroporto Internacional de Curitiba. As instalações empresariais que inclui o Mabu Business são 11 salas de reuniões e um auditório com capacidade para até 280 pessoas."
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
  return allPackages.find(pacote => pacote.id === id);
};
