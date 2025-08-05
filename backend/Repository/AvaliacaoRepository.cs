using Microsoft.EntityFrameworkCore;
using agencia.Data;
using agencia.Models;
using agencia.Interfaces.Repository;
using agencia.Enum;

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
                    .ThenInclude(r => r.Usuario)
                .Include(a => a.Reserva)
                    .ThenInclude(r => r.Pacote)
                .Where(a => a.Reserva.PacoteId == pacoteId && a.Status == StatusAvaliacao.Aprovada) // Apenas aprovadas
                .OrderByDescending(a => a.Data)
                .ToListAsync();
        }

        public async Task<Avaliacao?> ObterPorReservaEUsuarioAsync(int reservaId, int usuarioId)
        {
            return await _context.Avaliacoes
                .AsNoTracking()
                .FirstOrDefaultAsync(a => a.ReservaId == reservaId && a.Reserva.UsuarioId == usuarioId);
        }
        public async Task<Avaliacao?> ObterPorReservaIdAsync(int reservaId)
        {
            return await _context.Avaliacoes
                .FirstOrDefaultAsync(a => a.ReservaId == reservaId);
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
                .Where(a => a.Reserva.PacoteId == pacoteId && a.Status == StatusAvaliacao.Aprovada) // Apenas aprovadas
                .Select(a => a.Nota)
                .ToListAsync();

            return avaliacoes.Any() ? avaliacoes.Average() : 0;
        }

        public async Task<int> ContarAvaliacoesPorPacoteAsync(int pacoteId)
        {
            return await _context.Set<Avaliacao>()
                .Include(a => a.Reserva)
                .CountAsync(a => a.Reserva.PacoteId == pacoteId && a.Status == StatusAvaliacao.Aprovada); // Apenas aprovadas
        }

        public override async Task<IEnumerable<Avaliacao>> ListarAsync()
        {
            return await _context.Set<Avaliacao>()
                .Include(a => a.Reserva)
                .ThenInclude(r => r.Pacote)
                .OrderByDescending(a => a.Data)
                .ToListAsync();
        }
        public async Task CriarAvaliacaoAsync(Avaliacao avaliacao)
        {
            await _context.Set<Avaliacao>().AddAsync(avaliacao);
            await _context.SaveChangesAsync();
        }

        public override async Task<Avaliacao?> BuscarPorIdAsync(int id)
        {
            return await _context.Set<Avaliacao>()
                .Include(a => a.Reserva)
                    .ThenInclude(r => r.Usuario)
                .Include(a => a.Reserva)
                    .ThenInclude(r => r.Pacote)
                .FirstOrDefaultAsync(a => a.Id == id);
        }

        // Métodos para moderação 
        public async Task<IEnumerable<Avaliacao>> ListarAvaliacoesPendentesAsync()
        {
            return await _context.Set<Avaliacao>()
                .Include(a => a.Reserva)
                    .ThenInclude(r => r.Usuario)
                .Include(a => a.Reserva)
                    .ThenInclude(r => r.Pacote)
                .Where(a => a.Status == StatusAvaliacao.Pendente)
                .OrderByDescending(a => a.Data)
                .ToListAsync();
        }

        public async Task<bool> AtualizarStatusAsync(int avaliacaoId, StatusAvaliacao novoStatus)
        {
            var avaliacao = await _context.Set<Avaliacao>().FindAsync(avaliacaoId);
            if (avaliacao == null) return false;

            avaliacao.Status = novoStatus;
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
