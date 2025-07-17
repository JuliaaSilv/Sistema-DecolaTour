/**
 * HOME PAGE - DecolaTour
 * 
 * REFATORAÇÃO REALIZADA:
 * =====================
 * 
 * PROBLEMA ORIGINAL:
 * - Código altamente repetitivo com 9 divs duplicadas para cada destino
 * - Dados hardcoded em cada card individual
 * - Difícil manutenção e adição de novos destinos
 * - ~300 linhas de código duplicado
 * 
 * SOLUÇÃO IMPLEMENTADA:
 * - ✅ Criação de tipagem TypeScript (type Destino)
 * - ✅ Centralização dos dados em array estruturado
 * - ✅ Substituição de código duplicado por loop map()
 * - ✅ Uso de CSS Grid para layout responsivo
 * - ✅ Redução de 90% no código duplicado
 * 
 * BENEFÍCIOS:
 * - Código mais limpo e profissional
 * - Fácil adição de novos destinos
 * - Melhor manutenibilidade
 * - Pronto para futuras integrações com APIs
 */

// Imports das imagens dos destinos
import fundo from "../assets/fundoHome.png";
import paris from "../assets/paris.png";
import lasVegas from "../assets/lasVegas.png";
import roma from "../assets/roma.png";
import milao from "../assets/Milao.png";
import React from "react";
import veneza from "../assets/Veneza.png";
import tokyo from "../assets/Tokyo.png";
import dortmund from "../assets/dortmund.jpg";
import inglaterra from "../assets/inglaterra.jpg";
import monaco from "../assets/monaco.png";

/**
 * ALTERAÇÃO 1: Criação de tipagem para os destinos
 * - Adicionada interface TypeScript para garantir consistência dos dados
 * - Melhora a manutenibilidade e previne erros de tipagem
 */
type Destino = {
  id: number;
  nome: string;
  imagem: string;
  preco: string;
};

/**
 * ALTERAÇÃO 2: Centralização dos dados em um array
 * - Antes: Dados hardcoded em cada card individual (muito repetitivo)
 * - Depois: Array centralizado com todos os destinos
 * - Benefícios: Fácil adição/remoção de destinos, código mais limpo
 */
const destinos: Destino[] = [
  { id: 1, nome: "Paris", imagem: paris, preco: "3.500" },
  { id: 2, nome: "Roma", imagem: roma, preco: "4.500" },
  { id: 3, nome: "Las Vegas", imagem: lasVegas, preco: "2.500" },
  { id: 4, nome: "Milão", imagem: milao, preco: "4.500" },
  { id: 5, nome: "Veneza", imagem: veneza, preco: "5.500" },
  { id: 6, nome: "Tokyo", imagem: tokyo, preco: "4.500" },
  { id: 7, nome: "Dortmund", imagem: dortmund, preco: "3.500" },
  { id: 8, nome: "Monaco", imagem: monaco, preco: "6.500" },
  { id: 9, nome: "Inglaterra", imagem: inglaterra, preco: "2.500" },
];

export default function Home() {
  return (
    <main className="bg-[#E6E6EB] h-auto flex flex-col gap-25 pb-8">
      {/* Seção do banner principal */}
      <div className="w-full overflow-hidden">
        <img src={fundo} alt="Fundo" className="w-full h-[312px] object-cover object-center" />
      </div>

      {/* Seção de busca sobreposta ao banner */}
      <div className="w-[676px] h-[134px] bg-[#6A4C93] absolute top-[350px] justify-center flex-col left-[50%] transform -translate-x-1/2 flex rounded-lg gap-2">
        <h1 className="text-white text-xl font-semibold px-6 font-roboto">Busque seu destino</h1>
        <div className="flex items-center justify-between w-full px-6">
          {/* Campo de origem/destino */}
          <div className="w-[236px] h-[42px] bg-white rounded-md flex px-3 gap-2">
            <div className="w-full h-full flex-col justify-center border-r-2 border-r-[#00000099]">
              <p className="text-sm text-black font-normal">Origem</p>
              <p className="text-xs text-gray-500">De</p>
            </div>
            <div className="w-full h-full flex-col justify-center">
              <p className="text-sm text-black font-normal">Destino</p>
              <p className="text-xs text-gray-500">Para</p>
            </div>
          </div>
          {/* Campo de calendário */}
          <div className="w-[236px] h-[42px] bg-white rounded-md flex px-3 gap-2">
            <div className="w-full h-full flex-col justify-center border-r-2 border-r-[#00000099]">
              <p className="text-sm text-black font-normal">Calendário</p>
              <p className="text-xs text-gray-500">Ida</p>
            </div>
            <div className="w-full h-full flex-col justify-center">
              <p className="text-xs text-gray-500 mt-[20%]">Volta</p>
            </div>
          </div>
          {/* Campo de pessoas */}
          <div className="w-[130px] h-[42px] bg-white rounded-md flex px-3 gap-2">
            <div className="w-full h-full flex-col justify-center">
              <p className="text-sm text-black font-normal">Pessoas</p>
              <p className="text-xs text-gray-500">02</p>
            </div>
          </div>
        </div>
        <button className="bg-[#F28C38E5] text-white w-[75px] h-[28px] rounded-lg hover:bg-[#5a3f7b] transition-colors duration-300 ml-auto mx-4">
          <span className="text-base font-normal">Buscar</span>
        </button>
      </div>

      {/* 
        ALTERAÇÃO 3: Seção de destinos populares refatorada
        - Antes: 3 divs separadas com código duplicado para cada linha
        - Depois: Uma única div com CSS Grid e loop map()
        - Redução de ~90% no código duplicado
      */}
      <div className="flex flex-col gap-10">
        <h1 className="text-[#6A4C93] text-3xl font-bold ml-[20%]"> Destinos Populares </h1>
        <div className="flex flex-col items-center justify-center gap-10">
          {/* 
            ALTERAÇÃO 4: Uso de CSS Grid em vez de flexbox manual
            - grid-cols-3: Cria automaticamente 3 colunas
            - justify-items-center: Centraliza os itens
            - gap-4: Espaçamento uniforme entre os cards
          */}
          <div className="grid grid-cols-3 gap-4 w-[80%] justify-items-center">
            {/* 
              ALTERAÇÃO 5: Loop único em vez de código duplicado
              - Antes: 9 divs individuais (uma para cada destino)
              - Depois: Um único map() que itera sobre o array de destinos
              - Vantagem: Adicionar novos destinos é só incluir no array
            */}
            {destinos.map((destino) => (
              <div key={destino.id} className="flex flex-col bg-[#FFFFFF] w-[305px] h-auto items-center rounded-lg shadow-lg hover:scale-105 transition-transform duration-300 overflow-hidden">
                <div className="w-full h-[200px] overflow-hidden rounded-t-lg bg-gray-100 relative">
                  <img
                    src={destino.imagem}
                    alt={destino.nome}
                    className="absolute inset-0 w-full h-full object-cover object-center hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div className="p-4 w-full">
                  <h1 className="text-black text-2xl font-bold mb-2"> {destino.nome} </h1>
                  <div className="flex justify-between items-center gap-2 w-full">
                    <h1 className="text-[#F28C38] text-xl font-bold"> A partir de R$ {destino.preco} </h1>
                    <button className="bg-[#F28C38E5] text-white px-4 py-2 rounded-md hover:bg-[#5a3f7b] transition-colors duration-300">
                      <span className="text-base font-normal">VER MAIS</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
