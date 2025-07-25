using agencia.Data;
using agencia.DTOs;
using agencia.Interfaces.Services;
using agencia.Models;
using InterfaceService;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Swashbuckle.AspNetCore.Annotations;
using System.Threading.Tasks;

namespace agencia.Controller
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAutenticador _autenticadorService;
        private readonly IUserService _userService;
        private readonly AppDbContext _context;

        public AuthController(IAutenticador autenticadorService, IUserService userService, AppDbContext context)
        {
            _autenticadorService = autenticadorService;
            _userService = userService;
            _context = context;
        }

        [HttpPost("registrar")]
        [SwaggerOperation(Summary = "Registra um novo usuário")]
        public async Task<ActionResult> Registrar(UsuarioDTO usuarioDTO)
        {
            if (usuarioDTO == null)
                return BadRequest("Usuário não pode ser nulo.");

            var emailExists = await _autenticadorService.UserExiste(usuarioDTO.Email);
            if (emailExists)
                return BadRequest("Email já cadastrado.");

            var response = await _userService.RegisterAsync(usuarioDTO);
            if (response.Error != null)
                return StatusCode(response.StatusCode, response.Error);

            dynamic resultado = response.Data;
            var mensagem = resultado.Mensagem;

            var novoUsuario = await _autenticadorService.GetUserByEmail(usuarioDTO.Email);
            await _autenticadorService.GerarTokenConfirmacaoEmailAsync(novoUsuario);
            var token = _autenticadorService.GerarToken(novoUsuario);

            return Ok(new
            {
                Mensagem = mensagem,
                Usuario = novoUsuario,
                Email = usuarioDTO.Email,
                Token = token
            });
        }



        [HttpGet("confirmar-email")]
        [SwaggerOperation(Summary = "Confirma o e-mail do usuário")]
        public async Task<IActionResult> ConfirmarEmailAsync(string token)
        {
            if (string.IsNullOrEmpty(token))
                return BadRequest(new { sucesso = false, mensagem = "Token não pode ser vazio." });

            var usuario = await _context.Usuarios.FirstOrDefaultAsync(u => u.TokenConfirmacaoEmail == token);

            if (usuario == null || usuario.ExpiracaoTokenConfirmacao < DateTime.UtcNow)
                return BadRequest(new { sucesso = false, mensagem = "Token inválido ou expirado." });

            if (usuario.EmailConfirmado)
                return Ok(new { sucesso = true, mensagem = "E-mail já confirmado." });

            usuario.EmailConfirmado = true;
            usuario.TokenConfirmacaoEmail = token;
            usuario.ExpiracaoTokenConfirmacao = null;

            await _context.SaveChangesAsync();

            return Ok(new { sucesso = true, mensagem = "E-mail confirmado com sucesso!" });
        }






        [HttpPost("login")]
        [SwaggerOperation(Summary = "Realiza login do usuário")]
        public async Task<ActionResult<UserToken>> Login(Login login)
        {
            var existeUsuario = await _autenticadorService.UserExiste(login.Email);
            if (!existeUsuario)
                return NotFound("Usuário não encontrado.");

            var result = await _autenticadorService.AutenticarAsync(login.Email, login.Senha);
            if (!result)
                return Unauthorized("Email ou senha inválidos.");

            var usuario = await _autenticadorService.GetUserByEmail(login.Email);

            if (!usuario.EmailConfirmado)
                return Unauthorized("Confirmação de e-mail pendente. Verifique sua caixa de entrada.");

            var token = _autenticadorService.GerarToken(usuario);

            return Ok(new UserToken
            {
                Token = token
            });
        }


        [HttpPost("solicitar-recuperacao")]
        [SwaggerOperation(Summary = "Solicita recuperação de senha")]
        public async Task<IActionResult> SolicitarRecuperacao([FromBody] string email)
        {
            var usuario = await _autenticadorService.GetUserByEmail(email);
            if (usuario == null)
                return NotFound("Usuário não encontrado.");

            await _autenticadorService.GerarTokenRecuperacaoSenhaAsync(usuario);

            return Ok("Email de recuperação enviado.");
        }

        [HttpPost("resetar-senha")]
        [SwaggerOperation(Summary = "Reseta a senha do usuário")]
        public async Task<IActionResult> ResetarSenha([FromBody] ResetarSenhaDTO dto)
        {
            var resultado = await _autenticadorService.ResetarSenhaAsync(dto.Token, dto.NovaSenha);
            if (!resultado)
                return BadRequest("Token inválido ou expirado.");

            return Ok("Senha alterada com sucesso!");
        }
    }
}

