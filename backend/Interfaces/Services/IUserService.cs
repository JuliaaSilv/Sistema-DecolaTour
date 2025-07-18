using agencia.DTOs;
using agencia.Models;
using agencia.Response;


namespace InterfaceService
{
    public interface IUserService
    {

        Task<IEnumerable<UsuarioDTO>> GetAllAsync();

        Task<UsuarioDTO?> GetByIdAsync(int id);

        Task<ApiResponse> RegisterAsync(UsuarioDTO usuario);

        Task<ApiResponse> UpdateAsync(UsuarioDTO usuario);

        Task<ApiResponse> DeleteAsync(int id);
        
    }
}