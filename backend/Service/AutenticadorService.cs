using agencia.Data;
using agencia.Interfaces.Services;
using agencia.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace agencia.Service
{
    public class AutenticadorService : IAutenticador
    {
        private readonly IConfiguration _configuration;
        private readonly AppDbContext _context;
        private readonly string _secretKey;
        private readonly IEmailService _emailService;

        public AutenticadorService(IConfiguration configuration, AppDbContext context, string secretKey, IEmailService emailService)
        {
            _configuration = configuration;
            _context = context;
            _secretKey = secretKey;
            _emailService = emailService;
        }

        public AutenticadorService(IConfiguration configuration, AppDbContext context, string? secretKey)
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

        public async Task<string> GerarTokenConfirmacaoEmailAsync(Usuario usuario)
        {

            var link = $"http://localhost:5173/confirmar-email?token={usuario.TokenConfirmacaoEmail}";
            var html = await File.ReadAllTextAsync("Templates/confirmacao_email.html");
            html = html.Replace("{{NOME}}", usuario.Nome)
                       .Replace("{{LINK}}", link);

            await _emailService.EnviarEmailAsync(usuario.Email, "Confirmação de E-mail", html);

            return usuario.TokenConfirmacaoEmail;
        }

        public async Task<bool> ConfirmarEmailAsync(string token)
        {
            var usuario = await _context.Usuarios.FirstOrDefaultAsync(u =>
                u.TokenConfirmacaoEmail == token);
            
            if (usuario == null)
                return false;

            
            if (usuario.ExpiracaoTokenConfirmacao < DateTime.UtcNow)
                return false;

            usuario.EmailConfirmado = true;
            usuario.TokenConfirmacaoEmail = null;
            usuario.ExpiracaoTokenConfirmacao = null;

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<string> GerarTokenRecuperacaoSenhaAsync(Usuario usuario)
        {
            usuario.TokenRecuperacaoSenha = Guid.NewGuid().ToString();
            usuario.ExpiracaoTokenRecuperacao = DateTime.UtcNow.AddHours(2); 

            _context.Usuarios.Update(usuario);
            await _context.SaveChangesAsync();

            var link = $"http://localhost:5173/redefinir-senha?token={usuario.TokenRecuperacaoSenha}";
            var html = await File.ReadAllTextAsync("Templates/RecuperarSenha.html");

            html = html.Replace("{{NOME}}", usuario.Nome)
                       .Replace("{{LINK}}", link);

            await _emailService.EnviarEmailAsync(usuario.Email, "Recuperação de Senha - DecolaTour", html);
            return usuario.TokenRecuperacaoSenha;
        }


        public async Task<bool> ResetarSenhaAsync(string token, string novaSenha)
        {
            var usuario = await _context.Usuarios.FirstOrDefaultAsync(u =>
                u.TokenRecuperacaoSenha == token &&
                u.ExpiracaoTokenRecuperacao > DateTime.Now);

            if (usuario == null)
                return false;

            
            usuario.Senha = BCrypt.Net.BCrypt.HashPassword(novaSenha);

            usuario.TokenRecuperacaoSenha = null;
            usuario.ExpiracaoTokenRecuperacao = null;

            await _context.SaveChangesAsync();
            return true;
        }
    }

}


