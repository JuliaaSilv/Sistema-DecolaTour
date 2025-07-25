using agencia.Models;


namespace agencia.Interfaces.Repository
{
    public interface IPagamentoRepository : IRepository<Pagamento>
    {
        Task<Pagamento> CriarPagamentoAsync(Pagamento pagamento);
        Task<Pagamento> AtualizaPagamentoAsync(Pagamento pagamento);
        Task<Pagamento> BuscarPagamentoPorIdAsync(int id);
        Task<bool> DeletarPagamentoAsync(int id);
        Task<IEnumerable<Pagamento>> ListarPagamentosAsync(int idReserva);
        
    }
}