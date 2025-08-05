using agencia.Models;
using agencia.Enum;

namespace agencia.Interfaces.Repository
{
    public interface IAvaliacaoRepository : IRepository<Avaliacao>
    {
        Task<IEnumerable<Avaliacao>> ListarAvaliacoesPorPacoteAsync(int pacoteId);
        Task<IEnumerable<Avaliacao>> ListarAvaliacoesPorReservaAsync(int reservaId);
        Task<double> CalcularMediaNotasAsync(int pacoteId);
        Task<int> ContarAvaliacoesPorPacoteAsync(int pacoteId);
        Task CriarAvaliacaoAsync(Avaliacao avaliacao);
        Task<Avaliacao?> ObterPorReservaIdAsync(int reservaId);
        Task<Avaliacao?> ObterPorReservaEUsuarioAsync(int reservaId, int usuarioId);
        
        // Métodos para moderação
        Task<IEnumerable<Avaliacao>> ListarAvaliacoesPendentesAsync();
        Task<bool> AtualizarStatusAsync(int avaliacaoId, StatusAvaliacao novoStatus);
    }
}
