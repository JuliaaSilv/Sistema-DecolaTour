import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle, Calendar, MapPin, Users, CreditCard, Mail, Phone, Download, Share2, Home } from 'lucide-react';

const BookingConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const { travelerData, paymentData, pacote, reservaId } = location.state || {};
  
  // Usar o ID da reserva real se disponível, senão gerar um código temporal
  const bookingId = reservaId ? (reservaId + 100000) : `DCT${Date.now().toString().slice(-6)}`;
  
  const formatPaymentMethod = (method) => {
    const methods = {
      credito: 'Cartão de Crédito',
      debito: 'Cartão de Débito',
      credit: 'Cartão de Crédito',
      debit: 'Cartão de Débito',
      pix: 'PIX',
      boleto: 'Boleto Bancário'
    };
    return methods[method] || method;
  };

  const handleDownloadVoucher = () => {
    console.log('Baixando voucher...');
  };

  const handleShareBooking = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Minha Reserva - Decola Tour',
        text: `Reserva confirmada para ${pacote?.titulo}! ID: ${bookingId}`,
        url: window.location.href
      });
    }
  };

  const handleGoHome = () => {
    navigate('/');
  };

  if (!travelerData || !paymentData || !pacote) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Dados da reserva não encontrados</h2>
          <button 
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-[#F28C38] text-white rounded-xl cursor-pointer hover:bg-orange-600 transition-colors"
          >
            Voltar ao Início
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="text-green-500" size={40} />
          </div>
          <h1 className="text-3xl font-bold mb-2">Reserva Confirmada!</h1>
          <p className="text-green-100 text-lg mb-1">Parabéns! Sua viagem foi reservada com sucesso.</p>
          <p className="text-green-200 text-sm">Etapa 3 de 3 - Confirmação e Envio por Email</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6">
        {/* ID da reserva */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8 text-center">
          <div className="bg-[#F28C38] bg-opacity-10 border border-[#F28C38] rounded-xl p-6">
            <div className="text-sm text-gray-600 mb-1">Número da Reserva</div>
            <div className="text-3xl font-bold text-gray-800 mb-2">{bookingId}</div>
            <div className="text-sm text-gray-600">
              Guarde este número para acompanhar sua reserva
            </div>
          </div>
        </div>

        {/* Confirmação de envio de email */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
          <div className="flex items-center gap-3 mb-3">
            <Mail className="text-blue-600" size={24} />
            <h3 className="font-semibold text-blue-800 text-lg">Email de Confirmação Enviado</h3>
          </div>
          <p className="text-blue-700 mb-2">
            Enviamos todos os detalhes da sua reserva para <strong>{travelerData.email}</strong>
          </p>
          <div className="text-blue-600 text-sm">
            ✓ Voucher de viagem<br />
            ✓ Detalhes do pagamento<br />
            ✓ Informações de contato<br />
            ✓ Instruções importantes
          </div>
        </div>

        {/* Detalhes da reserva */}
        <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            Detalhes da Reserva - {pacote.titulo}{pacote.destino ? `, ${pacote.destino}` : ''}
          </h2>
          
          {/* Pacote */}
          <div className="flex items-start gap-6 mb-8 p-6 bg-gray-50 rounded-xl">
            <img 
              src={
                pacote.imagens && pacote.imagens.length > 0
                  ? `http://localhost:5295${pacote.imagens[0].url}`
                  : '/default-package.jpg'
              } 
              alt={pacote.titulo}
              className="w-24 h-24 object-cover rounded-lg"
            />
            <div className="flex-1">
              <h3 className="font-semibold text-gray-800 text-xl mb-2">{pacote.titulo}</h3>
              <div className="flex items-center gap-2 text-gray-600 mb-3">
                <MapPin size={18} />
                <span>{`${pacote.titulo}, ${pacote.destino}`}</span>
              </div>
              <div className="text-[#F28C38] font-bold text-2xl">
                R$ {(paymentData.total && !isNaN(paymentData.total)) ? paymentData.total.toLocaleString('pt-BR') : '0,00'}
              </div>
            </div>
          </div>

          {/* Informações da viagem */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-xl">
              <Calendar className="text-[#F28C38]" size={24} />
              <div>
                <div className="text-sm text-gray-600">Data da Viagem</div>
                <div className="font-semibold text-lg">
                  {new Date(travelerData.dataViagem).toLocaleDateString('pt-BR')}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-xl">
              <Users className="text-[#F28C38]" size={24} />
              <div>
                <div className="text-sm text-gray-600">Viajantes</div>
                <div className="font-semibold text-lg">
                  {travelerData.numeroViajantes} {travelerData.numeroViajantes === 1 ? 'pessoa' : 'pessoas'}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-xl">
              <CreditCard className="text-[#F28C38]" size={24} />
              <div>
                <div className="text-sm text-gray-600">Forma de Pagamento</div>
                <div className="font-semibold text-lg">{formatPaymentMethod(paymentData.method)}</div>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-xl">
              <Mail className="text-[#F28C38]" size={24} />
              <div>
                <div className="text-sm text-gray-600">E-mail</div>
                <div className="font-semibold text-lg">{travelerData.email}</div>
              </div>
            </div>
          </div>

          {/* Dados do viajante */}
          <div className="border-t pt-6">
            <h3 className="font-semibold text-gray-800 mb-4 text-lg">Viajante Principal</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-6 rounded-xl">
              <div>
                <span className="text-gray-600 text-sm">Nome: </span>
                <span className="font-medium">{travelerData.nome}</span>
              </div>
              <div>
                <span className="text-gray-600 text-sm">CPF: </span>
                <span className="font-medium">{travelerData.cpf}</span>
              </div>
              <div>
                <span className="text-gray-600 text-sm">Telefone: </span>
                <span className="font-medium">{travelerData.telefone}</span>
              </div>
              <div>
                <span className="text-gray-600 text-sm">Cidade: </span>
                <span className="font-medium">{travelerData.cidade}, {travelerData.estado}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Instruções específicas por método de pagamento */}
        {paymentData.method === 'pix' && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-8">
            <h3 className="font-semibold text-green-800 mb-3 text-lg">Próximos Passos - PIX</h3>
            <p className="text-green-700">
              O código PIX foi enviado para seu e-mail. Complete o pagamento em até 30 minutos 
              para garantir sua reserva.
            </p>
          </div>
        )}

        {paymentData.method === 'boleto' && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
            <h3 className="font-semibold text-blue-800 mb-3 text-lg">Próximos Passos - Boleto</h3>
            <p className="text-blue-700">
              O boleto foi enviado para seu e-mail. Prazo de pagamento: 3 dias úteis.
              Após o pagamento, sua reserva será confirmada automaticamente.
            </p>
          </div>
        )}

        {(paymentData.method === 'credito' || paymentData.method === 'credit' || paymentData.method === 'debito' || paymentData.method === 'debit') && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-8">
            <h3 className="font-semibold text-green-800 mb-3 text-lg">Pagamento Aprovado</h3>
            <p className="text-green-700">
              Seu pagamento foi processado com sucesso. Você receberá a confirmação 
              e voucher de viagem em seu e-mail em alguns minutos.
            </p>
          </div>
        )}

        {/* Ações */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <button
            onClick={handleDownloadVoucher}
            className="flex items-center justify-center gap-2 px-6 py-4 bg-[#F28C38] text-white rounded-xl hover:bg-orange-600 transition-all duration-300 font-semibold cursor-pointer"
          >
            <Download size={20} />
            Baixar Voucher
          </button>
          
          <button
            onClick={handleShareBooking}
            className="flex items-center justify-center gap-2 px-6 py-4 border-2 border-[#F28C38] text-[#F28C38] rounded-xl hover:bg-orange-50 transition-all duration-300 font-semibold cursor-pointer"
          >
            <Share2 size={20} />
            Compartilhar
          </button>

          <button
            onClick={handleGoHome}
            className="flex items-center justify-center gap-2 px-6 py-4 bg-gray-800 text-white rounded-xl hover:bg-gray-700 transition-all duration-300 font-semibold cursor-pointer"
          >
            <Home size={20} />
            Voltar ao Início
          </button>
        </div>

        {/* Informações importantes */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mb-8">
          <h3 className="font-semibold text-yellow-800 mb-3 text-lg">Informações Importantes</h3>
          <ul className="text-yellow-700 space-y-2">
            <li>• Mantenha seu voucher sempre à mão durante a viagem</li>
            <li>• Documentos de identidade são obrigatórios</li>
            <li>• Chegue ao local de embarque com 30 minutos de antecedência</li>
            <li>• Em caso de dúvidas, entre em contato conosco</li>
          </ul>
        </div>

        {/* Contato */}
        <div className="text-center text-gray-600 mb-8">
          <p className="mb-4 text-lg">Alguma dúvida? Estamos aqui para ajudar!</p>
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <div className="flex items-center justify-center gap-2">
              <Phone size={18} />
              <span>(11) 9999-9999</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Mail size={18} />
              <span>contato@decolatour.com</span>
            </div>
          </div>
        </div>

        {/* Mensagem de agradecimento */}
        <div className="bg-gradient-to-r from-[#F28C38] to-orange-500 rounded-xl p-8 text-white text-center">
          <h3 className="text-2xl font-semibold mb-3">Obrigado por escolher a Decola Tour!</h3>
          <p className="text-lg opacity-90">Desejamos uma excelente viagem!</p>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmation;
