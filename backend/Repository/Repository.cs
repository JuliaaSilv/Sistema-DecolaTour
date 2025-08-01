using agencia.Data;
using agencia.Models;
using Microsoft.EntityFrameworkCore;

public class Repository<T> : IRepository<T> where T : class
{
    protected readonly AppDbContext _context;
    protected readonly DbSet<T> _dbSet;

    public Repository(AppDbContext context)
    {
        _context = context;
        _dbSet = context.Set<T>();
    }

    public virtual async Task<T> AdicionarAsync(T entidade)
    {
        await _dbSet.AddAsync(entidade);
        await _context.SaveChangesAsync();
        return entidade;
    }

    public virtual async Task<T?> BuscarPorIdAsync(int id)
    {
        return await _dbSet.FindAsync(id);
    }

    public virtual async Task<IEnumerable<T>> ListarAsync()
    {
        return await _dbSet.ToListAsync();
    }

    public virtual async Task AtualizarAsync(T entidade)
    {
        _dbSet.Update(entidade);
        await _context.SaveChangesAsync();
    }

    public virtual async Task<bool> DeletarAsync(int id)
    {
        var entidade = await BuscarPorIdAsync(id);
        if (entidade == null)
            return false;

        _dbSet.Remove(entidade);
        await _context.SaveChangesAsync();
        return true;
    }

    public virtual async Task<List<HistoricoPacote>> BuscarTodosHistoricosAsync()
    {
        return await _context.PacotesHistorico
            .OrderByDescending(h => h.AtualizadoEm)
            .ToListAsync();
    }

}
