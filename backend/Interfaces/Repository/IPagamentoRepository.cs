using agencia.Models;



namespace agencia.Interfaces.Repository
{
    public interface IPagamentoRepository : IRepository<Pagamento>
    {
        Task<Pagamento> CriarPagamentoAsync(Pagamento pagamento);

        Task<Pagamento> AtualizaPagamentoAsync(Pagamento pagamento);

        Task<Pagamento> BuscarPagamentoPorIdAsync(int id);

        Task<Pagamento> BuscarPagamentoPorIdReservaAsync(int idReserva);

        Task<IEnumerable<Pagamento>> ListarPagamentosPorReservaAsync(int idReserva);

        Task<IEnumerable<Pagamento>> ListarTodosPagamentosAsync();
    }
}