using agencia.Data;
using agencia.Interfaces.Repository;
using agencia.Models;
using Microsoft.EntityFrameworkCore;

namespace agencia.Repository
{public class PagamentoRepository : Repository<Pagamento>, IPagamentoRepository
    {
        public PagamentoRepository(AppDbContext context) : base(context) { }

        public async Task<Pagamento> AtualizaPagamentoAsync(Pagamento pagamento)
        {
            if (pagamento == null)
                throw new Exception("Pagamento não encontrado.");

            _dbSet.Update(pagamento);
            await _context.SaveChangesAsync();
            return pagamento;
        }

        public async Task<Pagamento> BuscarPagamentoPorIdAsync(int id)
        {
            var pagamento = await _dbSet.Include(r => r.Reserva).FirstOrDefaultAsync(u => u.Id == id);
            if (pagamento == null)
                throw new Exception("Pagamento não encontrado.");
            return pagamento;
        }

        public async Task<Pagamento> BuscarPagamentoPorIdReservaAsync(int idReserva)
        {
            var pagamento = await _dbSet
                .Include(p => p.Reserva)
                .FirstOrDefaultAsync(p => p.Reserva.Id == idReserva);

            return pagamento;
        }

        public async Task<Pagamento> CriarPagamentoAsync(Pagamento pagamento)
        {
            if (pagamento == null)
                throw new Exception("Pagamento não encontrado.");

            _dbSet.Add(pagamento);
            await _context.SaveChangesAsync();
            return pagamento;
        }



        public async Task<IEnumerable<Pagamento>> ListarPagamentosPorReservaAsync(int idReserva)
        {
            var pagamentos = await _dbSet.Where(p => p.Reserva.Id == idReserva).ToListAsync();
            return pagamentos ?? Enumerable.Empty<Pagamento>();
        }

        public async Task<IEnumerable<Pagamento>> ListarTodosPagamentosAsync()
        {
            var pagamentos = await _dbSet.ToListAsync();
            return pagamentos ?? Enumerable.Empty<Pagamento>();
        }
    }

}