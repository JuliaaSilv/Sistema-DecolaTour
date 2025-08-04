using agencia.Data;
using agencia.Interfaces.Repository;
using agencia.Models;
using Microsoft.EntityFrameworkCore;

namespace agencia.Repository
{
    public class CartaoRepository : ICartaoRepository
    {
        private readonly AppDbContext _context;

        public CartaoRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Cartao>> GetByUsuarioIdAsync(int usuarioId)
        {
            return await _context.Cartoes
                .Where(c => c.UsuarioId == usuarioId && c.Ativo)
                .OrderBy(c => c.Id)
                .ToListAsync();
        }

        public async Task<Cartao?> GetByIdAsync(int id)
        {
            return await _context.Cartoes
                .FirstOrDefaultAsync(c => c.Id == id);
        }

        public async Task<Cartao> CreateAsync(Cartao cartao)
        {
            _context.Cartoes.Add(cartao);
            await _context.SaveChangesAsync();
            return cartao;
        }

        public async Task<Cartao> UpdateAsync(Cartao cartao)
        {
            _context.Cartoes.Update(cartao);
            await _context.SaveChangesAsync();
            return cartao;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var cartao = await GetByIdAsync(id);
            if (cartao == null) return false;

            // Soft delete - apenas marca como inativo
            cartao.Ativo = false;
            await UpdateAsync(cartao);
            return true;
        }

        public async Task<bool> ExistsAsync(int id)
        {
            return await _context.Cartoes.AnyAsync(c => c.Id == id);
        }
    }
}
