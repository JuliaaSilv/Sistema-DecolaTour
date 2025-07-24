/* using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using agencia.Interfaces.Repository;
using agencia.Data;
using agencia.Models;
using Microsoft.EntityFrameworkCore;

namespace agencia.Repository
{
    // Implementação do repositório de reservas, responsável pelo acesso ao banco de dados
    public class ReservaRepository : IReservaRepository
    {
        // Contexto do banco de dados (Entity Framework)
        private readonly AppDbContext _context;

        // Construtor recebe o contexto via injeção de dependência
        public ReservaRepository(AppDbContext context)
        {
            _context = context;
        }

       
        /// Retorna todas as reservas do sistema, incluindo os dados relacionados (Pacote, Usuário, Viajantes).
        public async Task<IEnumerable<Reserva>> ListarReservasAsync()
        {
            return await _context.Reservas
                .Include(r => r.Pacote)
                .Include(r => r.Usuario)
                .Include(r => r.Viajantes)
                .ToListAsync();
        }

    
        /// Busca uma reserva específica pelo ID, incluindo os dados relacionados.
        public async Task<Reserva?> BuscarReservaPorIdAsync(int id)
        {
            return await _context.Reservas
                .Include(r => r.Pacote)
                .Include(r => r.Usuario)
                .Include(r => r.Viajantes)
                .FirstOrDefaultAsync(r => r.Id == id);
        }

      
        /// Adiciona uma nova reserva ao banco de dados.
        public async Task<Reserva> CriarReservaAsync(Reserva reserva)
        {
            _context.Reservas.Add(reserva);
            await _context.SaveChangesAsync();
            return reserva;
        }

 
        /// Atualiza o status de uma reserva existente.
        public async Task<bool> AtualizarStatusAsync(int reservaId, string novoStatus)
        {
            var reserva = await _context.Reservas.FindAsync(reservaId);
            if (reserva == null) return false;
            reserva.Status = novoStatus;
            _context.Reservas.Update(reserva);
            return await _context.SaveChangesAsync() > 0;
        }


        /// Deleta uma reserva pelo ID.
        public async Task<bool> DeletarReservaAsync(int id)
        {
            var reserva = await _context.Reservas.FindAsync(id);
            if (reserva == null) return false;
            _context.Reservas.Remove(reserva);
            return await _context.SaveChangesAsync() > 0;
        }
    }
} */