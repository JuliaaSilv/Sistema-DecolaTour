using agencia.Response;
using System.Threading.Tasks;

namespace agencia.Interfaces.Services
{
    public interface IAdminDashboardService
    {
        Task<ApiResponse> GetMetricasGeraisAsync();
        Task<ApiResponse> GetFaturamentoMensalAsync();
        Task<ApiResponse> GetDestinosPopularesAsync();
        Task<ApiResponse> GetPromocoesAtivasAsync();
        Task<ApiResponse> GetClientesFrequentesAsync();
    }
}