import React from "react";
import { Search, Filter, RefreshCw } from "lucide-react";

const FiltroReservas = ({
  filtroStatus,
  setFiltroStatus,
  searchTerm,
  setSearchTerm,
  isLoading,
  onReload,
}) => {
  return (
    <div className="bg-white/70 backdrop-blur-sm border border-white/20 rounded-xl sm:rounded-2xl p-4 sm:p-6 mb-6 sm:mb-8 shadow-xl mx-2 sm:mx-0">
      <div className="flex flex-col gap-4 lg:flex-row lg:gap-6 lg:items-center lg:justify-between">
        {/* Busca com efeito glassmorphism */}
        <div className="relative flex-1 lg:max-w-md">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-blue-600/10 rounded-lg sm:rounded-xl blur-sm"></div>
          <div className="relative bg-white/80 backdrop-blur-sm border border-white/30 rounded-lg sm:rounded-xl overflow-hidden">
            <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-blue-500 w-4 h-4 sm:w-5 sm:h-5" />
            <input
              type="text"
              placeholder="Buscar por código, destino ou pacote..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2.5 sm:py-3 bg-transparent border-0 focus:outline-none focus:ring-0 text-sm sm:text-base text-gray-700 placeholder-gray-400"
            />
          </div>
        </div>

        {/* Controles de filtro */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
          <div className="flex items-center gap-2 sm:gap-3 bg-white/80 backdrop-blur-sm border border-white/30 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2">
            <Filter className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500 flex-shrink-0" />
            <select
              value={filtroStatus}
              onChange={(e) => setFiltroStatus(e.target.value)}
              className="bg-transparent border-0 focus:outline-none focus:ring-0 text-sm sm:text-base text-gray-700 cursor-pointer flex-1 min-w-0"
            >
              <option value="todas">Todas</option>
              <option value="confirmada">Confirmadas</option>
              <option value="pendente">Pendentes</option>
              <option value="cancelada">Canceladas</option>
            </select>
          </div>

          {/* Botão Atualizar com cor da identidade visual */}
          <button
            onClick={onReload}
            disabled={isLoading}
            className="flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg sm:rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 text-sm sm:text-base font-medium"
          >
            <RefreshCw
              className={`w-4 h-4 sm:w-4 sm:h-4 ${isLoading ? "animate-spin" : ""}`}
            />
            <span className="hidden sm:inline">Atualizar</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default FiltroReservas;
