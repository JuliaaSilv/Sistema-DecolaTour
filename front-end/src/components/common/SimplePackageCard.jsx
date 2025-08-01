import React from "react";
import { useNavigate } from "react-router-dom";
import { Star } from "lucide-react";
import Button from "./Button";

// O componente principal agora recebe todas as props e repassa para CardContent
// O id do pacote deve ser passado para navegação correta
const SimplePackageCard = ({
  imagem,
  titulo,  // Renomeado de nome para titulo para ser mais semântico
  preco,
  duracao,
  destino,
  categoria = "PACOTE",
  inclusions = "Hotel + Aéreo",
  estrelas = 0,
  id,
}) => {
  return (
    <CardContent
      imagem={imagem}
      titulo={titulo}
      preco={preco}
      duracao={duracao}
      destino={destino}
      categoria={categoria}
      inclusions={inclusions}
      estrelas={estrelas}
      id={id}
    />
  );
};

function CardContent({
  imagem,
  titulo,  // Renomeado de nome para titulo
  preco,
  duracao,
  destino,
  categoria,
  inclusions,
  estrelas,
  id,
}) {
  const navigate = useNavigate();
  
  // Debug da imagem recebida
  console.log(`🎯 SimplePackageCard - ${titulo} (título do pacote):`, {
    imagem,
    isDefault: imagem === "/packages/default.jpg",
    isBackendUrl: imagem?.includes("localhost:5295")
  });
  
  // O retorno do componente é um único elemento pai <div>
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col items-center min-h-[340px] pb-4 relative transition-all duration-300 ease-in-out w-[340px] hover:shadow-2xl hover:scale-[1.04]">
      {/* Badge de duração no topo esquerdo */}
      {duracao && (
        <span className="absolute top-3 left-3 bg-black text-white text-xs font-semibold px-3 py-1 rounded-full shadow">
          {duracao}
        </span>
      )}
      {/* Imagem do pacote */}
      <div className="w-full h-56 mb-4 rounded-lg overflow-hidden bg-[#eee]">
        <img
          src={imagem}
          alt={titulo}
          className="w-full h-full object-cover"
          onError={(e) => {
            console.error(`❌ Erro ao carregar imagem: ${imagem}`);
            e.target.src = "/api/placeholder/300/200";
          }}
          onLoad={() => {
            console.log(`✅ Imagem carregada com sucesso: ${imagem}`);
          }}
        />
      </div>
      {/* Categoria próxima da imagem */}
      <div className="text-sm font-bold text-gray-600 text-left w-full pl-3 uppercase tracking-wide mb-2">
        {categoria}
      </div>
      <div className="flex flex-col gap-3 w-full">
        {/* Título do pacote */}
        <h3 className="text-2xl font-bold text-gray-900 text-left w-full pl-3 mb-1">
          {titulo}
        </h3>
        {/* Destino */}
        <div className="text-lg text-blue-700 font-semibold text-left w-full pl-3 mb-1">
          {destino}
        </div>
        {/* Avaliação com estrelas */}
        {estrelas > 0 && (
          <div className="flex items-center gap-1 w-full pl-3 mb-2">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={16}
                className={`${
                  i < estrelas ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                }`}
              />
            ))}
            <span className="text-sm text-gray-600 ml-1">({estrelas}/5)</span>
          </div>
        )}
        {/* Inclusões */}
        <div className="text-base text-gray-700 font-semibold text-left w-full pl-3 mb-2">
          {inclusions}
        </div>
        {/* Preço por pessoa agora acima do preço e botão */}
        <div className="text-sm text-gray-500 text-left w-full pl-3 mb-0.5">
          Preço por pessoa
        </div>
        {/* Preço do pacote e botão - logo abaixo do Preço por pessoa, com menos espaçamento */}
        <div className="flex items-center justify-between w-full pl-3 pr-3 mb-1">
          <div className="text-blue-700 text-2xl font-bold">
            {parseFloat(preco).toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL"
            })}
          </div>
          {/* Botão Ver Mais navega para PackageDetails do pacote clicado */}
          <Button size="small" onClick={() => navigate(`/packages/${id || titulo}`)}>
            Ver Mais
          </Button>
        </div>
      </div>
    </div>
  );
}

// Exporta o componente corrigido
export default SimplePackageCard;
