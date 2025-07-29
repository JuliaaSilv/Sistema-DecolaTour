using agencia.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace agencia.Interfaces.Repository
{
    /// <summary>
    /// Interface do repositório de Viajante (acesso a dados).
    /// </summary>
    public interface IViajanteRepository
    {
        Task<IEnumerable<Viajante>> GetAllAsync();
        Task<Viajante?> GetByIdAsync(int id);
        Task AddAsync(Viajante viajante);
        Task UpdateAsync(Viajante viajante);
        Task DeleteAsync(int id);
    }
}
