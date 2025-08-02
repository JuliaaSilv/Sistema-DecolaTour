using agencia.Data;
using agencia.DTOs;
using agencia.Interfaces.Repository;
using agencia.Models;
using Microsoft.EntityFrameworkCore;

namespace agencia.Repository
{
    public class PacoteRepository : IPacoteRepository
    {
        private readonly AppDbContext _context;

        public PacoteRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<Pacote>> ListarAsync()
        {
            return await _context.Pacotes
                .Include(p => p.Imagens)
                .Include(p => p.Videos)
                .ToListAsync();
        }

        public async Task<Pacote?> BuscarPorIdAsync(int id)
        {
            return await _context.Pacotes
                .Include(p => p.Imagens)
                .Include(p => p.Videos)
                .FirstOrDefaultAsync(p => p.Id == id);
        }

        public async Task CadastrarAsync(Pacote pacote)
        {
            _context.Pacotes.Add(pacote);
            await _context.SaveChangesAsync();
        }

        public async Task AtualizarAsync(Pacote pacote)
        {
            _context.Pacotes.Update(pacote);
            await _context.SaveChangesAsync();
        }

        public async Task<List<Pacote>> ListarPorCategoriaAsync(string categoria)
        {
            if (string.IsNullOrWhiteSpace(categoria))
                return new List<Pacote>();

            categoria = categoria.Trim().ToLower();

            return await _context.Pacotes
                .Where(p => p.Categorias != null && p.Categorias.ToLower().Contains(categoria))
                .ToListAsync();
        }

        public async Task SalvarHistoricoAsync(HistoricoPacote historico)
        {
            _context.PacotesHistorico.Add(historico);
            await _context.SaveChangesAsync();
        }

        public async Task<List<HistoricoPacote>> BuscarTodosHistoricosAsync()
        {
            return await _context.PacotesHistorico
                .OrderByDescending(h => h.AtualizadoEm)
                .ToListAsync();
        }
        public async Task<List<HistoricoPacote>> BuscarHistoricoPorPacoteIdAsync(int pacoteId)
        {
            return await _context.PacotesHistorico
                .Where(h => h.PacoteId == pacoteId)
                .OrderByDescending(h => h.AtualizadoEm)
                .ToListAsync();
        }


        public async Task RemoverAsync(Pacote pacote)
        {
            _context.Pacotes.Remove(pacote);
            await _context.SaveChangesAsync();
        }

    }
}
