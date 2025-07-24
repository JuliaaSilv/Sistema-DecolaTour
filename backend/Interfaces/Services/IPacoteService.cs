using agencia.DTOs;
using agencia.Models;

namespace agencia.Interfaces.Services
{
    public interface IPacoteService
    {
        Task<List<PacoteDTO>> ListarPacotesAsync();
        Task<Pacote?> BuscarDetalhesAsync(int id);
        Task CadastrarAsync(PacoteUploadDTO dto);
        Task<List<PacoteDTO>> BuscarComFiltroAsync(FiltroPacoteDTO filtro);
    }
}
