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

        public AutenticadorService(IConfiguration configuration, AppDbContext context)
        {
            _configuration = configuration;
            _context = context;
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

        public string GerarToken(string email, int id, int TipoUsuario )
        {
            var secretKey = _configuration["Jwt:SecretKey"];
            var issuer = _configuration["Jwt:Issuer"];
            var audience = _configuration["Jwt:Audience"];

            var usuario = _context.Usuarios.FirstOrDefault(u => u.Email.ToLower() == email.ToLower());
            if (usuario == null)
                throw new Exception("Usuário não encontrado para gerar token.");

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey));
            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
        new Claim(JwtRegisteredClaimNames.Sub, email),
        new Claim("id", id.ToString()),
        new Claim("TIPO_USUARIO_ID", usuario.TipoUsuarioId.ToString()), 
        new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
    };

            var token = new JwtSecurityToken(
                issuer: issuer,
                audience: "http://decolatour.com",
                claims: claims,
                expires: DateTime.UtcNow.AddDays(3),
                signingCredentials: credentials
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

           
        }
    }

