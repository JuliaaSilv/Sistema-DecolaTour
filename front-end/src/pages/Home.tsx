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
export default function Home() {
  return (
    <main className="bg-[#E6E6EB] h-auto flex flex-col gap-25 pb-8">
      <div>
        <img src={fundo} alt="Fundo" className="w-full h-[312px] object-cover" />
      </div>

      <div className="w-[676px] h-[134px] bg-[#6A4C93] absolute top-[350px] justify-center flex-col left-[50%] transform -translate-x-1/2 flex rounded-lg gap-2">
        <h1 className="text-white text-xl font-semibold px-6 font-roboto">Busque seu destino</h1>
        <div className="flex items-center justify-between w-full px-6">
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
          <div className="w-[236px] h-[42px] bg-white rounded-md flex px-3 gap-2">
            <div className="w-full h-full flex-col justify-center border-r-2 border-r-[#00000099]">
              <p className="text-sm text-black font-normal">Calendário</p>
              <p className="text-xs text-gray-500">Ida</p>
            </div>
            <div className="w-full h-full flex-col justify-center">
              <p className="text-xs text-gray-500 mt-[20%]">Volta</p>
            </div>
          </div>
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

      <div className="flex flex-col gap-10">
        <h1 className="text-[#6A4C93] text-3xl font-bold ml-[20%]"> Destinos Populares </h1>
        <div className="flex flex-col items-center justify-center gap-10">
          <div className=" ml-[7%] flex justify-center w-[80%] gap-4">
            <div className="flex flex-col bg-[#FFFFFF] w-[305px] h-auto items-center rounded-lg shadow-lg hover:scale-105 transition-transform duration-300">
              <img
                src={paris}
                alt="Paris"
                className="text-center w-[300px] h-[200px] rounded-lg shadow-lg hover:scale-105 transition-transform duration-300"
              />
              <h1 className="text-black text-2xl font-bold mr-auto px-2"> Paris </h1>
              <div className="flex justify-around gap-2 w-full p-2 items-center">
                <h1 className="text-[#F28C38] text-xl font-bold mr-auto"> A partir de R$ 3.500 </h1>
                <button className="bg-[#F28C38E5] text-white w-auto  rounded-md hover:bg-[#5a3f7b] transition-colors duration-300 mb-2 p-2">
                  <span className="text-base text-center font-normal">VER MAIS</span>
                </button>
              </div>
            </div>
            <div className="flex flex-col bg-[#FFFFFF] w-[305px] h-auto items-center rounded-lg shadow-lg hover:scale-105 transition-transform duration-300">
              <img
                src={roma}
                alt="Roma"
                className="text-center w-[300px] h-[200px] rounded-lg shadow-lg hover:scale-105 transition-transform duration-300"
              />
              <h1 className="text-black text-2xl font-bold mr-auto px-2"> Roma </h1>
              <div className="flex justify-around gap-2 w-full p-2 items-center">
                <h1 className="text-[#F28C38] text-xl font-bold mr-auto"> A partir de R$ 4.500 </h1>
                <button className="bg-[#F28C38E5] text-white w-auto  rounded-md hover:bg-[#5a3f7b] transition-colors duration-300 mb-2 p-2">
                  <span className="text-base text-center font-normal">VER MAIS</span>
                </button>
              </div>
            </div>
            <div className="flex flex-col bg-[#FFFFFF] w-[305px] h-auto items-center rounded-lg shadow-lg hover:scale-105 transition-transform duration-300">
              <img
                src={lasVegas}
                alt="Paris"
                className="text-center w-[300px] h-[200px] rounded-lg shadow-lg hover:scale-105 transition-transform duration-300"
              />
              <h1 className="text-black text-2xl font-bold mr-auto px-2"> Las Vegas </h1>
              <div className="flex justify-around gap-2 w-full p-2 items-center">
                <h1 className="text-[#F28C38] text-xl font-bold mr-auto"> A partir de R$ 2.500 </h1>
                <button className="bg-[#F28C38E5] text-white w-auto  rounded-md hover:bg-[#5a3f7b] transition-colors duration-300 mb-2 p-2">
                  <span className="text-base text-center font-normal">VER MAIS</span>
                </button>
              </div>
            </div>
          </div>
          <div className=" ml-[7%] flex justify-center w-[80%] gap-4">
            <div className="flex flex-col bg-[#FFFFFF] w-[305px] h-auto items-center rounded-lg shadow-lg hover:scale-105 transition-transform duration-300">
              <img
                src={milao}
                alt="Milao"
                className="text-center w-[300px] h-[200px] rounded-lg shadow-lg hover:scale-105 transition-transform duration-300"
              />
              <h1 className="text-black text-2xl font-bold mr-auto px-2"> Milão </h1>
              <div className="flex justify-around gap-2 w-full p-2 items-center">
                <h1 className="text-[#F28C38] text-xl font-bold mr-auto"> A partir de R$ 4.500 </h1>
                <button className="bg-[#F28C38E5] text-white w-auto  rounded-md hover:bg-[#5a3f7b] transition-colors duration-300 mb-2 p-2">
                  <span className="text-base text-center font-normal">VER MAIS</span>
                </button>
              </div>
            </div>
            <div className="flex flex-col bg-[#FFFFFF] w-[305px] h-auto items-center rounded-lg shadow-lg hover:scale-105 transition-transform duration-300">
              <img
                src={veneza}
                alt="Paris"
                className="text-center w-[300px] h-[200px] rounded-lg shadow-lg hover:scale-105 transition-transform duration-300"
              />
              <h1 className="text-black text-2xl font-bold mr-auto px-2"> Veneza </h1>
              <div className="flex justify-around gap-2 w-full p-2 items-center">
                <h1 className="text-[#F28C38] text-xl font-bold mr-auto"> A partir de R$ 5.500 </h1>
                <button className="bg-[#F28C38E5] text-white w-auto  rounded-md hover:bg-[#5a3f7b] transition-colors duration-300 mb-2 p-2">
                  <span className="text-base text-center font-normal">VER MAIS</span>
                </button>
              </div>
            </div>
            <div className="flex flex-col bg-[#FFFFFF] w-[305px] h-auto items-center rounded-lg shadow-lg hover:scale-105 transition-transform duration-300">
              <img
                src={tokyo}
                alt="Paris"
                className="text-center w-[300px] h-[200px] rounded-lg shadow-lg hover:scale-105 transition-transform duration-300"
              />
              <h1 className="text-black text-2xl font-bold mr-auto px-2"> Tokyo </h1>
              <div className="flex justify-around gap-2 w-full p-2 items-center">
                <h1 className="text-[#F28C38] text-xl font-bold mr-auto"> A partir de R$ 4.500 </h1>
                <button className="bg-[#F28C38E5] text-white w-auto  rounded-md hover:bg-[#5a3f7b] transition-colors duration-300 mb-2 p-2">
                  <span className="text-base text-center font-normal">VER MAIS</span>
                </button>
              </div>
            </div>
          </div>
          <div className=" ml-[7%] flex justify-center w-[80%] gap-4">
            <div className="flex flex-col bg-[#FFFFFF] w-[305px] h-auto items-center rounded-lg shadow-lg hover:scale-105 transition-transform duration-300">
              <img
                src={dortmund}
                alt="Dortmund"
                className="text-center w-[300px] h-[200px] rounded-lg shadow-lg hover:scale-105 transition-transform duration-300"
              />
              <h1 className="text-black text-2xl font-bold mr-auto px-2"> Dortmund </h1>
              <div className="flex justify-around gap-2 w-full p-2 items-center">
                <h1 className="text-[#F28C38] text-xl font-bold mr-auto"> A partir de R$ 3.500 </h1>
                <button className="bg-[#F28C38E5] text-white w-auto  rounded-md hover:bg-[#5a3f7b] transition-colors duration-300 mb-2 p-2">
                  <span className="text-base text-center font-normal">VER MAIS</span>
                </button>
              </div>
            </div>
            <div className="flex flex-col bg-[#FFFFFF] w-[305px] h-auto items-center rounded-lg shadow-lg hover:scale-105 transition-transform duration-300">
              <img
                src={monaco}
                alt="Monaco"
                className="text-center w-[300px] h-[200px] rounded-lg shadow-lg hover:scale-105 transition-transform duration-300"
              />
              <h1 className="text-black text-2xl font-bold mr-auto px-2"> Monaco </h1>
              <div className="flex justify-around gap-2 w-full p-2 items-center">
                <h1 className="text-[#F28C38] text-xl font-bold mr-auto"> A partir de R$ 6.500 </h1>
                <button className="bg-[#F28C38E5] text-white w-auto  rounded-md hover:bg-[#5a3f7b] transition-colors duration-300 mb-2 p-2">
                  <span className="text-base text-center font-normal">VER MAIS</span>
                </button>
              </div>
            </div>
            <div className="flex flex-col bg-[#FFFFFF] w-[305px] h-auto items-center rounded-lg shadow-lg hover:scale-105 transition-transform duration-300">
              <img
                src={inglaterra}
                alt="Inglaterra"
                className="text-center w-[300px] h-[200px] rounded-lg shadow-lg hover:scale-105 transition-transform duration-300"
              />
              <h1 className="text-black text-2xl font-bold mr-auto px-2"> Inglaterra </h1>
              <div className="flex justify-around gap-2 w-full p-2 items-center">
                <h1 className="text-[#F28C38] text-xl font-bold mr-auto"> A partir de R$ 2.500 </h1>
                <button className="bg-[#F28C38E5] text-white w-auto  rounded-md hover:bg-[#5a3f7b] transition-colors duration-300 mb-2 p-2">
                  <span className="text-base text-center font-normal">VER MAIS</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
