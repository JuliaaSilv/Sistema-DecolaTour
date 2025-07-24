using agencia.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;
using agencia.Data;

namespace agencia.Repositories
{
    public class ViajanteRepository
    {
        private readonly AppDbContext _context;

        public ViajanteRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<Viajante>> GetAllAsync()
        {
            return await _context.Viajantes.Include(v => v.Reserva).ToListAsync();
        }

        public async Task<Viajante?> GetByIdAsync(int id)
        {
            return await _context.Viajantes.Include(v => v.Reserva).FirstOrDefaultAsync(v => v.Id == id);
        }

        public async Task AddAsync(Viajante viajante)
        {
            _context.Viajantes.Add(viajante);
            await _context.SaveChangesAsync();
        }

public async Task UpdateAsync(Viajante viajante)
{
    _context.Viajantes.Update(viajante);
    await _context.SaveChangesAsync();
}

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