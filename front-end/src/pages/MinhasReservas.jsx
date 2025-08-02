// Arquivo: pages/MinhasReservas.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Package, RefreshCw } from "lucide-react";
import { fetchMinhasReservas, normalizeMinhaReservaData } from "../api/reservas";
import { estaLogado, obterIdUsuario } from "../api/auth";
import ToastContainer from "../components/ui/ToastContainer";
import useToast from "../hooks/useToast";
import FiltroReservas from "../components/minhas-reservas/FiltroReservas";
import ReservaCard from "../components/minhas-reservas/ReservaCard";

const MinhasReservas = () => {
  const navigate = useNavigate();
  const { toasts, showSuccess, showError, removeToast } = useToast();
  const [reservas, setReservas] = useState([]);
  const [reservasFiltradas, setReservasFiltradas] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filtroStatus, setFiltroStatus] = useState("todas");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    carregarReservas();
  }, []);

  useEffect(() => {
    aplicarFiltros();
  }, [reservas, filtroStatus, searchTerm]);

  const carregarReservas = async () => {
    if (!estaLogado()) {
      showError("Você precisa estar logado para visualizar suas reservas");
      return;
    }

    setIsLoading(true);
    try {
      // Dados estáticos para demonstração
      const reservasEstaticas = [
        {
          id: 1,
          codigo: "RES-000001",
          cliente: "Você",
          email: "usuario@exemplo.com",
          pacote: "Maceió + Maragogi - Paraíso Nordestino",
          destino: "Maceió e Maragogi, Alagoas",
          dataViagem: "15/12/2024",
          dataReserva: "02/08/2024",
          valorTotal: 2554.00,
          valor: 2554.00,
          status: "confirmada",
          quantidadePessoas: 2,
          pessoas: 2,
          statusPagamento: "pago",
          pagamento: "pago",
          categoria: "praia",
          imagemUrl: "/images/maceio.jpg"
        },
        {
          id: 2,
          codigo: "RES-000002",
          cliente: "Você",
          email: "usuario@exemplo.com",
          pacote: "Cancún All Inclusive - México",
          destino: "Cancún, México",
          dataViagem: "20/01/2025",
          dataReserva: "28/07/2024",
          valorTotal: 4200.00,
          valor: 4200.00,
          status: "pendente",
          quantidadePessoas: 4,
          pessoas: 4,
          statusPagamento: "pendente",
          pagamento: "pendente",
          categoria: "internacional",
          imagemUrl: "/images/cancun.jpg"
        },
        {
          id: 3,
          codigo: "RES-000003",
          cliente: "Você",
          email: "usuario@exemplo.com",
          pacote: "Rio de Janeiro Cultural - Cristo e Pão de Açúcar",
          destino: "Rio de Janeiro, RJ",
          dataViagem: "10/03/2025",
          dataReserva: "25/07/2024",
          valorTotal: 1800.00,
          valor: 1800.00,
          status: "confirmada",
          quantidadePessoas: 1,
          pessoas: 1,
          statusPagamento: "pago",
          pagamento: "pago",
          categoria: "cidade",
          imagemUrl: "/images/rio.jpg"
        },
        {
          id: 4,
          codigo: "RES-000004",
          cliente: "Você",
          email: "usuario@exemplo.com",
          pacote: "Fernando de Noronha - Ilha Paradisíaca",
          destino: "Fernando de Noronha, PE",
          dataViagem: "05/06/2024",
          dataReserva: "15/05/2024",
          valorTotal: 3500.00,
          valor: 3500.00,
          status: "cancelada",
          quantidadePessoas: 2,
          pessoas: 2,
          statusPagamento: "reembolsado",
          pagamento: "reembolsado",
          categoria: "ecoturismo",
          observacoes: "Viagem cancelada devido a condições climáticas. Valor será reembolsado em 5 dias úteis.",
          imagemUrl: "/images/noronha.jpg"
        }
      ];
      
      await new Promise((r) => setTimeout(r, 1000));
      setReservas(reservasEstaticas);
      showSuccess(`${reservasEstaticas.length} reserva(s) carregada(s) com sucesso!`);
    } catch (error) {
      console.error(error);
      showError("Erro ao carregar suas reservas");
    } finally {
      setIsLoading(false);
    }
  };

  const aplicarFiltros = () => {
    let filtradas = [...reservas];
    if (filtroStatus !== "todas") {
      filtradas = filtradas.filter((r) => r.status === filtroStatus);
    }
    if (searchTerm.trim()) {
      const termo = searchTerm.toLowerCase();
      filtradas = filtradas.filter(
        (r) =>
          r.codigo?.toLowerCase().includes(termo) ||
          r.destino?.toLowerCase().includes(termo) ||
          r.pacote?.toLowerCase().includes(termo)
      );
    }
    setReservasFiltradas(filtradas);
  };

  if (!estaLogado()) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-xl text-center">
          <p className="text-lg font-semibold text-gray-700 mb-2">Acesso Restrito</p>
          <p className="text-gray-500">Você precisa estar logado para ver suas reservas.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <ToastContainer toasts={toasts} onRemoveToast={removeToast} />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 px-2 sm:px-4 py-6 sm:py-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-6 sm:mb-10">
            <div className="inline-flex w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 items-center justify-center shadow-lg mb-3 sm:mb-4">
              <Package className="text-white w-6 h-6 sm:w-8 sm:h-8" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent mb-2">Minhas Reservas</h1>
            <p className="text-sm sm:text-base text-gray-600 px-4">Gerencie suas viagens com praticidade</p>
          </div>

          <FiltroReservas
            filtroStatus={filtroStatus}
            setFiltroStatus={setFiltroStatus}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            isLoading={isLoading}
            onReload={carregarReservas}
          />

          {isLoading ? (
            <div className="text-center py-12 sm:py-16">
              <div className="relative">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full mx-auto mb-4 sm:mb-6 animate-pulse"></div>
                <RefreshCw className="w-6 h-6 sm:w-8 sm:h-8 text-white absolute top-3 sm:top-4 left-1/2 transform -translate-x-1/2 animate-spin" />
              </div>
              <p className="text-base sm:text-lg text-gray-600 animate-pulse px-4">Carregando suas aventuras...</p>
            </div>
          ) : reservasFiltradas.length === 0 ? (
            <div className="text-center py-12 sm:py-16 px-4">
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-6 sm:p-12 max-w-sm sm:max-w-md mx-auto border border-white/20 shadow-xl">
                <Package className="w-16 h-16 sm:w-20 sm:h-20 text-gray-400 mx-auto mb-4 sm:mb-6 opacity-60" />
                <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">
                  {reservas.length === 0 
                    ? "Nenhuma aventura encontrada"
                    : "Nenhuma reserva corresponde aos filtros"}
                </h3>
                <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8 leading-relaxed">
                  {reservas.length === 0 
                    ? "Você ainda não fez nenhuma reserva. Que tal explorar nossos pacotes incríveis?"
                    : "Tente ajustar os filtros ou buscar por outros termos."}
                </p>
                {reservas.length === 0 && (
                  <button 
                    onClick={() => navigate('/')}
                    className="bg-orange-500 hover:bg-orange-600 text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg sm:rounded-xl text-sm sm:text-base font-medium hover:shadow-lg transform hover:scale-105 transition-all duration-300"
                  >
                    Descobrir Pacotes
                  </button>
                )}
              </div>
            </div>
          ) : (
            <>
              <div className="grid gap-4 sm:gap-6 lg:gap-8">
                {reservasFiltradas.map((reserva, index) => (
                  <ReservaCard key={reserva.id} reserva={reserva} index={index} />
                ))}
              </div>
              
              {/* Resumo de estatísticas */}
              {reservasFiltradas.length > 0 && (
                <div className="mt-6 sm:mt-8 bg-white/80 backdrop-blur-sm border border-white/30 rounded-xl sm:rounded-2xl p-4 sm:p-6 mx-2 sm:mx-0">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0 text-xs sm:text-sm text-gray-600">
                    <span className="flex items-center gap-2 justify-center sm:justify-start">
                      <Package className="w-3 h-3 sm:w-4 sm:h-4" />
                      Mostrando <span className="font-bold text-blue-600">{reservasFiltradas.length}</span> de <span className="font-bold">{reservas.length}</span> reserva(s)
                    </span>
                    <span className="bg-blue-50 border border-blue-200 px-2 sm:px-3 py-1 rounded-md sm:rounded-lg text-center">
                      Filtro: <span className="font-medium">{filtroStatus === "todas" ? "Todas" : filtroStatus.charAt(0).toUpperCase() + filtroStatus.slice(1)}</span>
                    </span>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default MinhasReservas;