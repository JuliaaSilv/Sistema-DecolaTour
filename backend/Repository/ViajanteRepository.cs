using agencia.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;
using agencia.Data;

namespace agencia.Repository
{
    /// <summary>
    /// Repositório responsável pelo acesso a dados de Viajante no banco.
    /// </summary>
    public class ViajanteRepository : agencia.Interfaces.Repository.IViajanteRepository
    {
        private readonly AppDbContext _context;

        /// <summary>
        /// Injeta o contexto do banco de dados.
        /// </summary>
        public ViajanteRepository(AppDbContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Retorna todos os viajantes cadastrados.
        /// </summary>
        public async Task<IEnumerable<Viajante>> GetAllAsync()
        {
            return await _context.Viajantes.Include(v => v.Reserva).ToListAsync();
        }

        /// <summary>
        /// Busca um viajante pelo ID.
        /// </summary>
        public async Task<Viajante?> GetByIdAsync(int id)
        {
            return await _context.Viajantes.Include(v => v.Reserva).FirstOrDefaultAsync(v => v.Id == id);
        }

        /// <summary>
        /// Adiciona um novo viajante ao banco.
        /// </summary>
        public async Task AddAsync(Viajante viajante)
        {
            _context.Viajantes.Add(viajante);
            await _context.SaveChangesAsync();
        }


        /// <summary>
        /// Atualiza os dados de um viajante existente.
        /// </summary>
        public async Task UpdateAsync(Viajante viajante)
        {
            _context.Viajantes.Update(viajante);
            await _context.SaveChangesAsync();
        }


        /// <summary>
        /// Remove um viajante pelo ID.
        /// </summary>
        public async Task DeleteAsync(int id)
        {
            var viajante = await _context.Viajantes.FindAsync(id);
            if (viajante != null)
            {
                _context.Viajantes.Remove(viajante);
                await _context.SaveChangesAsync();
            }
        }
    }
}