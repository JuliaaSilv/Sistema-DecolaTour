using agencia.Data;
using agencia.Models;
using agencia.Interfaces.Repository;
using Microsoft.EntityFrameworkCore;

namespace agencia.Repository
{
    public class AdminDashboardRepository : IAdminDashboardRepository
    {
        private readonly AppDbContext _context;
        public AdminDashboardRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<int> GetTotalReservasAsync()
            => await _context.Reservas.CountAsync();

        public async Task<int> GetTotalClientesAsync()
            => await _context.Usuarios.CountAsync();

        public async Task<int> GetTotalPacotesAsync()
            => await _context.Pacotes.CountAsync();

        public async Task<decimal> GetFaturamentoAsync()
            => await _context.Pagamentos.SumAsync(p => (decimal)p.Valor);

        public async Task<IEnumerable<object>> GetFaturamentoMensalAsync()
            => await _context.Pagamentos
                .GroupBy(p => new { p.DataPagamento.Year, p.DataPagamento.Month })
                .Select(g => new {
                    Mes = $"{g.Key.Month}/{g.Key.Year}",
                    Valor = g.Sum(p => p.Valor)
                }).ToListAsync();

        public async Task<IEnumerable<object>> GetDestinosPopularesAsync()
            => await _context.Reservas
                .GroupBy(r => r.Pacote.Destino)
                .Select(g => new {
                    Destino = g.Key,
                    Reservas = g.Count()
                }).OrderByDescending(x => x.Reservas)
                .Take(10)
                .ToListAsync();

        public async Task<IEnumerable<object>> GetPromocoesAtivasAsync()
        {
            var hoje = DateTime.UtcNow;
            return await _context.Promocoes
                .Where(p => p.DataInicio <= hoje && p.DataFim >= hoje)
                .Select(p => new {
                    p.Nome,
                    p.Descricao,
                    p.DescontoPercentual,
                    p.DataInicio,
                    p.DataFim
                }).ToListAsync();
        }

        public async Task<IEnumerable<object>> GetClientesFrequentesAsync()
            => await _context.Reservas
                .GroupBy(r => r.Usuario.Email)
                .Select(g => new {
                    Nome = g.First().Usuario.Nome,
                    Email = g.Key,
                    Reservas = g.Count()
                }).OrderByDescending(x => x.Reservas)
                .Take(10)
                .ToListAsync();
    }
}