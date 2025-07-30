using agencia.DTOs;
using agencia.Response;

namespace agencia.Interfaces.Services
{
    public interface IAvaliacaoService
    {
        Task<ApiResponse> CriarAvaliacaoAsync(AvaliacaoDTO avaliacaoDTO);
        Task<ApiResponse> ListarAvaliacoesAsync();
        Task<ApiResponse> BuscarAvaliacaoPorIdAsync(int id);
        Task<ApiResponse> ListarAvaliacoesPorPacoteAsync(int pacoteId);
        Task<ApiResponse> ListarAvaliacoesPorReservaAsync(int reservaId);
        Task<ApiResponse> AtualizarAvaliacaoAsync(int id, AvaliacaoDTO avaliacaoDTO);
        Task<ApiResponse> RemoverAvaliacaoAsync(int id);
        Task<ApiResponse> CalcularMediaAvaliacoesAsync(int pacoteId);
    }
}
