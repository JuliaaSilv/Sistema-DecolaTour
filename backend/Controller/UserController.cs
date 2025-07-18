using agencia.Data;
using agencia.DTOs;
using agencia.Interfaces.Services;
using agencia.Models;
using agencia.Response;
using agencia.Service;
using InterfaceService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ApiExplorer;

namespace agencia.Controller
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private IAutenticador AutenticadorService { get; }
        private IUserService UserService;

        public UserController(IAutenticador autenticadorService, IUserService userService)
        {
            AutenticadorService = autenticadorService;
            UserService = userService;
        }

        [HttpPost("registrar")]
        public async Task<ActionResult> Incluir(UsuarioDTO usuarioDTO)
        {
            if (usuarioDTO == null)
                return BadRequest("Usuario não pode ser nulo.");

            var emailExists = await AutenticadorService.UserExiste(usuarioDTO.Email);
            if (emailExists)
                return BadRequest("Email ja cadastrado.");

            var response = await UserService.RegisterAsync(usuarioDTO);
            if (response.Error != null)
                return StatusCode(response.StatusCode, response.Error);

            dynamic resultado = response.Data;
            var novoUsuario = resultado.Usuario;
            var Mensagem = resultado.Mensagem;

            var token = AutenticadorService.GerarToken(
                novoUsuario.Email,
                novoUsuario.Id,
                novoUsuario.TipoUsuarioId
            );

            return Ok(new
            {
                Mensagem = Mensagem,
                Usuario = novoUsuario,
                Token = token
            });
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<UsuarioDTO>> GetById(int id)
        {
            var usuario = await UserService.GetByIdAsync(id);
            if (usuario == null)
                return NotFound();
            return Ok(usuario);
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<UsuarioDTO>>> GetAll()
        {
            var usuarios = await UserService.GetAllAsync();
            return Ok(usuarios);
        }

        [HttpPost("login")]
        public async Task<ActionResult<UserToken>> Selecionar(Login login)
        {
            var existeUsuario = await AutenticadorService.UserExiste(login.Email);
            if (!existeUsuario)
                return NotFound("Usuario não encontrado.");

            var result = await AutenticadorService.AutenticarAsync(login.Email, login.Senha);
            if (!result)
                return Unauthorized("Email ou senha inválidos.");

            var usuario = await AutenticadorService.GetUserByEmail(login.Email);

            var token = AutenticadorService.GerarToken(usuario.Email, usuario.Id, usuario.TipoUsuarioId);

            return Ok(new UserToken
            {
                Token = token
            });
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, UsuarioDTO usuarioDTO)
        {
            if (id != usuarioDTO.Id)
                return BadRequest("ID do usuário não corresponde.");

            var response = await UserService.UpdateAsync(usuarioDTO);
            if (response.Error != null)
                return StatusCode(response.StatusCode, response.Error);

            dynamic resultado = response.Data;
            var novoUsuario = resultado.Usuario;
            var Mensagem = resultado.Mensagem;

            return Ok(new
            {
                Mensagem = Mensagem,
                Usuario = novoUsuario
            });
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var response = await UserService.DeleteAsync(id);
            if (response.Error != null)
                return StatusCode(response.StatusCode, response.Error);

            return StatusCode(response.StatusCode, response.Data);
        }
    }
}