// Componente de ícones usando React Icons (muito mais simples!)
import React from 'react';
import { 
  MdLocationOn, 
  MdAir, 
  MdPool, 
  MdWifi, 
  MdFitnessCenter, 
  MdTv, 
  MdLocalBar,
  MdAccessTime,
  MdExpandMore,
  MdChevronLeft,
  MdChevronRight,
  MdClose 
} from 'react-icons/md';

// Mapeamento de nomes simples para componentes de ícones do React Icons
// Permite usar nomes amigáveis como "wifi" em vez de "MdWifi"
const iconMap = {
  location: MdLocationOn,           // Ícone de localização/pin no mapa
  "air-conditioning": MdAir,        // Ícone de ar condicionado
  "pool-indoor": MdPool,            // Ícone de piscina coberta
  pool: MdPool,                     // Ícone de piscina
  wifi: MdWifi,                     // Ícone de WiFi
  gym: MdFitnessCenter,             // Ícone de academia/fitness
  tv: MdTv,                         // Ícone de televisão
  bar: MdLocalBar,                  // Ícone de bar/bebidas
  clock: MdAccessTime,              // Ícone de relógio/horário
  chevronDown: MdExpandMore,        // Seta para baixo (expandir)
  chevronLeft: MdChevronLeft,       // Seta para esquerda
  chevronRight: MdChevronRight,     // Seta para direita
  close: MdClose                    // Ícone de fechar (X)
};

/**
 * Componente Icon - Renderiza ícones dinamicamente usando React Icons
 * 
 * @param {string} name - Nome do ícone conforme definido no iconMap
 * @param {string} className - Classes CSS para estilização (padrão: "h-5 w-5")
 * @param {object} props - Outras propriedades passadas para o componente do ícone
 * 
 * Exemplo de uso:
 * <Icon name="wifi" className="h-8 w-8 text-blue-700" />
 * <Icon name="location" size={24} color="red" />
 */
const Icon = ({ name, className = "h-5 w-5", ...props }) => {
  // Busca o componente do ícone no mapeamento usando o nome fornecido
  const IconComponent = iconMap[name];
  
  // Validação: verifica se o ícone existe no mapeamento
  if (!IconComponent) {
    // Avisa o desenvolvedor sobre ícone inexistente (útil para debug)
    console.warn(`Ícone "${name}" não encontrado`);
    // Retorna null para não renderizar nada (evita erros)
    return null;
  }

  // Renderiza o componente do ícone encontrado, passando todas as props
  return <IconComponent className={className} {...props} />;
};

export default Icon;
