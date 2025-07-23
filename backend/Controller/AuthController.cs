using agencia.DTOs;
using agencia.Interfaces.Services;
using agencia.Models;
using InterfaceService;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace agencia.Controller
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAutenticador _autenticadorService;
        private readonly IUserService _userService;

        public AuthController(IAutenticador autenticadorService, IUserService userService)
        {
            _autenticadorService = autenticadorService;
            _userService = userService;
        }

        [HttpPost("registrar")]
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
            var token = _autenticadorService.GerarToken(novoUsuario);

            return Ok(new
            {
                Mensagem = mensagem,
                Usuario = novoUsuario,
                Token = token
            });
        }

        [HttpPost("login")]
        public async Task<ActionResult<UserToken>> Login(Login login)
        {
            var existeUsuario = await _autenticadorService.UserExiste(login.Email);
            if (!existeUsuario)
                return NotFound("Usuário não encontrado.");

            var result = await _autenticadorService.AutenticarAsync(login.Email, login.Senha);
            if (!result)
                return Unauthorized("Email ou senha inválidos.");

            var usuario = await _autenticadorService.GetUserByEmail(login.Email);
            var token = _autenticadorService.GerarToken(usuario);

            return Ok(new UserToken
            {
                Token = token
            });
        }
    }
}
