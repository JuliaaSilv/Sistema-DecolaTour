using Microsoft.EntityFrameworkCore;
using agencia.Data;
using agencia.Models;
using agencia.Interfaces.Repository;

namespace agencia.Repository
{
    public class AvaliacaoRepository : Repository<Avaliacao>, IAvaliacaoRepository
    {
        public AvaliacaoRepository(AppDbContext context) : base(context)
        {
        }

        public async Task<IEnumerable<Avaliacao>> ListarAvaliacoesPorPacoteAsync(int pacoteId)
        {
            return await _context.Set<Avaliacao>()
                .Include(a => a.Reserva)
                .ThenInclude(r => r.Pacote)
                .Where(a => a.Reserva.PacoteId == pacoteId)
                .OrderByDescending(a => a.Data)
                .ToListAsync();
        }

        public async Task<IEnumerable<Avaliacao>> ListarAvaliacoesPorReservaAsync(int reservaId)
        {
            return await _context.Set<Avaliacao>()
                .Include(a => a.Reserva)
                .Where(a => a.ReservaId == reservaId)
                .OrderByDescending(a => a.Data)
                .ToListAsync();
        }

        public async Task<double> CalcularMediaNotasAsync(int pacoteId)
        {
            var avaliacoes = await _context.Set<Avaliacao>()
                .Include(a => a.Reserva)
                .Where(a => a.Reserva.PacoteId == pacoteId)
                .Select(a => a.Nota)
                .ToListAsync();

            return avaliacoes.Any() ? avaliacoes.Average() : 0;
        }

        public async Task<int> ContarAvaliacoesPorPacoteAsync(int pacoteId)
        {
            return await _context.Set<Avaliacao>()
                .Include(a => a.Reserva)
                .CountAsync(a => a.Reserva.PacoteId == pacoteId);
        }

        public override async Task<IEnumerable<Avaliacao>> ListarAsync()
        {
            return await _context.Set<Avaliacao>()
                .Include(a => a.Reserva)
                .ThenInclude(r => r.Pacote)
                .OrderByDescending(a => a.Data)
                .ToListAsync();
        }

        public override async Task<Avaliacao?> BuscarPorIdAsync(int id)
        {
            return await _context.Set<Avaliacao>()
                .Include(a => a.Reserva)
                .ThenInclude(r => r.Pacote)
                .FirstOrDefaultAsync(a => a.Id == id);
        }
    }
}
