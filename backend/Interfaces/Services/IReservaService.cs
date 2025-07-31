using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using agencia.Response;
using agencia.DTOs;

namespace agencia.Interfaces.Services
{
    public interface IReservaService
    {
        Task<IEnumerable<ReservaDTO>> ListarReservasAsync();
        Task<IEnumerable<ReservaCompletaDTO>> ListaCompletaDeReservasAsync(); // Adicionado para tela de administrador.
        Task<ReservaDTO?> BuscarReservaPorIdAsync(int id);

        Task<ApiResponse> CriarReservaAsync(CreateReservaDTO reservaDTO);

        Task<ApiResponse> AtualizarStatusAsync(int reservaId, string novoStatus);
        
        Task<ApiResponse> DeletarReservaAsync(int id);
    }
} 