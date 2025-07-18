using agencia.Models;
using agencia.Response;
using InterfaceService;

namespace agencia.Repository
{
    public interface IUserRepository
    {

        Task<bool> CpfExistsAsync(string cpf);

        Task<Usuario> AddAsync(Usuario usuario);

        Task<IEnumerable<Usuario>> GetAllAsync();

        Task<Usuario?> GetByIdAsync(int id);

        Task<Usuario> UpdateAsync(Usuario usuario);
        
        Task<bool> DeleteAsync(int id);


    }
}