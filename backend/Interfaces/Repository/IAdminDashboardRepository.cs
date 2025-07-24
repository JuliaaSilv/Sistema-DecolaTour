using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace agencia.Interfaces.Repository
{
    public interface IAdminDashboardRepository
    {
        Task<int> GetTotalReservasAsync();
        Task<int> GetTotalClientesAsync();
        Task<int> GetTotalPacotesAsync();
        Task<decimal> GetFaturamentoAsync();
        Task<IEnumerable<object>> GetFaturamentoMensalAsync();
        Task<IEnumerable<object>> GetDestinosPopularesAsync();
        Task<IEnumerable<object>> GetPromocoesAtivasAsync();
        Task<IEnumerable<object>> GetClientesFrequentesAsync();
    }
}