using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using agencia.Interfaces.Repository;
using agencia.Interfaces.Services;
using agencia.Response;

namespace agencia.Service
{
    public class AdminDashboardService : IAdminDashboardService
    {
        private IAdminDashboardRepository _repository { get; }
        public AdminDashboardService(IAdminDashboardRepository repository)
        {
            _repository = repository;
        }

        public async Task<ApiResponse> GetMetricasGeraisAsync()
        {
            var totalReservas = await _repository.GetTotalReservasAsync();
            var totalClientes = await _repository.GetTotalClientesAsync();
            var totalPacotes = await _repository.GetTotalPacotesAsync();
            var faturamento = await _repository.GetFaturamentoAsync();

            var data = new {
                totalReservas,
                totalClientes,
                totalPacotes,
                faturamento
            };

            return new ApiResponse(data, null, 200);
        }

        public async Task<ApiResponse> GetFaturamentoMensalAsync()
        {
            var data = await _repository.GetFaturamentoMensalAsync();
            return new ApiResponse(data, null, 200);
        }

        public async Task<ApiResponse> GetDestinosPopularesAsync()
        {
            var data = await _repository.GetDestinosPopularesAsync();
            return new ApiResponse(data, null, 200);
        }

        public async Task<ApiResponse> GetPromocoesAtivasAsync()
        {
            var data = await _repository.GetPromocoesAtivasAsync();
            return new ApiResponse(data, null, 200);
        }

        public async Task<ApiResponse> GetClientesFrequentesAsync()
        {
            var data = await _repository.GetClientesFrequentesAsync();
            return new ApiResponse(data, null, 200);
        }
    }
}