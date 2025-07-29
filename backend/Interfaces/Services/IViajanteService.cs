using agencia.DTOs;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace agencia.Interfaces.Services
{
    /// <summary>
    /// Interface do serviço de Viajante (regras de negócio).
    /// </summary>
    public interface IViajanteService
    {
        Task<IEnumerable<ViajanteDTO>> GetAllAsync();
        Task<ViajanteDTO?> GetByIdAsync(int id);
        Task AddAsync(ViajanteDTO viajanteDTO);
        Task UpdateAsync(ViajanteDTO viajanteDTO);
        Task DeleteAsync(int id);
    }
}
