import React from "react";
import { useNavigate } from "react-router-dom";
import Button from "./Button";

// O componente principal agora recebe todas as props e repassa para CardContent
// O id do pacote deve ser passado para navegação correta
const SimplePackageCard = ({
  imagem,
  nome,
  preco,
  duracao,
  destino,
  categoria = "PACOTE",
  inclusions = "Hotel + Aéreo",
  id,
}) => {
  return (
    <CardContent
      imagem={imagem}
      nome={nome}
      preco={preco}
      duracao={duracao}
      destino={destino}
      categoria={categoria}
      inclusions={inclusions}
      id={id}
    />
  );
};

function CardContent({
  imagem,
  nome,
  preco,
  duracao,
  destino,
  categoria,
  inclusions,
  id,
}) {
  const navigate = useNavigate();
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
          alt={nome}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.style.display = "none";
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
          {nome}
        </h3>
        {/* Destino */}
        <div className="text-lg text-blue-700 font-semibold text-left w-full pl-3 mb-1">
          {destino}
        </div>
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
            R$ {parseFloat(preco).toLocaleString("pt-BR")}
          </div>
          {/* Botão Ver Mais navega para PackageDetails do pacote clicado */}
          <Button size="small" onClick={() => navigate(`/packages/${nome}`)}>
            Ver Mais
          </Button>
        </div>
      </div>
    </div>
  );
}

// Exporta o componente corrigido
export default SimplePackageCard;
