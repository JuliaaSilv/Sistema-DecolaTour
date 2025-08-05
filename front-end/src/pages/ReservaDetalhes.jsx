import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Users,
  CreditCard,
  Phone,
  Mail,
  FileText,
  Package,
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle,
  User,
  IdCard,
  Plane,
  Hotel,
  Camera,
  Download,
  Share2,
} from "lucide-react";
import { fetchMinhaReservaPorId, fetchViajantesReserva, fetchPacoteDetalhes, fetchPagamentosReserva } from "../api/reservas";
import { estaLogado } from "../api/auth";

const ReservaDetalhes = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  
  const [reserva, setReserva] = useState(location.state?.reserva || null);
  const [viajantes, setViajantes] = useState([]);
  const [pacoteDetalhes, setPacoteDetalhes] = useState(null);
  const [pagamentos, setPagamentos] = useState([]);
  const [loading, setLoading] = useState(!reserva);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!estaLogado()) {
      navigate('/login');
      return;
    }

    if (!reserva && id) {
      carregarDadosCompletos();
    } else if (reserva) {
      carregarDadosAdicionais();
    }
  }, [id, reserva]);

  const carregarDadosCompletos = async () => {
    try {
      setLoading(true);
      
      // Carregar reserva
      const resultadoReserva = await fetchMinhaReservaPorId(id);
      
      if (resultadoReserva.sucesso) {
        const reservaData = resultadoReserva.dados;
        setReserva(reservaData);
        
        // Carregar dados adicionais
        await carregarDadosAdicionais(reservaData);
      } else {
        setError(resultadoReserva.erro || 'Reserva não encontrada');
      }
    } catch (error) {
      console.error('Erro ao carregar reserva:', error);
      setError('Erro ao carregar detalhes da reserva');
    } finally {
      setLoading(false);
    }
  };

  const carregarDadosAdicionais = async (reservaData = reserva) => {
    if (!reservaData) return;

    try {
      // Carregar viajantes da reserva
      try {
        const resultadoViajantes = await fetchViajantesReserva(reservaData.id);
        if (resultadoViajantes.sucesso) {
          setViajantes(resultadoViajantes.dados);
        }
      } catch (error) {
        console.warn('Erro ao carregar viajantes:', error);
      }

      // Carregar detalhes do pacote se tiver pacoteId
      if (reservaData.pacoteId) {
        try {
          const resultadoPacote = await fetchPacoteDetalhes(reservaData.pacoteId);
          if (resultadoPacote.sucesso) {
            setPacoteDetalhes(resultadoPacote.dados);
          }
        } catch (error) {
          console.warn('Erro ao carregar pacote:', error);
        }
      }

      // Carregar dados de pagamento com tratamento de erro específico
      try {
        const resultadoPagamentos = await fetchPagamentosReserva(reservaData.id);
        if (resultadoPagamentos.sucesso) {
          setPagamentos(resultadoPagamentos.dados);
        }
      } catch (error) {
        console.warn('Erro ao carregar pagamentos (pode ser problema de autorização):', error);
        // Continuar sem os dados de pagamento se houver erro 403
      }
      
    } catch (error) {
      console.error('Erro ao carregar dados adicionais:', error);
    }
  };

  // Função para calcular data de volta (exemplo: 7 dias após data de ida)
  const calcularDataVolta = (dataIda, duracaoDias = 7) => {
    if (!dataIda) return null;
    
    const dataIdaObj = new Date(dataIda);
    const dataVolta = new Date(dataIdaObj);
    dataVolta.setDate(dataIdaObj.getDate() + duracaoDias);
    
    return dataVolta;
  };

  const formatarData = (data) => {
    if (!data) return 'Não informado';
    
    try {
      return new Date(data).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit', 
        year: 'numeric'
      });
    } catch (error) {
      return 'Data inválida';
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "confirmada":
      case "confirmed":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "pendente":
      case "pending":
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case "cancelada":
      case "cancelled":
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusText = (status) => {
    switch (status?.toLowerCase()) {
      case "confirmada":
      case "confirmed":
        return "Confirmada";
      case "pendente":
      case "pending":
        return "Pendente";
      case "cancelada":
      case "cancelled":
        return "Cancelada";
      default:
        return status || "Indefinido";
    }
  };

  const formatarValor = (valor) => {
    if (!valor && valor !== 0) return 'R$ 0,00';
    
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  };

  const handleVoltar = () => {
    navigate('/minhas-reservas');
  };

  const handleCompartilhar = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Reserva ${reserva.id} - DecolaTour`,
          text: `Confira os detalhes da minha viagem para ${pacoteDetalhes?.titulo || 'destino incrível'}!`,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Erro ao compartilhar:', error);
      }
    } else {
      // Copia o link para a área de transferência silenciosamente
      navigator.clipboard.writeText(window.location.href);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando detalhes da reserva...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center bg-white rounded-lg p-8 shadow-lg max-w-md mx-4">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-800 mb-2">Erro ao carregar reserva</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={handleVoltar}
            className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Voltar para Minhas Reservas
          </button>
        </div>
      </div>
    );
  }

  if (!reserva) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center bg-white rounded-lg p-8 shadow-lg max-w-md mx-4">
          <AlertCircle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-800 mb-2">Reserva não encontrada</h2>
          <p className="text-gray-600 mb-6">Não foi possível encontrar os detalhes desta reserva.</p>
          <button
            onClick={handleVoltar}
            className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Voltar para Minhas Reservas
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={handleVoltar}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Voltar</span>
          </button>
          
          <div className="flex items-center gap-3">
            <button
              onClick={handleCompartilhar}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Share2 className="w-4 h-4" />
              <span className="hidden sm:inline">Compartilhar</span>
            </button>
          </div>
        </div>

        {/* Título e Status */}
        <div className="bg-white/80 backdrop-blur-sm border border-white/30 rounded-2xl p-6 shadow-lg mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
                Reserva #{reserva.id}
              </h1>
              <p className="text-gray-600">
                {pacoteDetalhes?.titulo || reserva.tituloPacote || 'Pacote de Viagem'}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                {pacoteDetalhes?.destino || 'Destino não informado'}
              </p>
            </div>
            
            <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-lg">
              {getStatusIcon(reserva.status)}
              <span className="font-medium text-gray-700">
                {getStatusText(reserva.status)}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Coluna Esquerda */}
          <div className="space-y-6">
            {/* Informações da Reserva e Pacote */}
            <div className="bg-white/80 backdrop-blur-sm border border-white/30 rounded-2xl p-6 shadow-lg">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Package className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-800">
                  Detalhes da Reserva e Pacote
                </h3>
              </div>

              <div className="space-y-6">
                {/* Imagem do pacote se disponível */}
                {pacoteDetalhes?.imagens && pacoteDetalhes.imagens.length > 0 && (
                  <div className="rounded-lg overflow-hidden">
                    <img
                      src={`http://localhost:5295${pacoteDetalhes.imagens[0].url}`}
                      alt={pacoteDetalhes.titulo}
                      className="w-full h-48 object-cover"
                    />
                  </div>
                )}
                
                {/* Título e descrição do pacote */}
                <div>
                  <h4 className="font-bold text-gray-800 text-lg mb-2">
                    {pacoteDetalhes?.titulo || reserva.tituloPacote || 'Pacote de Viagem'}
                  </h4>
                  {pacoteDetalhes?.descricao && (
                    <p className="text-gray-600 mb-4">
                      {pacoteDetalhes.descricao}
                    </p>
                  )}
                </div>

                {/* Informações do pacote */}
                <div>
                  <h5 className="font-medium text-gray-800 mb-3 flex items-center gap-2">
                    <Package className="w-4 h-4" />
                    Informações do Pacote
                  </h5>
                  <div className="grid grid-cols-1 gap-3">
                    {/* Destino */}
                    <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
                      <MapPin className="w-4 h-4 text-blue-600" />
                      <span className="text-sm text-gray-700">
                        <strong>Destino:</strong> {pacoteDetalhes?.destino || reserva.destino || 'Destino não informado'}
                      </span>
                    </div>
                    
                    {/* Origem */}
                    {(pacoteDetalhes?.origem || reserva.origem) && (
                      <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
                        <Plane className="w-4 h-4 text-green-600" />
                        <span className="text-sm text-gray-700">
                          <strong>Origem:</strong> {pacoteDetalhes?.origem || reserva.origem}
                        </span>
                      </div>
                    )}
                    
                    {/* Duração */}
                    <div className="flex items-center gap-2 p-3 bg-purple-50 rounded-lg">
                      <Clock className="w-4 h-4 text-purple-600" />
                      <span className="text-sm text-gray-700">
                        <strong>Duração:</strong> {pacoteDetalhes?.duracaoDias || reserva.duracaoDias || 7} dias
                      </span>
                    </div>
                    
                    {/* Preço por pessoa */}
                    <div className="flex items-center gap-2 p-3 bg-yellow-50 rounded-lg">
                      <CreditCard className="w-4 h-4 text-yellow-600" />
                      <span className="text-sm text-gray-700">
                        <strong>Preço por pessoa:</strong> {formatarValor(
                          pacoteDetalhes?.preco || 
                          pacoteDetalhes?.valor || 
                          reserva.valorUnitario ||
                          (reserva.valorTotal && viajantes?.length ? reserva.valorTotal / viajantes.length : 0)
                        )}
                      </span>
                    </div>
                    
                    {/* Capacidade máxima */}
                    {(pacoteDetalhes?.quantidadeMaximaPessoas || reserva.quantidadeMaxima) && (
                      <div className="flex items-center gap-2 p-3 bg-indigo-50 rounded-lg">
                        <Users className="w-4 h-4 text-indigo-600" />
                        <span className="text-sm text-gray-700">
                          <strong>Capacidade máxima:</strong> {pacoteDetalhes?.quantidadeMaximaPessoas || reserva.quantidadeMaxima} pessoas
                        </span>
                      </div>
                    )}

                    {/* ID do Pacote */}
                    {reserva.pacoteId && (
                      <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                        <Package className="w-4 h-4 text-gray-600" />
                        <span className="text-sm text-gray-700">
                          <strong>ID do Pacote:</strong> {reserva.pacoteId}
                        </span>
                      </div>
                    )}

                    {pacoteDetalhes?.promocao && (
                      <div className="flex items-center gap-2 p-3 bg-red-50 rounded-lg">
                        <CreditCard className="w-4 h-4 text-red-600" />
                        <span className="text-sm text-gray-700">
                          <strong>Promoção:</strong> {pacoteDetalhes.promocao}%
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Informações da reserva */}
                <div>
                  <h5 className="font-medium text-gray-800 mb-3 flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Informações da Reserva
                  </h5>
                  <div className="space-y-3">
                    {/* Data da Reserva */}
                    <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-700">
                        <strong>Data da Reserva:</strong> {formatarData(reserva.dataReserva)}
                      </span>
                    </div>

                    {/* Datas da viagem */}
                    {reserva.dataViagem && (
                      <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-3">
                          <Plane className="w-4 h-4 text-blue-600" />
                          <span className="font-medium text-gray-700">Datas da Viagem</span>
                        </div>
                        
                        <div className="space-y-2">
                          {/* Data de Ida */}
                          <div className="flex items-center justify-between p-2 bg-white rounded border">
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                              <span className="text-sm font-medium text-gray-700">Data de Ida</span>
                            </div>
                            <span className="text-sm text-gray-600">
                              {formatarData(reserva.dataViagem)}
                            </span>
                          </div>
                          
                          {/* Data de Volta */}
                          <div className="flex items-center justify-between p-2 bg-white rounded border">
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                              <span className="text-sm font-medium text-gray-700">Data de Volta</span>
                            </div>
                            <span className="text-sm text-gray-600">
                              {formatarData(calcularDataVolta(reserva.dataViagem, pacoteDetalhes?.duracaoDias || 7))}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Informações dos Viajantes */}
            <div className="bg-white/80 backdrop-blur-sm border border-white/30 rounded-2xl p-6 shadow-lg">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-800">
                  Informações dos Viajantes
                </h3>
              </div>
              
              <div className="space-y-4">
                {viajantes && viajantes.length > 0 ? (
                  viajantes.map((viajante, index) => (
                    <div key={viajante.id || index} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-800">
                            {viajante.nome || `Viajante ${index + 1}`}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {index === 0 ? 'Viajante Principal' : `Viajante ${index + 1}`}
                          </p>
                        </div>
                      </div>
                      
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>
                      {loading ? 'Carregando informações dos viajantes...' : 'Nenhum viajante cadastrado para esta reserva'}
                    </p>
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* Coluna Direita */}
          <div className="space-y-6">

            {/* Resumo Financeiro */}
            <div className="bg-white/80 backdrop-blur-sm border border-white/30 rounded-2xl p-6 shadow-lg">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CreditCard className="w-5 h-5 text-green-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-800">
                  Resumo Financeiro
                </h3>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600">Status da reserva:</span>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(reserva.status)}
                    <span className="font-medium text-gray-800">
                      {getStatusText(reserva.status)}
                    </span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600">Quantidade de viajantes:</span>
                  <span className="font-medium text-gray-800">
                    {viajantes?.length || reserva.quantidadeViajantes || 1}
                  </span>
                </div>
                
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600">Valor por pessoa:</span>
                  <span className="font-medium text-gray-800">
                    {formatarValor(
                      pacoteDetalhes?.preco || 
                      pacoteDetalhes?.valor || 
                      reserva.valorUnitario || 
                      (reserva.valorTotal && viajantes?.length ? reserva.valorTotal / viajantes.length : 0)
                    )}
                  </span>
                </div>
                
                <div className="border-t pt-3 mt-3">
                  <div className="flex justify-between items-center py-3 bg-blue-50 rounded-lg px-3">
                    <span className="font-medium text-blue-800">Valor total:</span>
                    <span className="text-xl font-bold text-blue-800">
                      {formatarValor(
                        reserva.valorTotal || 
                        (pacoteDetalhes?.preco || pacoteDetalhes?.valor || reserva.valorUnitario || 0) * (viajantes?.length || reserva.quantidadeViajantes || 1)
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Informações de Contato */}
            <div className="bg-white/80 backdrop-blur-sm border border-white/30 rounded-2xl p-6 shadow-lg">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Phone className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-800">
                  Precisa de Ajuda?
                </h3>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Phone className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="font-medium text-gray-800">Central de Atendimento</p>
                    <p className="text-sm text-gray-600">(11) 9999-9999</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Mail className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="font-medium text-gray-800">Suporte</p>
                    <p className="text-sm text-gray-600">suporte@decolatour.com</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReservaDetalhes;
