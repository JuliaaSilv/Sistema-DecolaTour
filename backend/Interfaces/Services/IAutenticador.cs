using agencia.Models;

namespace agencia.Interfaces.Services
{
    public interface IAutenticador
    {
        Task<bool> AutenticarAsync(string email, string senha);
        Task<bool> UserExiste(string email);
        public string GerarToken(string email, int id,  int  TipoUsuario);
        public Task<Usuario> GetUserByEmail(string email);

    }
}
