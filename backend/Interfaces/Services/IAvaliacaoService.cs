using agencia.DTOs;
using agencia.Response;

namespace agencia.Interfaces.Services
{
    public interface IAvaliacaoService
    {
        Task<ApiResponse> CriarAvaliacaoAsync(AvaliacaoDTO avaliacaoDTO, int usuarioId);
        Task<ApiResponse> ListarAvaliacoesAsync();
        Task<ApiResponse> BuscarAvaliacaoPorIdAsync(int id);
        Task<ApiResponse> ListarAvaliacoesPorPacoteAsync(int pacoteId);
        Task<ApiResponse> ListarAvaliacoesPorReservaAsync(int reservaId);
        Task<ApiResponse> AtualizarAvaliacaoAsync(int id, AvaliacaoDTO avaliacaoDTO);
        Task<ApiResponse> RemoverAvaliacaoAsync(int id);
        Task<ApiResponse> CalcularMediaAvaliacoesAsync(int pacoteId);
        Task<ApiResponse> VerificarSeUsuarioPodeAvaliarPacoteAsync(int pacoteId, int usuarioId);
        
        // Métodos para moderação
        Task<ApiResponse> ListarAvaliacoesPendentesAsync();
        Task<ApiResponse> AprovarAvaliacaoAsync(int avaliacaoId);
        Task<ApiResponse> RejeitarAvaliacaoAsync(int avaliacaoId);
    }
}
