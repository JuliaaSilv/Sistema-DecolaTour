import React from 'react';
import { useNavigate } from 'react-router-dom';

const ModernPackageCard = ({ 
  id,
  nome, 
  destino, 
  imagem, 
  preco, 
  precoOriginal,
  duracao,
  categoria = "PACOTE",
  rating = 8.5,
  origem = "Saindo de São Paulo",
  inclusions = "Hotel + Aéreo",
  economia,
  ofertaEspecial = false,
  className = ""
}) => {
  const navigate = useNavigate();

  console.log('🎴 ModernPackageCard renderizado:', { nome, preco, imagem });

  const handleCardClick = () => {
    // Navegar usando o ID ou nome do pacote
    const identifier = id || encodeURIComponent(nome);
    console.log('🔗 Navegando para:', `/package-details/${identifier}`);
    navigate(`/package-details/${identifier}`);
  };

  // Formatar preço para exibição
  const formatPrice = (price) => {
    if (typeof price === 'string') {
      const numericPrice = price.replace(/[^\d,]/g, '').replace(',', '.');
      return parseFloat(numericPrice).toLocaleString('pt-BR');
    }
    return parseFloat(price || 0).toLocaleString('pt-BR');
  };

  // Gerar cor do rating baseada no valor
  const getRatingColor = (rating) => {
    if (rating >= 8.5) return 'bg-emerald-500';
    if (rating >= 7.5) return 'bg-blue-500';
    if (rating >= 6.5) return 'bg-yellow-500';
    return 'bg-orange-500';
  };

  // Gerar estrelas baseadas no rating
  const getStars = (rating) => {
    const fullStars = Math.floor(rating / 2);
    const stars = [];
    
    for (let i = 0; i < fullStars; i++) {
      stars.push('⭐');
    }
    
    return stars.join('');
  };

  return (
    <div 
      className={`group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:-translate-y-2 overflow-hidden max-w-sm w-full ${className}`}
      onClick={handleCardClick}
    >
      {/* Imagem do destino */}
      <div className="relative h-48 overflow-hidden bg-gray-100">
        <img
          src={imagem}
          alt={nome}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          onError={(e) => {
            console.log('❌ Erro ao carregar imagem:', imagem);
            e.target.src = 'https://via.placeholder.com/400x300/e5e5e5/999999?text=Imagem+Indisponível';
          }}
          onLoad={() => {
            console.log('✅ Imagem carregada:', imagem);
          }}
        />
        
        {/* Badge de duração */}
        <div className="absolute top-4 left-4 bg-black bg-opacity-70 text-white px-3 py-1 rounded-lg text-sm font-medium">
          {duracao || "10 DIAS / 9 NOITES"}
        </div>

        {/* Badge de oferta especial */}
        {ofertaEspecial && (
          <div className="absolute top-4 right-4 bg-purple-600 text-white px-3 py-1 rounded-lg text-xs font-bold">
            Oferta Imbatível
          </div>
        )}

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
      </div>

      {/* Conteúdo do card */}
      <div className="p-6">
        {/* Categoria */}
        <div className="text-gray-500 text-xs font-semibold uppercase tracking-wide mb-2">
          {categoria}
        </div>

        {/* Título do pacote */}
        <h3 className="text-gray-800 text-xl font-bold mb-2 h-14 overflow-hidden group-hover:text-blue-600 transition-colors" style={{
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden'
        }}>
          {nome}
        </h3>

        {/* Rating e estrelas */}
        <div className="flex items-center mb-3">
          <div className={`${getRatingColor(rating)} text-white px-2 py-1 rounded-lg text-sm font-bold mr-2`}>
            {rating.toFixed(1)}
          </div>
          <div className="text-yellow-400 text-sm mr-2">
            {getStars(rating)}
          </div>
        </div>

        {/* Origem */}
        <div className="text-gray-600 text-sm mb-2">
          {origem}
        </div>

        {/* Inclusões */}
        <div className="text-gray-600 text-sm mb-4">
          {inclusions}
        </div>

        {/* Economia (se aplicável) */}
        {economia && (
          <div className="bg-teal-50 text-teal-700 px-3 py-1 rounded-lg text-sm font-medium mb-4 inline-block">
            Economize {economia}
          </div>
        )}

        {/* Preços */}
        <div className="space-y-1">
          <div className="text-gray-500 text-sm">
            Preço por pessoa
          </div>
          
          {/* Preço original riscado (se houver) */}
          {precoOriginal && (
            <div className="text-gray-400 text-sm line-through">
              R$ {formatPrice(precoOriginal)}
            </div>
          )}
          
          {/* Preço atual */}
          <div className="flex items-baseline">
            <span className="text-gray-600 text-sm">R$</span>
            <span className="text-gray-800 text-2xl font-bold ml-1">
              {formatPrice(preco)}
            </span>
          </div>
          
          <div className="text-gray-500 text-xs">
            Taxas e impostos não inclusos
          </div>
        </div>
      </div>

      {/* Hover effect overlay */}
      <div className="absolute inset-0 bg-blue-600 bg-opacity-0 group-hover:bg-opacity-5 transition-all duration-300 rounded-2xl"></div>
    </div>
  );
};

export default ModernPackageCard;
