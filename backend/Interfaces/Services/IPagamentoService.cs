using agencia.DTOs;
using agencia.Models;
using System.Threading.Tasks;

namespace agencia.Interfaces.Services
{
    public interface IPagamentoService
    {
        Task<Pagamento> CriarPagamentoAsync(PagamentoRequestDTO dto);

        Task AtualizarStatusPagamentoAsync(string pagamentoId, string status);


        Task AtualizarStatusAsync(int pagamentoId, string status);

        Task<PagamentoDTO?> GetPagamentoByIdAsync(int id);

        Task<List<PagamentoDTO>> GetPagamentosByReservaAsync(int reservaId);

        Task<List<PagamentoDTO>> GetAllPagamentosAsync();
    }
}