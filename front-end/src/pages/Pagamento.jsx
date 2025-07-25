import React, { useState } from "react";
import Florianopolis from "../assets/packages_images/florianopolis.jpg";

// Estilos CSS customizados para o efeito 3D
const customStyles = {
  perspective: {
    perspective: '1000px'
  }
};

function getCardFlag(number) {
  if (!number) return null;
  const cleanNumber = number.replace(/\s/g, "");
  const first = cleanNumber[0];
  const firstTwo = cleanNumber.substring(0, 2);
  
  if (first === "4") return "visa";
  if (first === "5" || (firstTwo >= "51" && firstTwo <= "55")) return "mastercard";
  if (first === "3" && (cleanNumber[1] === "4" || cleanNumber[1] === "7")) return "amex";
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
    let formattedValue = value;

    // Formatação do número do cartão
    if (name === "number") {
      formattedValue = value
        .replace(/\D/g, "") // Remove tudo que não é dígito
        .replace(/(\d{4})(?=\d)/g, "$1 ") // Adiciona espaço a cada 4 dígitos
        .substring(0, 19); // Limita a 19 caracteres (16 dígitos + 3 espaços)
    }

    // Formatação da validade
    if (name === "expiry") {
      formattedValue = value
        .replace(/\D/g, "") // Remove tudo que não é dígito
        .replace(/(\d{2})(\d)/, "$1/$2") // Adiciona / após os dois primeiros dígitos
        .substring(0, 5); // Limita a 5 caracteres (MM/AA)
    }

    // Formatação do CVV (apenas dígitos)
    if (name === "cvv") {
      formattedValue = value.replace(/\D/g, "").substring(0, 3);
    }

    // Formatação do nome (apenas letras e espaços)
    if (name === "name") {
      formattedValue = value.replace(/[^a-zA-ZÀ-ÿ\s]/g, "").toUpperCase();
    }

    setCard((prev) => ({ ...prev, [name]: formattedValue }));
    
    if (name === "cvv") {
      setIsFlipped(formattedValue.length > 0);
    }
  };

  return (
    <section className="pt-6 pb-10 min-h-screen bg-gradient-to-br from-blue-50 via-gray-50 to-orange-50">
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold text-[#F28C38] mb-2">Finalizar Pagamento</h1>
          <p className="text-gray-600">Complete sua reserva de forma segura</p>
        </div>

        {/* Detalhes da reserva */}
        <div className="mb-8 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow duration-300">
          <div className="bg-[#F28C38] text-white p-4">
            <h2 className="text-xl font-bold">Detalhes da Reserva</h2>
          </div>
          <div className="p-5 flex flex-col lg:flex-row items-center justify-between gap-5">
            {/* Imagem do destino */}
            <img
              src={Florianopolis}
              alt="Destino"
              className="w-28 h-28 lg:w-32 lg:h-32 object-cover rounded-xl shadow-lg transform hover:scale-105 transition-transform duration-300"
            />
            {/* Informações da reserva */}
            <div className="flex-1 space-y-2 text-center lg:text-left lg:ml-5">
              <div className="flex items-center justify-center lg:justify-start">
                <span className="text-base font-semibold text-gray-700">📍 Destino:</span>
                <span className="ml-2 text-base text-gray-900 font-medium">Florianópolis</span>
              </div>
              <div className="flex items-center justify-center lg:justify-start">
                <span className="text-base font-semibold text-gray-700">📅 Data:</span>
                <span className="ml-2 text-base text-gray-900 font-medium">23/07/2025</span>
              </div>
              <div className="flex items-center justify-center lg:justify-start">
                <span className="text-base font-semibold text-gray-700">👥 Pessoas:</span>
                <span className="ml-2 text-base text-gray-900 font-medium">2 adultos</span>
              </div>
            </div>
            {/* Valor à direita */}
            <div className="bg-[#F28C38] text-white px-6 py-3 rounded-xl shadow-lg">
              <div className="text-center">
                <p className="text-sm font-medium opacity-90">Total</p>
                <div className="text-2xl lg:text-3xl font-extrabold">R$ 4.500,00</div>
              </div>
            </div>
          </div>
        </div>

        {/* Seção de Pagamento */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="bg-[#F28C38] text-white p-4">
            <h3 className="text-xl font-bold">Forma de Pagamento</h3>
          </div>
          
          {/* Opções de pagamento */}
          <div className="p-5">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
              <button
                className={`relative p-3 rounded-xl border-2 transition-all duration-300 transform hover:scale-105 hover:shadow-lg cursor-pointer ${
                  selected === "credito" 
                    ? "bg-[#F28C38] text-white border-[#F28C38] shadow-lg" 
                    : "bg-white text-gray-700 border-gray-200 hover:border-[#F28C38] hover:text-[#F28C38]"
                }`}
                onClick={() => setSelected("credito")}
              >
                <div className="text-center">
                  <div className="text-xl mb-1">💳</div>
                  <div className="font-semibold text-sm">Cartão de Crédito</div>
                  <div className="text-xs opacity-75 mt-1">Até 12x sem juros</div>
                </div>
                {selected === "credito" && (
                  <div className="absolute -top-1 -right-1 bg-green-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                    ✓
                  </div>
                )}
              </button>
              
              <button
                className={`relative p-3 rounded-xl border-2 transition-all duration-300 transform hover:scale-105 hover:shadow-lg cursor-pointer ${
                  selected === "debito" 
                    ? "bg-[#F28C38] text-white border-[#F28C38] shadow-lg" 
                    : "bg-white text-gray-700 border-gray-200 hover:border-[#F28C38] hover:text-[#F28C38]"
                }`}
                onClick={() => setSelected("debito")}
              >
                <div className="text-center">
                  <div className="text-xl mb-1">🏦</div>
                  <div className="font-semibold text-sm">Cartão de Débito</div>
                  <div className="text-xs opacity-75 mt-1">À vista</div>
                </div>
                {selected === "debito" && (
                  <div className="absolute -top-1 -right-1 bg-green-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                    ✓
                  </div>
                )}
              </button>
              
              <button
                className={`relative p-3 rounded-xl border-2 transition-all duration-300 transform hover:scale-105 hover:shadow-lg cursor-pointer ${
                  selected === "pix" 
                    ? "bg-[#F28C38] text-white border-[#F28C38] shadow-lg" 
                    : "bg-white text-gray-700 border-gray-200 hover:border-[#F28C38] hover:text-[#F28C38]"
                }`}
                onClick={() => setSelected("pix")}
              >
                <div className="text-center">
                  <div className="text-xl mb-1">📱</div>
                  <div className="font-semibold text-sm">Pix</div>
                  <div className="text-xs opacity-75 mt-1">Instantâneo</div>
                </div>
                {selected === "pix" && (
                  <div className="absolute -top-1 -right-1 bg-green-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                    ✓
                  </div>
                )}
              </button>
              
              <button
                className={`relative p-3 rounded-xl border-2 transition-all duration-300 transform hover:scale-105 hover:shadow-lg cursor-pointer ${
                  selected === "boleto" 
                    ? "bg-[#F28C38] text-white border-[#F28C38] shadow-lg" 
                    : "bg-white text-gray-700 border-gray-200 hover:border-[#F28C38] hover:text-[#F28C38]"
                }`}
                onClick={() => setSelected("boleto")}
              >
                <div className="text-center">
                  <div className="text-xl mb-1">🧾</div>
                  <div className="font-semibold text-sm">Boleto</div>
                  <div className="text-xs opacity-75 mt-1">Até 3 dias úteis</div>
                </div>
                {selected === "boleto" && (
                  <div className="absolute -top-1 -right-1 bg-green-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                    ✓
                  </div>
                )}
              </button>
            </div>

            {/* Formulário e cartão animado para crédito/débito */}
            {(selected === "credito" || selected === "debito") && (
              <div className="grid lg:grid-cols-2 gap-6 items-center">
                {/* Formulário */}
                <div className="bg-gray-50 p-5 rounded-xl border border-gray-200">
                  <h4 className="text-lg font-semibold text-gray-800 mb-4">Dados do Cartão</h4>
                  <form className="space-y-3">
                    <div className="relative group">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Número do cartão
                      </label>
                      <input
                        type="text"
                        name="number"
                        maxLength={19}
                        placeholder="0000 0000 0000 0000"
                        className="w-full p-3 border-2 border-gray-200 rounded-xl transition-all duration-300 focus:border-[#F28C38] focus:ring-4 focus:ring-orange-100 group-hover:border-gray-300 cursor-text"
                        value={card.number}
                        onChange={handleChange}
                      />
                      {/* Bandeira do cartão */}
                      {flag && (
                        <div className="absolute right-3 top-10 bg-white p-1 rounded shadow-sm">
                          {flag === "visa" && (
                            <img src="https://upload.wikimedia.org/wikipedia/commons/4/41/Visa_Logo.png" alt="Visa" className="h-5" />
                          )}
                          {flag === "mastercard" && (
                            <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-5" />
                          )}
                          {flag === "amex" && (
                            <img src="https://upload.wikimedia.org/wikipedia/commons/3/30/American_Express_logo_%282018%29.svg" alt="Amex" className="h-5" />
                          )}
                        </div>
                      )}
                    </div>
                    
                    <div className="group">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nome do titular
                      </label>
                      <input
                        type="text"
                        name="name"
                        placeholder="Digite seu nome completo"
                        className="w-full p-3 border-2 border-gray-200 rounded-xl transition-all duration-300 focus:border-[#F28C38] focus:ring-4 focus:ring-orange-100 group-hover:border-gray-300 cursor-text"
                        value={card.name}
                        onChange={handleChange}
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div className="group">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Validade
                        </label>
                        <input
                          type="text"
                          name="expiry"
                          maxLength={5}
                          placeholder="MM/AA"
                          className="w-full p-3 border-2 border-gray-200 rounded-xl transition-all duration-300 focus:border-[#F28C38] focus:ring-4 focus:ring-orange-100 group-hover:border-gray-300 cursor-text"
                          value={card.expiry}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="group">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          CVV
                        </label>
                        <input
                          type="text"
                          name="cvv"
                          maxLength={3}
                          placeholder="000"
                          className="w-full p-3 border-2 border-gray-200 rounded-xl transition-all duration-300 focus:border-[#F28C38] focus:ring-4 focus:ring-orange-100 group-hover:border-gray-300 cursor-text"
                          value={card.cvv}
                          onChange={handleChange}
                          onFocus={() => setIsFlipped(true)}
                          onBlur={() => setIsFlipped(false)}
                        />
                      </div>
                    </div>
                    
                    {/* Parcelamento apenas para crédito */}
                    {selected === "credito" && (
                      <div className="group">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Parcelamento
                        </label>
                        <select
                          className="w-full p-3 border-2 border-gray-200 rounded-xl transition-all duration-300 focus:border-[#F28C38] focus:ring-4 focus:ring-orange-100 group-hover:border-gray-300 cursor-pointer"
                          value={parcelas}
                          onChange={e => setParcelas(Number(e.target.value))}
                        >
                          {[...Array(12)].map((_, i) => (
                            <option key={i + 1} value={i + 1}>
                              {i + 1}x de R$ {(4500 / (i + 1)).toFixed(2).replace('.', ',')} {i === 0 ? '(à vista)' : ''}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                  </form>
                </div>
                
                {/* Cartão animado */}
                <div className="flex items-center justify-center">
                  <div className="relative w-72 h-44" style={customStyles.perspective}>
                    <div
                      className={`absolute w-full h-full transition-transform duration-700 ease-in-out`}
                      style={{
                        transformStyle: 'preserve-3d',
                        transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
                      }}
                    >
                      {/* Frente do cartão */}
                      <div 
                        className="absolute w-full h-full bg-[#F28C38] text-white rounded-2xl shadow-2xl flex flex-col justify-between p-5 transform hover:scale-105 transition-transform duration-300"
                        style={{ backfaceVisibility: 'hidden' }}
                      >
                        {/* Header com logo e bandeira */}
                        <div className="flex justify-between items-start">
                          <div className="text-sm font-semibold opacity-90">DECOLA TOUR</div>
                          <div className="h-7">
                            {flag === "visa" && (
                              <img src="https://upload.wikimedia.org/wikipedia/commons/4/41/Visa_Logo.png" alt="Visa" className="h-7 filter brightness-0 invert" />
                            )}
                            {flag === "mastercard" && (
                              <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-7" />
                            )}
                            {flag === "amex" && (
                              <img src="https://upload.wikimedia.org/wikipedia/commons/3/30/American_Express_logo_%282018%29.svg" alt="Amex" className="h-7 filter brightness-0 invert" />
                            )}
                          </div>
                        </div>
                        
                        {/* Chip */}
                        <div className="w-10 h-7 bg-gradient-to-br from-yellow-200 to-yellow-400 rounded-lg shadow-inner"></div>
                        
                        {/* Número do cartão */}
                        <div className="text-lg lg:text-xl font-bold tracking-widest">
                          {card.number || "•••• •••• •••• ••••"}
                        </div>
                        
                        {/* Footer */}
                        <div className="flex justify-between items-end">
                          <div>
                            <div className="text-xs opacity-75">Nome do titular</div>
                            <div className="font-semibold text-sm">
                              {card.name || "SEU NOME AQUI"}
                            </div>
                          </div>
                          <div>
                            <div className="text-xs opacity-75">Validade</div>
                            <div className="font-semibold">{card.expiry || "MM/AA"}</div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Verso do cartão */}
                      <div 
                        className="absolute w-full h-full bg-[#F28C38] text-white rounded-2xl shadow-2xl overflow-hidden"
                        style={{ 
                          backfaceVisibility: 'hidden',
                          transform: 'rotateY(180deg)'
                        }}
                      >
                        {/* Faixa magnética */}
                        <div className="w-full h-10 bg-gray-800 mt-5"></div>
                        
                        {/* CVV */}
                        <div className="p-5 pt-6">
                          <div className="bg-white h-7 rounded flex items-center justify-end px-3 mb-3">
                            <span className="text-gray-800 font-bold tracking-wider">
                              {card.cvv || "•••"}
                            </span>
                          </div>
                          <div className="text-xs opacity-75">
                            Para sua segurança, não compartilhe o código CVV
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Pix ou Boleto selecionado */}
            {selected === "pix" && (
              <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                <div className="text-center">
                  <div className="text-5xl mb-3">📱</div>
                  <h4 className="text-xl font-bold text-[#F28C38] mb-3">Pagamento via Pix</h4>
                  <div className="bg-white p-4 rounded-lg border border-gray-200 inline-block">
                    <p className="text-sm text-gray-600 mb-2">Chave Pix:</p>
                    <p className="font-mono text-lg font-semibold text-[#F28C38]">pix@decolatour.com.br</p>
                  </div>
                  <p className="text-sm text-gray-600 mt-3">
                    O QR Code será exibido na próxima tela para facilitar o pagamento
                  </p>
                </div>
              </div>
            )}
            
            {selected === "boleto" && (
              <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                <div className="text-center">
                  <div className="text-5xl mb-3">🧾</div>
                  <h4 className="text-xl font-bold text-[#F28C38] mb-3">Pagamento via Boleto</h4>
                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <p className="text-gray-700">
                      O boleto será gerado após a confirmação e enviado para o seu e-mail.
                    </p>
                    <p className="text-sm text-gray-600 mt-2">
                      Prazo de vencimento: 3 dias úteis
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Botão de confirmação */}
        <div className="mt-8">
          <button className="w-full bg-[#F28C38] text-white py-4 px-8 rounded-xl font-bold text-lg hover:bg-orange-600 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl focus:ring-4 focus:ring-orange-200 focus:outline-none cursor-pointer">
            <div className="flex items-center justify-center gap-3">
              <span>🔒</span>
              <span>Confirmar Pagamento Seguro</span>
              <span className="text-sm opacity-90">- R$ 4.500,00</span>
            </div>
          </button>
          
          {/* Informações de segurança */}
          <div className="mt-5 text-center">
            <div className="flex items-center justify-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <span>🔒</span>
                <span>SSL Seguro</span>
              </div>
              <div className="flex items-center gap-1">
                <span>🛡️</span>
                <span>Dados Protegidos</span>
              </div>
              <div className="flex items-center gap-1">
                <span>✅</span>
                <span>Site Verificado</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </section>
  );
}