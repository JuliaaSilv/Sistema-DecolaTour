using agencia.Data;
using agencia.Interfaces.Repository;
using agencia.Models;
using Microsoft.EntityFrameworkCore;

namespace agencia.Repository
{
    public class EnderecoRepository : IEnderecoRepository
    {
        private readonly AppDbContext _context;

        public EnderecoRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Endereco>> GetByUsuarioIdAsync(int usuarioId)
        {
            return await _context.Enderecos
                .Where(e => e.UsuarioId == usuarioId && e.Ativo)
                .OrderBy(e => e.Id)
                .ToListAsync();
        }

        public async Task<Endereco?> GetByIdAsync(int id)
        {
            return await _context.Enderecos
                .FirstOrDefaultAsync(e => e.Id == id);
        }

        public async Task<Endereco> CreateAsync(Endereco endereco)
        {
            _context.Enderecos.Add(endereco);
            await _context.SaveChangesAsync();
            return endereco;
        }

        public async Task<Endereco> UpdateAsync(Endereco endereco)
        {
            _context.Enderecos.Update(endereco);
            await _context.SaveChangesAsync();
            return endereco;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var endereco = await GetByIdAsync(id);
            if (endereco == null) return false;

            // Soft delete - apenas marca como inativo
            endereco.Ativo = false;
            await UpdateAsync(endereco);
            return true;
        }

        public async Task<bool> ExistsAsync(int id)
        {
            return await _context.Enderecos.AnyAsync(e => e.Id == id);
        }
    }
}
