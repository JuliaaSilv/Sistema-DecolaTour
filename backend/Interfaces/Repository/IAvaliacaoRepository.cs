using agencia.Models;

namespace agencia.Interfaces.Repository
{
    public interface IAvaliacaoRepository : IRepository<Avaliacao>
    {
        Task<IEnumerable<Avaliacao>> ListarAvaliacoesPorPacoteAsync(int pacoteId);
        Task<IEnumerable<Avaliacao>> ListarAvaliacoesPorReservaAsync(int reservaId);
        Task<double> CalcularMediaNotasAsync(int pacoteId);
        Task<int> ContarAvaliacoesPorPacoteAsync(int pacoteId);
    }
}
