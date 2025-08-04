using agencia.DTOs;
using agencia.Models;

namespace agencia.Interfaces.Repository
{
    public interface IEnderecoRepository
    {
        Task<IEnumerable<Endereco>> GetByUsuarioIdAsync(int usuarioId);
        Task<Endereco?> GetByIdAsync(int id);
        Task<Endereco> CreateAsync(Endereco endereco);
        Task<Endereco> UpdateAsync(Endereco endereco);
        Task<bool> DeleteAsync(int id);
        Task<bool> ExistsAsync(int id);
    }
}
