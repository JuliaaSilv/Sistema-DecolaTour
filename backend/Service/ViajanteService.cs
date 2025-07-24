using agencia.Models;
using agencia.Repositories;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace agencia.Services
{
    public class ViajanteService
    {
        private readonly ViajanteRepository _repository;

        public ViajanteService(ViajanteRepository repository)
        {
            _repository = repository;
        }

        public Task<List<Viajante>> ListarTodosAsync() => _repository.GetAllAsync();

        public Task<Viajante?> BuscarPorIdAsync(int id) => _repository.GetByIdAsync(id);

        public Task AdicionarAsync(Viajante viajante) => _repository.AddAsync(viajante);
        public async Task AtualizarAsync(Viajante viajante)
        {
            await _repository.UpdateAsync(viajante);
        }

        public async Task RemoverAsync(int id)
        {
             await _repository.DeleteAsync(id);
        }
    }
}