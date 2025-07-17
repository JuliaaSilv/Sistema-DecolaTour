import React from "react";
import foz from "../assets/inglaterra.jpg";
import rio from "../assets/monaco.png";
import florianopolis from "../assets/paris.png";
import maceio from "../assets/roma.png";
import puntaCana from "../assets/Tokyo.png";
import santiago from "../assets/Veneza.png";
import buenosAires from "../assets/lasVegas.png";
import maragogi from "../assets/Dortmund.jpg";
import fundo from "../assets/fundoHome.png"

export default function Packages() {
  return (
    <main className="bg-[#E6E6EB] min-h-screen flex flex-col pb-8">
      <div>
        <img src={fundo} alt="Fundo" className="w-full h-[312px] object-cover" />
      </div>
      <section className="mt-12 flex flex-col items-center gap-8">
        <h2 className="text-[#6A4C93] text-2xl font-bold font-roboto">Pacotes Completos</h2>
        <div className="flex flex-wrap justify-center gap-8 w-full">
          <div className="flex flex-col bg-white w-[305px] rounded-lg shadow-lg hover:scale-105 transition-transform duration-300">
            <img src={foz} alt="Foz do Iguaçu" className="w-full h-[200px] rounded-t-lg object-cover" />
            <div className="p-4">
              <h3 className="text-[#6A4C93] text-xl font-bold">Foz do Iguaçu</h3>
              <p className="text-gray-700 text-sm mt-2">6 Dias / 5 Noites</p>
              <p className="text-gray-500 text-xs">Inclui: Voo direto, hotel 4 estrelas, transfer</p>
              <div className="flex justify-between items-center mt-4">
                <span className="text-[#F28C38] text-lg font-bold">R$ 2.110</span>
                <button className="bg-[#F28C38E5] text-white rounded-md px-4 py-2 hover:bg-[#5a3f7b] transition-colors duration-300">
                  Ver mais
                </button>
              </div>
            </div>
          </div>
          <div className="flex flex-col bg-white w-[305px] rounded-lg shadow-lg hover:scale-105 transition-transform duration-300">
            <img src={rio} alt="Rio de Janeiro" className="w-full h-[200px] rounded-t-lg object-cover" />
            <div className="p-4">
              <h3 className="text-[#6A4C93] text-xl font-bold">Rio de Janeiro</h3>
              <p className="text-gray-700 text-sm mt-2">6 Dias / 5 Noites</p>
              <p className="text-gray-500 text-xs">Inclui: Voo direto, hotel 3 estrelas, transfer</p>
              <div className="flex justify-between items-center mt-4">
                <span className="text-[#F28C38] text-lg font-bold">R$ 1.355</span>
                <button className="bg-[#F28C38E5] text-white rounded-md px-4 py-2 hover:bg-[#5a3f7b] transition-colors duration-300">
                  Ver mais
                </button>
              </div>
            </div>
          </div>
          <div className="flex flex-col bg-white w-[305px] rounded-lg shadow-lg hover:scale-105 transition-transform duration-300">
            <img src={florianopolis} alt="Florianópolis" className="w-full h-[200px] rounded-t-lg object-cover" />
            <div className="p-4">
              <h3 className="text-[#6A4C93] text-xl font-bold">Florianópolis</h3>
              <p className="text-gray-700 text-sm mt-2">5 Dias / 4 Noites</p>
              <p className="text-gray-500 text-xs">Inclui: Voo direto, hotel 3 estrelas, transfer</p>
              <div className="flex justify-between items-center mt-4">
                <span className="text-[#F28C38] text-lg font-bold">R$ 807</span>
                <button className="bg-[#F28C38E5] text-white rounded-md px-4 py-2 hover:bg-[#5a3f7b] transition-colors duration-300">
                  Ver mais
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-16 flex flex-col items-center gap-8">
        <h2 className="text-[#6A4C93] text-2xl font-bold font-roboto">Pacotes 2 em 1</h2>
        <div className="flex flex-wrap justify-center gap-8 w-full">
          <div className="flex flex-col bg-white w-[305px] rounded-lg shadow-lg hover:scale-105 transition-transform duration-300">
            <img
              src={maragogi}
              alt="Maragogi + Porto de Galinhas"
              className="w-full h-[200px] rounded-t-lg object-cover"
            />
            <div className="p-4">
              <h3 className="text-[#6A4C93] text-xl font-bold">Maragogi + Porto de Galinhas</h3>
              <p className="text-gray-700 text-sm mt-2">8 Dias / 7 Noites</p>
              <p className="text-gray-500 text-xs">Inclui: Voo direto, hotéis, transfer</p>
              <div className="flex justify-between items-center mt-4">
                <span className="text-[#F28C38] text-lg font-bold">R$ 2.554</span>
                <button className="bg-[#F28C38E5] text-white rounded-md px-4 py-2 hover:bg-[#5a3f7b] transition-colors duration-300">
                  Ver mais
                </button>
              </div>
            </div>
          </div>
          <div className="flex flex-col bg-white w-[305px] rounded-lg shadow-lg hover:scale-105 transition-transform duration-300">
            <img src={maceio} alt="Maceió + Maragogi" className="w-full h-[200px] rounded-t-lg object-cover" />
            <div className="p-4">
              <h3 className="text-[#6A4C93] text-xl font-bold">Maceió + Maragogi</h3>
              <p className="text-gray-700 text-sm mt-2">7 Dias / 6 Noites</p>
              <p className="text-gray-500 text-xs">Inclui: Voo direto, hotéis, transfer</p>
              <div className="flex justify-between items-center mt-4">
                <span className="text-[#F28C38] text-lg font-bold">R$ 3.333</span>
                <button className="bg-[#F28C38E5] text-white rounded-md px-4 py-2 hover:bg-[#5a3f7b] transition-colors duration-300">
                  Ver mais
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-16 flex flex-col items-center gap-8">
        <h2 className="text-[#6A4C93] text-2xl font-bold font-roboto">Clássicos Internacionais</h2>
        <div className="flex flex-wrap justify-center gap-8 w-full">
          <div className="flex flex-col bg-white w-[305px] rounded-lg shadow-lg hover:scale-105 transition-transform duration-300">
            <img src={puntaCana} alt="Punta Cana" className="w-full h-[200px] rounded-t-lg object-cover" />
            <div className="p-4">
              <h3 className="text-[#6A4C93] text-xl font-bold">Punta Cana</h3>
              <p className="text-gray-700 text-sm mt-2">8 Dias / 7 Noites</p>
              <p className="text-gray-500 text-xs">Inclui: Voo direto, hotel all inclusive, transfer</p>
              <div className="flex justify-between items-center mt-4">
                <span className="text-[#F28C38] text-lg font-bold">R$ 5.542</span>
                <button className="bg-[#F28C38E5] text-white rounded-md px-4 py-2 hover:bg-[#5a3f7b] transition-colors duration-300">
                  Ver mais
                </button>
              </div>
            </div>
          </div>
          <div className="flex flex-col bg-white w-[305px] rounded-lg shadow-lg hover:scale-105 transition-transform duration-300">
            <img src={santiago} alt="Santiago" className="w-full h-[200px] rounded-t-lg object-cover" />
            <div className="p-4">
              <h3 className="text-[#6A4C93] text-xl font-bold">Santiago</h3>
              <p className="text-gray-700 text-sm mt-2">6 Dias / 5 Noites</p>
              <p className="text-gray-500 text-xs">Inclui: Voo direto, hotel 4 estrelas, transfer</p>
              <div className="flex justify-between items-center mt-4">
                <span className="text-[#F28C38] text-lg font-bold">R$ 3.960</span>
                <button className="bg-[#F28C38E5] text-white rounded-md px-4 py-2 hover:bg-[#5a3f7b] transition-colors duration-300">
                  Ver mais
                </button>
              </div>
            </div>
          </div>
          <div className="flex flex-col bg-white w-[305px] rounded-lg shadow-lg hover:scale-105 transition-transform duration-300">
            <img src={buenosAires} alt="Buenos Aires" className="w-full h-[200px] rounded-t-lg object-cover" />
            <div className="p-4">
              <h3 className="text-[#6A4C93] text-xl font-bold">Buenos Aires</h3>
              <p className="text-gray-700 text-sm mt-2">6 Dias / 5 Noites</p>
              <p className="text-gray-500 text-xs">Inclui: Voo direto, hotel 3 estrelas, transfer</p>
              <div className="flex justify-between items-center mt-4">
                <span className="text-[#F28C38] text-lg font-bold">R$ 3.103</span>
                <button className="bg-[#F28C38E5] text-white rounded-md px-4 py-2 hover:bg-[#5a3f7b] transition-colors duration-300">
                  Ver mais
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
