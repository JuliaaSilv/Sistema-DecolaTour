using agencia.DTOs;
using agencia.Models;

namespace agencia.Interfaces.Repository
{
    public interface ICartaoRepository
    {
        Task<IEnumerable<Cartao>> GetByUsuarioIdAsync(int usuarioId);
        Task<Cartao?> GetByIdAsync(int id);
        Task<Cartao> CreateAsync(Cartao cartao);
        Task<Cartao> UpdateAsync(Cartao cartao);
        Task<bool> DeleteAsync(int id);
        Task<bool> ExistsAsync(int id);
    }
}
