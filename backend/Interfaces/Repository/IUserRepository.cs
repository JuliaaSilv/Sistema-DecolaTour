using agencia.Models;
namespace agencia.Repository
{
    public interface IUserRepository
    {
        Task<bool> CpfExistsAsync(string cpf);
        Task<Usuario?> GetByCpfAsync(string cpf);
        Task<Usuario> AddAsync(Usuario usuario);

        Task<Usuario?> GetByIdAsync(int id);
        Task<IEnumerable<Usuario>> GetAllAsync();
    }
}