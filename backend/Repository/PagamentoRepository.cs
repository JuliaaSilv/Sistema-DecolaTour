using agencia.Data;
using agencia.Interfaces.Repository;
using agencia.Models;
using Microsoft.EntityFrameworkCore;

namespace agencia.Repository
{public class PagamentoRepository : Repository<Pagamento>, IPagamentoRepository
    {
        public PagamentoRepository(DbContext context) : base(context) { }

        public Task<Pagamento> AtualizaPagamentoAsync(Pagamento pagamento)
        {
            if (pagamento == null)
                throw new Exception("Pagamento não encontrado.");

            _dbSet.Update(pagamento);
            _context.SaveChanges();
            return Task.FromResult(pagamento);
        }

        public async Task<Pagamento> BuscarPagamentoPorIdAsync(int id)
        {
            var pagamento = await _dbSet.FindAsync(id);
            if (pagamento == null)
                throw new Exception("Pagamento não encontrado.");
            return pagamento;
        }

        public Task<Pagamento> CriarPagamentoAsync(Pagamento pagamento)
        {
            if (pagamento == null)    
                throw new Exception("Pagamento não encontrado.");
    
            _dbSet.Add(pagamento);
            _context.SaveChanges();
            return Task.FromResult(pagamento);
        }

        public async Task<bool> DeletarPagamentoAsync(int id)
        {
            var pagamento = await BuscarPagamentoPorIdAsync(id);
            if (pagamento == null)
                throw new Exception("Pagamento não encontrado.");

            _dbSet.Remove(pagamento);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<IEnumerable<Pagamento>> ListarPagamentosAsync(int idReserva)
        {

            try
            {
                var pagamentos = await _dbSet.Where(p => p.Reserva.Id == idReserva).ToListAsync();

                if (pagamentos == null || !pagamentos.Any())
                    return Enumerable.Empty<Pagamento>();

                return pagamentos.AsEnumerable();
            }
            catch (Exception ex)
            {
                throw new Exception("Erro ao listar pagamentos da reserva. Detalhe: " + ex.Message);
            }
        }
    }

}