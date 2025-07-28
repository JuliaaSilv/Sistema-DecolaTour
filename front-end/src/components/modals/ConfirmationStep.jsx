import React from 'react';
import { CheckCircle, Calendar, MapPin, Users, CreditCard, Mail, Phone, Download, Share2 } from 'lucide-react';

const ConfirmationStep = ({ onClose, travelerData, paymentData, pacote }) => {
  const bookingId = `DCT${Date.now().toString().slice(-6)}`;
  
  const formatPaymentMethod = (method) => {
    const methods = {
      credit: 'Cartão de Crédito',
      debit: 'Cartão de Débito',
      pix: 'PIX',
      boleto: 'Boleto Bancário'
    };
    return methods[method] || method;
  };

  const handleDownloadVoucher = () => {
    // Aqui você implementaria a lógica para gerar e baixar o voucher em PDF
    console.log('Baixando voucher...');
  };

  const handleShareBooking = () => {
    // Aqui você implementaria a lógica para compartilhar a reserva
    if (navigator.share) {
      navigator.share({
        title: 'Minha Reserva - Decola Tour',
        text: `Reserva confirmada para ${pacote.nome}! ID: ${bookingId}`,
        url: window.location.href
      });
    }
  };

  return (
    <div className="p-6 text-center">
      {/* Ícone de sucesso */}
      <div className="flex justify-center mb-6">
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center">
          <CheckCircle className="text-green-600" size={48} />
        </div>
      </div>

      {/* Título e mensagem */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-3">
          Reserva Confirmada!
        </h2>
        <p className="text-gray-600 text-lg">
          Parabéns! Sua viagem foi reservada com sucesso.
        </p>
      </div>

      {/* ID da reserva */}
      <div className="bg-[#F28C38] bg-opacity-10 border border-[#F28C38] rounded-xl p-4 mb-8">
        <div className="text-sm text-gray-600 mb-1">Número da Reserva</div>
        <div className="text-2xl font-bold text-[#F28C38]">{bookingId}</div>
        <div className="text-sm text-gray-600 mt-1">
          Guarde este número para acompanhar sua reserva
        </div>
      </div>

      {/* Detalhes da reserva */}
      <div className="bg-gray-50 rounded-xl p-6 mb-8 text-left">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Detalhes da Reserva</h3>
        
        {/* Pacote */}
        <div className="flex items-start gap-4 mb-6 p-4 bg-white rounded-lg">
          <img 
            src={pacote.imagem} 
            alt={pacote.nome}
            className="w-20 h-20 object-cover rounded-lg"
          />
          <div className="flex-1">
            <h4 className="font-semibold text-gray-800 text-lg">{pacote.nome}</h4>
            <div className="flex items-center gap-2 text-gray-600 mb-2">
              <MapPin size={16} />
              <span>{pacote.destino}</span>
            </div>
            <div className="text-[#F28C38] font-bold text-xl">
              R$ {paymentData.total?.toLocaleString('pt-BR')}
            </div>
          </div>
        </div>

        {/* Informações da viagem */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="flex items-center gap-3">
            <Calendar className="text-[#F28C38]" size={20} />
            <div>
              <div className="text-sm text-gray-600">Data da Viagem</div>
              <div className="font-semibold">
                {new Date(travelerData.dataViagem).toLocaleDateString('pt-BR')}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Users className="text-[#F28C38]" size={20} />
            <div>
              <div className="text-sm text-gray-600">Viajantes</div>
              <div className="font-semibold">
                {travelerData.numeroViajantes} {travelerData.numeroViajantes === 1 ? 'pessoa' : 'pessoas'}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <CreditCard className="text-[#F28C38]" size={20} />
            <div>
              <div className="text-sm text-gray-600">Forma de Pagamento</div>
              <div className="font-semibold">{formatPaymentMethod(paymentData.method)}</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Mail className="text-[#F28C38]" size={20} />
            <div>
              <div className="text-sm text-gray-600">E-mail</div>
              <div className="font-semibold">{travelerData.email}</div>
            </div>
          </div>
        </div>

        {/* Dados do viajante */}
        <div className="border-t pt-4">
          <h4 className="font-semibold text-gray-800 mb-3">Viajante Principal</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div>
              <span className="text-gray-600">Nome: </span>
              <span className="font-medium">{travelerData.nome}</span>
            </div>
            <div>
              <span className="text-gray-600">CPF: </span>
              <span className="font-medium">{travelerData.cpf}</span>
            </div>
            <div>
              <span className="text-gray-600">Telefone: </span>
              <span className="font-medium">{travelerData.telefone}</span>
            </div>
            <div>
              <span className="text-gray-600">Cidade: </span>
              <span className="font-medium">{travelerData.cidade}, {travelerData.estado}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Instruções específicas por método de pagamento */}
      {paymentData.method === 'pix' && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
          <h4 className="font-semibold text-green-800 mb-2">Próximos Passos - PIX</h4>
          <p className="text-green-700 text-sm">
            O código PIX foi enviado para seu e-mail. Complete o pagamento em até 30 minutos 
            para garantir sua reserva.
          </p>
        </div>
      )}

      {paymentData.method === 'boleto' && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
          <h4 className="font-semibold text-blue-800 mb-2">Próximos Passos - Boleto</h4>
          <p className="text-blue-700 text-sm">
            O boleto foi enviado para seu e-mail. Prazo de pagamento: 3 dias úteis.
            Após o pagamento, sua reserva será confirmada automaticamente.
          </p>
        </div>
      )}

      {(paymentData.method === 'credit' || paymentData.method === 'debit') && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
          <h4 className="font-semibold text-green-800 mb-2">Pagamento Aprovado</h4>
          <p className="text-green-700 text-sm">
            Seu pagamento foi processado com sucesso. Você receberá a confirmação 
            e voucher de viagem em seu e-mail em alguns minutos.
          </p>
        </div>
      )}

      {/* Ações */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <button
          onClick={handleDownloadVoucher}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-[#F28C38] text-white rounded-xl hover:bg-orange-600 transition-all duration-300 font-semibold cursor-pointer"
        >
          <Download size={20} />
          Baixar Voucher
        </button>
        
        <button
          onClick={handleShareBooking}
          className="flex items-center justify-center gap-2 px-6 py-3 border-2 border-[#F28C38] text-[#F28C38] rounded-xl hover:bg-orange-50 transition-all duration-300 font-semibold cursor-pointer"
        >
          <Share2 size={20} />
          Compartilhar
        </button>
      </div>

      {/* Informações importantes */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-8">
        <h4 className="font-semibold text-yellow-800 mb-2">Informações Importantes</h4>
        <ul className="text-yellow-700 text-sm text-left space-y-1">
          <li>• Mantenha seu voucher sempre à mão durante a viagem</li>
          <li>• Documentos de identidade são obrigatórios</li>
          <li>• Chegue ao local de embarque com 30 minutos de antecedência</li>
          <li>• Em caso de dúvidas, entre em contato conosco</li>
        </ul>
      </div>

      {/* Contato */}
      <div className="text-center text-gray-600 mb-8">
        <p className="mb-2">Alguma dúvida? Estamos aqui para ajudar!</p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <div className="flex items-center justify-center gap-2">
            <Phone size={16} />
            <span>(11) 9999-9999</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <Mail size={16} />
            <span>contato@decolatour.com</span>
          </div>
        </div>
      </div>

      {/* Botão de fechar */}
      <button
        onClick={onClose}
        className="w-full px-8 py-4 bg-gray-800 text-white rounded-xl hover:bg-gray-700 transition-all duration-300 font-semibold text-lg cursor-pointer"
      >
        Finalizar
      </button>

      {/* Mensagem de agradecimento */}
      <div className="mt-6 p-4 bg-gradient-to-r from-[#F28C38] to-orange-500 rounded-xl text-white">
        <p className="font-semibold text-lg">Obrigado por escolher a Decola Tour!</p>
        <p className="text-sm opacity-90">Desejamos uma excelente viagem! ✈️</p>
      </div>
    </div>
  );
};

export default ConfirmationStep;
