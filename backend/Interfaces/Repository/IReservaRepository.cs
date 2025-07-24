/* using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using agencia.Models;

namespace agencia.Interfaces.Repository
{
    public interface IReservaRepository
    {
        Task<IEnumerable<Reserva>> ListarReservasAsync();

        Task<Reserva?> BuscarReservaPorIdAsync(int id);

        Task<Reserva> CriarReservaAsync(Reserva reserva);

        Task<bool> AtualizarStatusAsync(int reservaId, string novoStatus);
        
        Task<bool> DeletarReservaAsync(int id);
    }
} */