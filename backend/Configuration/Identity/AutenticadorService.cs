using agencia.Data;
using agencia.Interfaces.Services;
using agencia.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace agencia.Configurations.Identity
{
    public class AutenticadorService : IAutenticador
    {
        private readonly IConfiguration _configuration;
        private readonly AppDbContext _context;
        private readonly string _secretKey;

        public AutenticadorService(IConfiguration configuration, AppDbContext context, string secretKey)
        {
            _configuration = configuration;
            _context = context;
            _secretKey = secretKey;
        }

        public async Task<bool> AutenticarAsync(string email, string senha)
        {
            var usuario = await _context.Usuarios
                .FirstOrDefaultAsync(x => x.Email.ToLower() == email.ToLower());

            if (usuario == null)
                return false;

            bool senhaValida = BCrypt.Net.BCrypt.Verify(senha, usuario.Senha);
            return senhaValida;
        }

        public async Task<Usuario> GetUserByEmail(string email)
        {
            return await _context.Usuarios
                .AsNoTracking()
                .FirstOrDefaultAsync(u => u.Email.ToLower() == email.ToLower());
        }

        public async Task<bool> UserExiste(string email)
        {
            var usuario = await _context.Usuarios
                .FirstOrDefaultAsync(x => x.Email.ToLower() == email.ToLower());

            return usuario != null;
        }

        public string GerarToken(Usuario usuario)
        {
            var key = Encoding.ASCII.GetBytes(_secretKey);

            
            var claims = new[]
            {
                new Claim(ClaimTypes.Role, usuario.TipoUsuarioId.ToString()),
                new Claim(ClaimTypes.Email, usuario.Email),
                new Claim(ClaimTypes.Name, usuario.Nome)
            };

            
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims), 
                Expires = DateTime.UtcNow.AddDays(1), 
                SigningCredentials = new SigningCredentials(
                                      new SymmetricSecurityKey(key), 
                                      SecurityAlgorithms.HmacSha256Signature 

                                      ) 

            }; 

            
            var tokenHandler = new JwtSecurityTokenHandler();

           
            var token = tokenHandler.CreateToken(tokenDescriptor);

            
            return tokenHandler.WriteToken(token); 
        }

    }
}
    

