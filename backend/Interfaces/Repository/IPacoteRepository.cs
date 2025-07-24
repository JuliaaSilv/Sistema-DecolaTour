using agencia.DTOs;
using agencia.Models;

namespace agencia.Interfaces.Repository
{
        public interface IPacoteRepository
        {
            Task<List<Pacote>> ListarAsync();
            Task<Pacote?> BuscarPorIdAsync(int id);
            Task CadastrarAsync(Pacote pacote);
            
    }
    }

