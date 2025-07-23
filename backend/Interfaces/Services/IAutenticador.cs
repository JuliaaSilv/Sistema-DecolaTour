using agencia.Models;

namespace agencia.Interfaces.Services
{
    public interface IAutenticador
    {
        Task<bool> AutenticarAsync(string email, string senha);
        Task<bool> UserExiste(string email);
        public string GerarToken(Usuario usuario);
        public Task<Usuario> GetUserByEmail(string email);

    }
}
