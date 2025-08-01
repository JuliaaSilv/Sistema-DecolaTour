using agencia.Models;

public interface IRepository<T> where T : class
{
    Task<T> AdicionarAsync(T entidade);
    Task<T?> BuscarPorIdAsync(int id);
    Task<IEnumerable<T>> ListarAsync();
    Task AtualizarAsync(T entidade);
    Task<bool> DeletarAsync(int id);
    Task<List<HistoricoPacote>> BuscarTodosHistoricosAsync();

    
}
