using agencia.Models;
using agencia.Response;


namespace InterfaceService
{
    public interface IUserService
    {
        Task<ApiResponse> RegisterAsync(Usuario usuario);

        Task<Usuario?> GetByIdAsync(int id);
        Task<IEnumerable<Usuario>> GetAllAsync();
    }
}