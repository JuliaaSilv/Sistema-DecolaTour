using agencia.DTOs;
using agencia.Models;
using agencia.Response;



namespace agencia.Interfaces.Services
{

    public interface IPagamentoService
    {

        Task<Pagamento?> BuscarPagamentoPorIdAsync(int id);

        Task<Pagamento?> CriarPagamentoAsync(PagamentoDTO pagamentoDTO);

        Task<Pagamento?>AtualizaPagamentoAsync(PagamentoDTO pagamentoDTO);

        Task DeletarPagamentoAsync(int id);

        Task<IEnumerable<Pagamento>> ListarPagamentosAsync(int idReserva);

        Task AtualizarStatusDaReservaPeloPagamentoAsync(int pagamentoId, string novoStatus);
    }
}