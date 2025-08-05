import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Calendar,
  MapPin,
  Users,
  CreditCard,
  Clock,
  Package,
  CheckCircle,
  XCircle,
  AlertCircle,
  Eye,
  Settings,
  MessageCircle,
} from "lucide-react";

const ReservaCard = ({ reserva, index }) => {
  const navigate = useNavigate();

  const handleVerDetalhes = () => {
    navigate(`/reserva-detalhes/${reserva.id}`, { 
      state: { reserva } 
    });
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "confirmada":
        return <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-500" />;
      case "pendente":
        return <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-500" />;
      case "cancelada":
        return <XCircle className="w-3 h-3 sm:w-4 sm:h-4 text-red-500" />;
      default:
        return <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500" />;
    }
  };

  const getStatusBadgeClasses = (status) => {
    switch (status) {
      case "confirmada":
        return "bg-gradient-to-r from-green-100 to-green-200 text-green-800 border border-green-300";
      case "pendente":
        return "bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800 border border-yellow-300";
      case "cancelada":
        return "bg-gradient-to-r from-red-100 to-red-200 text-red-800 border border-red-300";
      default:
        return "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 border border-gray-300";
    }
  };

  const formatarStatus = (status) => {
    switch (status) {
      case "confirmada":
        return "Confirmada";
      case "pendente":
        return "Pendente";
      case "cancelada":
        return "Cancelada";
      default:
        return "Desconhecido";
    }
  };

  const formatarData = (data) => {
    if (!data) return "N/A";
    if (data.includes("/")) return data;
    try {
      const date = new Date(data);
      return date.toLocaleDateString("pt-BR");
    } catch {
      return data;
    }
  };

  const formatarPreco = (valor) => {
    if (!valor) return "R$ 0,00";
    const numero = typeof valor === "number" ? valor : parseFloat(valor);
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(numero);
  };

  const formatarStatusPagamento = (status) => {
    switch (status) {
      case "pago":
        return "Pago";
      case "pendente":
        return "Pendente";
      case "reembolsado":
        return "Reembolsado";
      default:
        return "N/A";
    }
  };

  return (
    <div
      className="bg-white/90 backdrop-blur-sm border border-white/30 rounded-xl sm:rounded-2xl overflow-hidden hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 shadow-lg mx-2 sm:mx-0"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4 sm:mb-6 gap-4">
          <div className="flex items-start gap-3 sm:gap-4 flex-1">
            <div className="p-2 sm:p-3 bg-blue-600 rounded-xl sm:rounded-2xl shadow-lg flex-shrink-0">
              <MapPin className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 mb-1 leading-tight">
                {reserva.pacote}
              </h3>
              <div className="flex items-center gap-1 sm:gap-2 text-gray-600 text-sm sm:text-base lg:text-lg mb-2">
                <span>📍 {reserva.destino}</span>
              </div>
              <p className="text-xs sm:text-sm text-gray-500">
                Código:{" "}
                <span className="font-mono bg-gray-100 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded text-xs">
                  {reserva.codigo}
                </span>
              </p>
            </div>
          </div>

          {/* Status */}
          <div className="flex flex-col items-end gap-2 sm:gap-3">
            <div
              className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium shadow-lg ${getStatusBadgeClasses(
                reserva.status
              )}`}
            >
              {getStatusIcon(reserva.status)}
              <span>{formatarStatus(reserva.status)}</span>
            </div>
            <div className="text-right">
              <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-blue-600">
                {formatarPreco(reserva.valorTotal || reserva.valor)}
              </p>
              <p className="text-xs sm:text-sm text-gray-500">valor total</p>
            </div>
          </div>
        </div>

        {/* Detalhes da Reserva */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6 mb-4 sm:mb-6">
          <div className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-blue-50 rounded-lg sm:rounded-xl border border-blue-200/50">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-600 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
              <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <div className="min-w-0">
              <p className="text-blue-600 font-medium text-xs sm:text-sm">Data da Viagem</p>
              <p className="font-bold text-gray-800 text-sm sm:text-base truncate">
                {formatarData(reserva.dataViagem)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-green-50 rounded-lg sm:rounded-xl border border-green-200/50">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-600 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
              <Users className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <div className="min-w-0">
              <p className="text-green-600 font-medium text-xs sm:text-sm">Pessoas</p>
              <p className="font-bold text-gray-800 text-sm sm:text-base">
                {reserva.quantidadePessoas || reserva.pessoas} pessoa
                {(reserva.quantidadePessoas || reserva.pessoas) > 1 ? "s" : ""}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-orange-50 rounded-lg sm:rounded-xl border border-orange-200/50 sm:col-span-2 lg:col-span-1">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-orange-500 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
              <CreditCard className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <div className="min-w-0">
              <p className="text-orange-500 font-medium text-xs sm:text-sm">Pagamento</p>
              <p className="font-bold text-gray-800 text-sm sm:text-base">
                {formatarStatusPagamento(
                  reserva.statusPagamento || reserva.pagamento
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Informações Adicionais */}
        <div className="bg-gray-50 rounded-lg sm:rounded-xl p-3 sm:p-4 mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0 text-xs sm:text-sm">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500 flex-shrink-0" />
              <span className="text-gray-600">
                Reservado em:{" "}
                <span className="font-medium">
                  {formatarData(reserva.dataReserva)}
                </span>
              </span>
            </div>
            {reserva.categoria && (
              <div className="flex items-center gap-1.5 sm:gap-2">
                <Package className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500 flex-shrink-0" />
                <span className="text-gray-600">
                  Categoria:{" "}
                  <span className="font-medium capitalize">
                    {reserva.categoria}
                  </span>
                </span>
              </div>
            )}
          </div>
        </div>

        {reserva.observacoes && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg sm:rounded-xl p-3 sm:p-4 mb-4 sm:mb-6">
            <div className="flex items-start gap-2 sm:gap-3">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-yellow-500 rounded-md sm:rounded-lg flex items-center justify-center flex-shrink-0">
                <MessageCircle className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
              </div>
              <div className="min-w-0">
                <p className="font-medium text-yellow-800 mb-1 text-sm sm:text-base">Observações</p>
                <p className="text-yellow-700 text-xs sm:text-sm leading-relaxed">{reserva.observacoes}</p>
              </div>
            </div>
          </div>
        )}

        {/* Botões de Ação */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <button 
            onClick={handleVerDetalhes}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 sm:py-4 px-4 sm:px-6 rounded-lg sm:rounded-xl text-sm sm:text-base font-medium transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 cursor-pointer"
          >
            <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
            Ver Detalhes
          </button>
          {reserva.status === "confirmada" && (
            <button className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-3 sm:py-4 px-4 sm:px-6 rounded-lg sm:rounded-xl text-sm sm:text-base font-medium transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 cursor-pointer">
              <Settings className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden sm:inline">Gerenciar</span>
              <span className="sm:hidden">Gerenciar</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReservaCard;
