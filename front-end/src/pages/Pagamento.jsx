import React, { useState } from "react";
import Florianopolis from "../assets/packages_images/florianopolis.jpg";

function getCardFlag(number) {
  if (!number) return null;
  const first = number[0];
  if (first === "4") return "visa";
  if (first === "5") return "mastercard";
  if (first === "3") return "amex";
  return null;
}

export default function Pagamento() {
  const [card, setCard] = useState({
    number: "",
    name: "",
    expiry: "",
    cvv: "",
  });
  const [isFlipped, setIsFlipped] = useState(false);
  const [selected, setSelected] = useState("credito");
  const [parcelas, setParcelas] = useState(1);

  const flag = getCardFlag(card.number.replace(/\s/g, ""));

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCard((prev) => ({ ...prev, [name]: value }));
    if (name === "cvv") {
      setIsFlipped(value.length > 0);
    }
  };

  return (
    <section className="pt-8 pb-8 min-h-screen flex flex-col justify-between">
      <main className="max-w-2xl mx-auto mb-8">
        {/* Detalhes da reserva */}
        <div className="mb-6 flex items-center justify-between gap-4">
          {/* Imagem do destino */}
          <img
            src={Florianopolis}
            alt="Destino"
            className="w-24 h-24 object-cover rounded-lg shadow"
          />
          {/* Informações da reserva */}
          <div className="flex-1 ml-4">
            <h2 className="text-xl font-bold text-[#F28C38]">Detalhes da Reserva</h2>
            <p>Destino: Florianopólis</p>
            <p>Data: 23/07/2025</p>
            <p>Pessoas: 2</p>
          </div>
          {/* Valor à direita */}
          <div className="text-[#F28C38] font-extrabold text-3xl ml-4 whitespace-nowrap">
            R$ 4.500,00
          </div>
        </div>

        {/* Texto acima das opções de pagamento */}
        <div className="mb-2">
          <span className="text-base font-semibold text-[#F28C38]">Escolha a forma de pagamento</span>
        </div>
        {/* Opções de pagamento */}
        <div className="mb-6 flex gap-4 flex-wrap">
          <button
            className={`px-4 py-2 rounded-md border ${selected === "credito" ? "bg-[#F28C38] text-white" : "bg-gray-200"}`}
            onClick={() => setSelected("credito")}
          >
            Cartão de Crédito
          </button>
          <button
            className={`px-4 py-2 rounded-md border ${selected === "debito" ? "bg-[#F28C38] text-white" : "bg-gray-200"}`}
            onClick={() => setSelected("debito")}
          >
            Cartão de Débito
          </button>
          <button
            className={`px-4 py-2 rounded-md border ${selected === "pix" ? "bg-[#F28C38] text-white" : "bg-gray-200"}`}
            onClick={() => setSelected("pix")}
          >
            Pix
          </button>
          <button
            className={`px-4 py-2 rounded-md border ${selected === "boleto" ? "bg-[#F28C38] text-white" : "bg-gray-200"}`}
            onClick={() => setSelected("boleto")}
          >
            Boleto
          </button>
        </div>

        {/* Formulário e cartão animado para crédito/débito */}
        {(selected === "credito" || selected === "debito") && (
          <div className="flex gap-8">
            {/* Formulário */}
            <form className="flex flex-col gap-2 w-2/2">
              <div className="relative">
                <input
                  type="text"
                  name="number"
                  maxLength={19}
                  placeholder="Número do cartão"
                  className="border p-2 rounded w-full pr-12"
                  value={card.number}
                  onChange={handleChange}
                />
                {/* Bandeira do cartão */}
                {flag && (
                  <span className="absolute right-3 top-2">
                    {flag === "visa" && (
                      <img src="https://upload.wikimedia.org/wikipedia/commons/4/41/Visa_Logo.png" alt="Visa" className="h-6" />
                    )}
                    {flag === "mastercard" && (
                      <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-6" />
                    )}
                    {flag === "amex" && (
                      <img src="https://upload.wikimedia.org/wikipedia/commons/3/30/American_Express_logo_%282018%29.svg" alt="Amex" className="h-6" />
                    )}
                  </span>
                )}
              </div>
              <input
                type="text"
                name="name"
                placeholder="Nome do titular"
                className="border p-2 rounded"
                value={card.name}
                onChange={handleChange}
              />
              <div className="flex gap-2">
                <input
                  type="text"
                  name="expiry"
                  maxLength={5}
                  placeholder="Validade (MM/AA)"
                  className="border p-2 rounded w-1/2"
                  value={card.expiry}
                  onChange={handleChange}
                />
                <input
                  type="text"
                  name="cvv"
                  maxLength={3}
                  placeholder="CVV"
                  className="border p-2 rounded w-1/2"
                  value={card.cvv}
                  onChange={handleChange}
                  onFocus={() => setIsFlipped(true)}
                  onBlur={() => setIsFlipped(false)}
                />
              </div>
              {/* Parcelamento apenas para crédito */}
              {selected === "credito" && (
                <div className="mt-2">
                  <label className="block text-[#F28C38] font-bold mb-1">Parcelamento</label>
                  <select
                    className="border p-2 rounded w-full"
                    value={parcelas}
                    onChange={e => setParcelas(Number(e.target.value))}
                  >
                    {[...Array(12)].map((_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1}x de R$ {(4500 / (i + 1)).toFixed(2).replace('.', ',')}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </form>
            {/* Cartão animado */}
            <div className="w-1/2 flex items-center justify-center">
              <div className="relative w-64 h-40 perspective">
                <div
                  className={`absolute w-full h-full transition-transform duration-500 [transform-style:preserve-3d] ${
                    isFlipped ? "[transform:rotateY(180deg)]" : ""
                  }`}
                >
                  {/* Frente do cartão */}
                  <div className="absolute w-full h-full bg-[#F28C38] text-white rounded-lg shadow-lg flex flex-col justify-center p-4 [backface-visibility:hidden]">
                    {/* Bandeira do cartão na animação */}
                    <div className="flex justify-end mb-2">
                      {flag === "visa" && (
                        <img src="https://upload.wikimedia.org/wikipedia/commons/4/41/Visa_Logo.png" alt="Visa" className="h-6" />
                      )}
                      {flag === "mastercard" && (
                        <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-6" />
                      )}
                      {flag === "amex" && (
                        <img src="https://upload.wikimedia.org/wikipedia/commons/3/30/American_Express_logo_%282018%29.svg" alt="Amex" className="h-6" />
                      )}
                    </div>
                    <div className="text-lg font-bold tracking-widest mb-4">
                      {card.number || "1234 5678 9012 3456"}
                    </div>
                    <div className="flex justify-between items-center">
                      <span>{card.name || "NOME DO TITULAR"}</span>
                      <span>{card.expiry || "MM/AA"}</span>
                    </div>
                  </div>
                  {/* Verso do cartão */}
                  <div className="absolute w-full h-full bg-[#F28C38] text-white rounded-lg shadow-lg flex flex-col justify-center p-4 [transform:rotateY(180deg)] [backface-visibility:hidden]">
                    <div className="mb-2 bg-white h-6 w-full rounded"></div>
                    <div className="flex flex-col mt-4">
                      <span className="text-xs text-white">CVV</span>
                      <span className="text-lg font-bold tracking-widest">
                        {card.cvv || "___"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Pix ou Boleto selecionado */}
        {selected === "pix" && (
          <div className="mt-8 text-center text-[#F28C38] font-bold">
            Chave Pix: exemplo@exemplo.com
          </div>
        )}
        {selected === "boleto" && (
          <div className="mt-8 text-center text-[#F28C38] font-bold">
            O boleto será gerado após a confirmação.
          </div>
        )}

        <button className="mt-8 w-full bg-[#F28C38] text-white py-3 rounded-lg font-bold hover:bg-[#F28C38E5] transition-colors">
          Confirmar Pagamento
        </button>
      </main>
    </section>
  );
}