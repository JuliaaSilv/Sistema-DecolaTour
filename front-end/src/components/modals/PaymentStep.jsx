import React, { useState } from 'react';
import { CreditCard, Shield, QrCode, FileText, Check, ArrowLeft } from 'lucide-react';

const PaymentStep = ({ onNext, onBack, travelerData, pacote }) => {
  const [paymentMethod, setPaymentMethod] = useState('credit');
  const [isFlipped, setIsFlipped] = useState(false);
  const [formData, setFormData] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
    installments: '1'
  });

  const handleCardInputChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (name === 'cardNumber') {
      formattedValue = value
        .replace(/\D/g, '')
        .replace(/(\d{4})(?=\d)/g, '$1 ')
        .substring(0, 19);
    } else if (name === 'expiryDate') {
      formattedValue = value
        .replace(/\D/g, '')
        .replace(/(\d{2})(\d)/, '$1/$2')
        .substring(0, 5);
    } else if (name === 'cvv') {
      formattedValue = value.replace(/\D/g, '').substring(0, 4);
    }

    setFormData(prev => ({ ...prev, [name]: formattedValue }));
  };

  const calculateTotal = () => {
    const basePrice = pacote.preco * travelerData.numeroViajantes;
    const installmentFee = formData.installments > 1 ? basePrice * 0.02 : 0;
    return basePrice + installmentFee;
  };

  const handlePayment = () => {
    const paymentData = {
      method: paymentMethod,
      total: calculateTotal(),
      ...(paymentMethod === 'credit' && formData)
    };
    onNext(paymentData);
  };

  const PaymentMethodCard = ({ method, icon, title, description, isSelected, onClick }) => (
    <div
      onClick={onClick}
      className={`p-4 border-2 rounded-xl cursor-pointer transition-all duration-300 ${
        isSelected 
          ? 'border-[#F28C38] bg-orange-50' 
          : 'border-gray-200 hover:border-gray-300'
      }`}
    >
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg ${isSelected ? 'bg-[#F28C38] text-white' : 'bg-gray-100 text-gray-600'}`}>
          {icon}
        </div>
        <div>
          <h3 className="font-semibold text-gray-800">{title}</h3>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6">
      {/* Resumo da compra */}
      <div className="bg-gray-50 rounded-xl p-4 mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Resumo da Compra</h3>
        
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>{pacote.nome}</span>
            <span>R$ {pacote.preco?.toLocaleString('pt-BR')}</span>
          </div>
          <div className="flex justify-between">
            <span>Viajantes: {travelerData.numeroViajantes}x</span>
            <span>R$ {(pacote.preco * travelerData.numeroViajantes)?.toLocaleString('pt-BR')}</span>
          </div>
          {formData.installments > 1 && (
            <div className="flex justify-between text-orange-600">
              <span>Taxa de parcelamento (2%)</span>
              <span>R$ {(pacote.preco * travelerData.numeroViajantes * 0.02)?.toLocaleString('pt-BR')}</span>
            </div>
          )}
          <div className="border-t pt-2 flex justify-between font-bold text-lg">
            <span>Total</span>
            <span className="text-[#F28C38]">R$ {calculateTotal()?.toLocaleString('pt-BR')}</span>
          </div>
        </div>
      </div>

      {/* Métodos de pagamento */}
      <div className="space-y-4 mb-6">
        <h3 className="text-xl font-semibold text-gray-800">Forma de Pagamento</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <PaymentMethodCard
            method="credit"
            icon={<CreditCard size={20} />}
            title="Cartão de Crédito"
            description="Parcelamento em até 12x"
            isSelected={paymentMethod === 'credit'}
            onClick={() => setPaymentMethod('credit')}
          />
          
          <PaymentMethodCard
            method="debit"
            icon={<Shield size={20} />}
            title="Cartão de Débito"
            description="Pagamento à vista"
            isSelected={paymentMethod === 'debit'}
            onClick={() => setPaymentMethod('debit')}
          />
          
          <PaymentMethodCard
            method="pix"
            icon={<QrCode size={20} />}
            title="PIX"
            description="5% de desconto"
            isSelected={paymentMethod === 'pix'}
            onClick={() => setPaymentMethod('pix')}
          />
          
          <PaymentMethodCard
            method="boleto"
            icon={<FileText size={20} />}
            title="Boleto Bancário"
            description="Vencimento em 3 dias"
            isSelected={paymentMethod === 'boleto'}
            onClick={() => setPaymentMethod('boleto')}
          />
        </div>
      </div>

      {/* Formulário do cartão de crédito/débito */}
      {(paymentMethod === 'credit' || paymentMethod === 'debit') && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Dados do Cartão</h3>
          
          {/* Cartão visual */}
          <div className="mb-6 flex justify-center">
            <div 
              className={`credit-card ${isFlipped ? 'flipped' : ''}`}
              style={{ perspective: '1000px' }}
            >
              <div className="card-inner" style={{ 
                position: 'relative',
                width: '320px',
                height: '200px',
                transformStyle: 'preserve-3d',
                transition: 'transform 0.6s',
                transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
              }}>
                {/* Frente do cartão */}
                <div className="card-front" style={{
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  backfaceVisibility: 'hidden',
                  background: 'linear-gradient(135deg, #F28C38 0%, #ff6b35 100%)',
                  borderRadius: '16px',
                  padding: '20px',
                  color: 'white',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}>
                  <div className="flex justify-between items-start">
                    <div className="text-lg font-bold">DECOLA TOUR</div>
                    <CreditCard size={24} />
                  </div>
                  
                  <div className="text-2xl font-mono tracking-wider">
                    {formData.cardNumber || '•••• •••• •••• ••••'}
                  </div>
                  
                  <div className="flex justify-between items-end">
                    <div>
                      <div className="text-xs opacity-80">TITULAR</div>
                      <div className="font-semibold">
                        {formData.cardName || 'NOME DO TITULAR'}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs opacity-80">VALIDADE</div>
                      <div className="font-semibold">
                        {formData.expiryDate || 'MM/AA'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Verso do cartão */}
                <div className="card-back" style={{
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  backfaceVisibility: 'hidden',
                  background: 'linear-gradient(135deg, #F28C38 0%, #ff6b35 100%)',
                  borderRadius: '16px',
                  padding: '20px',
                  color: 'white',
                  transform: 'rotateY(180deg)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center'
                }}>
                  <div className="bg-black h-8 mb-4 -mx-20"></div>
                  <div className="bg-gray-200 text-black p-2 rounded text-right font-mono">
                    {formData.cvv || '•••'}
                  </div>
                  <div className="text-xs mt-4 opacity-80">
                    Use este código de segurança para suas compras
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Formulário */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Número do Cartão
              </label>
              <input
                type="text"
                name="cardNumber"
                value={formData.cardNumber}
                onChange={handleCardInputChange}
                className="w-full p-3 border-2 border-gray-200 rounded-xl transition-all duration-300 focus:border-[#F28C38] focus:ring-4 focus:ring-orange-100"
                placeholder="0000 0000 0000 0000"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nome do Titular
              </label>
              <input
                type="text"
                name="cardName"
                value={formData.cardName}
                onChange={handleCardInputChange}
                className="w-full p-3 border-2 border-gray-200 rounded-xl transition-all duration-300 focus:border-[#F28C38] focus:ring-4 focus:ring-orange-100"
                placeholder="Nome como está no cartão"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Validade
              </label>
              <input
                type="text"
                name="expiryDate"
                value={formData.expiryDate}
                onChange={handleCardInputChange}
                className="w-full p-3 border-2 border-gray-200 rounded-xl transition-all duration-300 focus:border-[#F28C38] focus:ring-4 focus:ring-orange-100"
                placeholder="MM/AA"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                CVV
              </label>
              <input
                type="text"
                name="cvv"
                value={formData.cvv}
                onChange={handleCardInputChange}
                onFocus={() => setIsFlipped(true)}
                onBlur={() => setIsFlipped(false)}
                className="w-full p-3 border-2 border-gray-200 rounded-xl transition-all duration-300 focus:border-[#F28C38] focus:ring-4 focus:ring-orange-100"
                placeholder="123"
              />
            </div>

            {paymentMethod === 'credit' && (
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Parcelas
                </label>
                <select
                  name="installments"
                  value={formData.installments}
                  onChange={handleCardInputChange}
                  className="w-full p-3 border-2 border-gray-200 rounded-xl transition-all duration-300 focus:border-[#F28C38] focus:ring-4 focus:ring-orange-100"
                >
                  <option value="1">1x R$ {calculateTotal()?.toLocaleString('pt-BR')} (à vista)</option>
                  {[2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(num => (
                    <option key={num} value={num}>
                      {num}x R$ {(calculateTotal() / num)?.toLocaleString('pt-BR')}
                      {num > 1 && ' (com juros)'}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>
      )}

      {/* PIX */}
      {paymentMethod === 'pix' && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-6">
          <div className="flex items-center gap-3 mb-3">
            <QrCode className="text-green-600" size={24} />
            <h3 className="text-lg font-semibold text-green-800">Pagamento via PIX</h3>
          </div>
          <p className="text-green-700 mb-4">
            Após finalizar a compra, você receberá o código PIX para pagamento.
            <strong className="block mt-2">Desconto de 5% aplicado!</strong>
          </p>
          <div className="bg-white rounded-lg p-3 border">
            <div className="text-sm text-gray-600">Total com desconto:</div>
            <div className="text-2xl font-bold text-green-600">
              R$ {(calculateTotal() * 0.95)?.toLocaleString('pt-BR')}
            </div>
          </div>
        </div>
      )}

      {/* Boleto */}
      {paymentMethod === 'boleto' && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6">
          <div className="flex items-center gap-3 mb-3">
            <FileText className="text-blue-600" size={24} />
            <h3 className="text-lg font-semibold text-blue-800">Boleto Bancário</h3>
          </div>
          <p className="text-blue-700">
            O boleto será gerado após a confirmação da compra e enviado para seu email.
            Vencimento em 3 dias úteis.
          </p>
        </div>
      )}

      {/* Segurança */}
      <div className="bg-gray-50 rounded-xl p-4 mb-6">
        <div className="flex items-center gap-3 mb-2">
          <Shield className="text-green-600" size={20} />
          <span className="font-semibold text-gray-800">Compra 100% Segura</span>
        </div>
        <p className="text-sm text-gray-600">
          Seus dados estão protegidos com criptografia SSL. Não armazenamos informações do cartão.
        </p>
      </div>

      {/* Buttons */}
      <div className="flex justify-between pt-6 border-t">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-300 cursor-pointer"
        >
          <ArrowLeft size={20} />
          Voltar
        </button>
        <button
          onClick={handlePayment}
          className="flex items-center gap-2 px-8 py-3 bg-[#F28C38] text-white rounded-xl hover:bg-orange-600 transition-all duration-300 font-semibold cursor-pointer"
        >
          <Check size={20} />
          Finalizar Compra
        </button>
      </div>
    </div>
  );
};

export default PaymentStep;
