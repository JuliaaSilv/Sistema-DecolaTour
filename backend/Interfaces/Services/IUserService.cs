using agencia.Dto.Write;
using agencia.Models;
using agencia.Response;


namespace InterfaceService
{
    public interface IUserService
    {
        Task<IEnumerable<Usuario>> GetAllAsync();
        Task<Usuario> GetByIdAsync(int id);
        Task<ApiResponse> RegisterAsync(Usuario usuario);
    }
}