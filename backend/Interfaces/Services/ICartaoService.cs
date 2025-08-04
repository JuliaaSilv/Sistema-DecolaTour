using agencia.DTOs;
using agencia.Response;

namespace agencia.Interfaces.Services
{
    public interface ICartaoService
    {
        Task<ApiResponse> GetByUsuarioIdAsync(int usuarioId);
        Task<ApiResponse> GetByIdAsync(int id);
        Task<ApiResponse> GetByIdForPaymentAsync(int id, int usuarioId);
        Task<ApiResponse> CreateAsync(int usuarioId, CreateCartaoDTO createCartaoDTO);
        Task<ApiResponse> UpdateAsync(int usuarioId, UpdateCartaoDTO updateCartaoDTO);
        Task<ApiResponse> DeleteAsync(int usuarioId, int cartaoId);
    }
}
