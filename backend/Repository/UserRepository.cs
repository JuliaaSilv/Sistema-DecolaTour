using Microsoft.EntityFrameworkCore;
using agencia.Data;
using agencia.Models;
using agencia.Response;

namespace agencia.Repository
{
    public class UserRepository : IUserRepository
    {
        private AppDbContext Context { get; }

        public UserRepository(AppDbContext context)
        {
            Context = context;
        }

        public async Task<bool> CpfExistsAsync(string cpf)
        {
            return await Context.Usuarios.AnyAsync(u => u.Cpf == cpf);
        }

        public async Task<Usuario?> GetByCpfAsync(string cpf)
        {
            return await Context.Usuarios.FirstOrDefaultAsync(u => u.Cpf == cpf);
        }


        public async Task<Usuario> AddAsync(Usuario usuario)
        {

            Context.Usuarios.Add(usuario);
            await Context.SaveChangesAsync();
            return usuario;
        }

        public async Task<Usuario?> GetByIdAsync(int id)
        {

            return await Context.Usuarios.FindAsync(id);

        }

        public async Task<IEnumerable<Usuario>> GetAllAsync()
        {
            return await Context.Usuarios.ToListAsync();
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var usuario = await Context.Usuarios.FindAsync(id);
            if (usuario == null)
                return false;

            Context.Usuarios.Remove(usuario);
            await Context.SaveChangesAsync();
            return true;
        }

        public async Task<Usuario> UpdateAsync(Usuario usuario)
        {
            Context.Usuarios.Update(usuario);
            await Context.SaveChangesAsync();
            return usuario;
        }
    }
}
