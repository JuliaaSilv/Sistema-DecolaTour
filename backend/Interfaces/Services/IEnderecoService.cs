using agencia.DTOs;
using agencia.Response;

namespace agencia.Interfaces.Services
{
    public interface IEnderecoService
    {
        Task<ApiResponse> GetByUsuarioIdAsync(int usuarioId);
        Task<ApiResponse> GetByIdAsync(int id);
        Task<ApiResponse> CreateAsync(int usuarioId, CreateEnderecoDTO createEnderecoDTO);
        Task<ApiResponse> UpdateAsync(int usuarioId, UpdateEnderecoDTO updateEnderecoDTO);
        Task<ApiResponse> DeleteAsync(int usuarioId, int enderecoId);
    }
}
