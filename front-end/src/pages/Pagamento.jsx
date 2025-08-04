import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { obterIdUsuario } from "../api/auth";
import { getAuthHeaders } from "../api/reservas";
import { ArrowLeft } from "lucide-react";
import qrCodePix from "../assets/qrcodepix.png";

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
  const location = useLocation();
  const navigate = useNavigate();
  
  const { travelerData, pacote } = location.state || {};
  
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

  // Verificar se temos os dados necessários
  if (!travelerData || !pacote) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Dados da reserva não encontrados</h2>
          <button 
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-[#F28C38] text-white rounded-xl"
          >
            Voltar ao Início
          </button>
        </div>
      </div>
    );
  }

  const calculateTotal = () => {
    const basePrice = (pacote?.preco || 0) * (travelerData?.numeroViajantes || 1);
    const installmentFee = parcelas > 1 ? basePrice * 0.02 : 0;
    return basePrice + installmentFee;
  };

  const calculateDiscount = () => {
    if (selected === 'pix') {
      return calculateTotal() * 0.05;
    }
    return 0;
  };

  const getFinalTotal = () => {
    const total = calculateTotal() - calculateDiscount();
    return isNaN(total) ? 0 : total;
  };

  const getInstallmentValue = (installments) => {
    const baseTotal = calculateTotal();
    const totalWithFee = installments > 1 ? baseTotal * 1.02 : baseTotal;
    const discount = selected === 'pix' ? totalWithFee * 0.05 : 0;
    const finalTotal = totalWithFee - discount;
    return finalTotal / installments;
  };

  const getPaymentButtonText = () => {
    const total = getFinalTotal();
    if (selected === 'credito' && parcelas > 1) {
      const installmentValue = getInstallmentValue(parcelas);
      return `R$ ${total.toLocaleString('pt-BR')} (${parcelas}x de R$ ${installmentValue.toLocaleString('pt-BR')})`;
    }
    return `R$ ${total.toLocaleString('pt-BR')}`;
  };

  // Validação dos campos de pagamento
  const isFormValid = () => {
    if (selected === 'credito' || selected === 'debito') {
      return (
        card.number.replace(/\s/g, '').length === 16 &&
        card.name.trim() !== '' &&
        card.expiry.length === 5 &&
        card.cvv.length === 3
      );
    }
    return true;
  };

  // Simplified: apenas navega para confirmação para testar botão
  const handleFinalizarCompra = () => {
    // Teste: navega direto à tela de confirmação
    navigate('/booking-confirmation', {
      state: {
        travelerData,
        paymentData: {
          method: selected,
          total: getFinalTotal(),
          installments: parcelas
        },
        pacote
      }
    });
  };

  const handleBack = () => {
    navigate(-1);
  };

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
        {/* Header com botão voltar */}
        <div className="mb-6">
          <div className="flex justify-start mb-4">
            <button
              onClick={handleBack}
              className="flex items-center gap-2 text-[#F28C38] hover:text-orange-600 transition-colors duration-300 cursor-pointer"
            >
              <ArrowLeft size={20} />
              Voltar aos dados do viajante
            </button>
          </div>
          <div className="text-center">
            <h1 className="text-3xl lg:text-4xl font-bold text-[#F28C38] mb-2">Finalizar Pagamento</h1>
            <p className="text-gray-600">Etapa 2 de 3 - Complete sua reserva de forma segura</p>
          </div>
        </div>

        {/* Resumo da reserva */}
        <div className="mb-8 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow duration-300">
          <div className="bg-gradient-to-r from-[#F28C38] to-orange-500 p-6">
            <h2 className="text-xl font-bold text-white mb-2">Resumo da Reserva</h2>
            <p className="text-orange-100">Verifique os detalhes antes de prosseguir</p>
          </div>
          <div className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <img
                src={pacote.imagens && pacote.imagens.length > 0
                  ? `http://localhost:5295${pacote.imagens[0].url}`
                  : '/default-package.jpg'
                }
                alt={pacote.titulo}
                className="w-20 h-20 object-cover rounded-lg"
              />
              <div>
                <h3 className="font-semibold text-gray-800 text-lg">{pacote.titulo}</h3>
                <h4 className="text-gray-600">{`${pacote.titulo}, ${pacote.destino}`}</h4>
                <p className="text-gray-600">
                  {travelerData.numeroViajantes} {travelerData.numeroViajantes === 1 ? 'pessoa' : 'pessoas'} •
                  {' '}{new Date(travelerData.dataViagem).toLocaleDateString('pt-BR')}
                </p>
              </div>
            </div>
            
            <div className="border-t pt-4">
              <div className="flex justify-between text-sm mb-2">
                <span>Pacote ({travelerData.numeroViajantes}x)</span>
                <span>R$ {(pacote.preco * travelerData.numeroViajantes).toLocaleString('pt-BR')}</span>
              </div>
              {parcelas > 1 && (
                <div className="flex justify-between text-sm mb-2 text-orange-600">
                  <span>Taxa de parcelamento (2%)</span>
                  <span>R$ {(pacote.preco * travelerData.numeroViajantes * 0.02).toLocaleString('pt-BR')}</span>
                </div>
              )}
              {selected === 'pix' && (
                <div className="flex justify-between text-sm mb-2 text-green-600">
                  <span>Desconto PIX (5%)</span>
                  <span>- R$ {calculateDiscount().toLocaleString('pt-BR')}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-lg border-t pt-2">
                <span>Total</span>
                <span className="text-[#F28C38]">R$ {getFinalTotal().toLocaleString('pt-BR')}</span>
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
                              {i + 1}x de R$ {getInstallmentValue(i + 1).toLocaleString('pt-BR')} {i === 0 ? '(à vista)' : ''}
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
                        <div className="t
                        ext-lg lg:text-xl font-bold tracking-widest">
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
                  <h4 className="text-xl font-bold text-[#F28C38] mb-4">Pagamento via Pix</h4>
                  
                  {/* QR Code */}
                  <div className="bg-white p-6 rounded-lg border border-gray-200 inline-block mb-4">
                    <img 
                      src={qrCodePix} 
                      alt="QR Code PIX" 
                      className="w-48 h-48 mx-auto mb-3"
                    />
                    <p className="text-sm text-gray-600 mb-2">Chave Pix:</p>
                    <p className="font-mono text-lg font-semibold text-[#F28C38]">pix@decolatour.com.br</p>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-sm text-gray-700 font-medium">
                      ✅ Escaneie o QR Code
                    </p>
                    <p className="text-sm text-gray-600">
                      Ou copie a chave PIX acima para fazer a transferência
                    </p>
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3 mt-3">
                      <p className="text-sm text-green-700 font-medium">
                        💰 Desconto de 5% aplicado no pagamento via PIX
                      </p>
                    </div>
                  </div>
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
        <form onSubmit={e => { e.preventDefault(); handleFinalizarCompra(); }} className="mt-8">
          <button
            type="submit"
            className="w-full bg-[#F28C38] text-white py-4 px-8 rounded-xl font-bold text-lg hover:bg-orange-600 hover:scale-[1.02] hover:shadow-xl cursor-pointer focus:ring-4 focus:ring-orange-200 focus:outline-none transition-all duration-300 transform"
          >
            <div className="flex items-center justify-center gap-3">
              <span>🔒</span>
              <span>Confirmar Pagamento Seguro</span>
              <span className="text-sm opacity-90">- {getPaymentButtonText()}</span>
            </div>
          </button>
        </form>
        
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
      </main>
    </section>
  );
}