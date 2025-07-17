using agencia.Data;
using agencia.Dto.Write;
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


        private readonly IAutenticador _autenticadorService;
        private IUserService _userService;

        public UserController(IAutenticador autenticadorService, IUserService userService)
        {
            _autenticadorService = autenticadorService;
            _userService = userService;
        }

        [HttpPost("registrar")]
        public async Task<ActionResult<UserToken>> Incluir(Usuario usuarioDTO)
        {
            if (usuarioDTO == null)
            {
                return BadRequest("Usu�rio n�o pode ser nulo.");
            }

            var emailExists = await _autenticadorService.UserExiste(usuarioDTO.Email);
            if (emailExists)
            {
                return BadRequest("Email já cadastrado.");
            }

            // Define o tipo de usuário padrão como "Cliente" (ID = 1)
            usuarioDTO.TipoUsuarioId = 1;

            var response = await _userService.RegisterAsync(usuarioDTO);
            if (response.Error != null)
            {
                return StatusCode(response.StatusCode, response.Error);
            }

            var novoUsuario = (Usuario)response.Data;
            var token = _autenticadorService.GerarToken(
                novoUsuario.Email,
                novoUsuario.Id,
                novoUsuario.TipoUsuarioId

            );

            return Ok(new UserToken
            {
                Token = token
            });
        }

      
        [HttpGet("{id}")]
        public async Task<ActionResult<Usuario>> GetById(int id)
        {
            var usuario = await _userService.GetByIdAsync(id);
            if (usuario == null)
                return NotFound();
            return Ok(usuario);
        }


        [HttpGet]
        public async Task<ActionResult<IEnumerable<Usuario>>> GetAll()
        { 
            var usuarios = await _userService.GetAllAsync();
            return Ok(usuarios);
        }
        [HttpPost("login")]
        public async Task<ActionResult<UserToken>> Selecionar(Login login)
        {


            var existeUsuario = await _autenticadorService.UserExiste(login.Email);
            if (!existeUsuario)
            {
                return NotFound("Usu�rio n�o encontrado.");
            }

            var result = await _autenticadorService.AutenticarAsync(login.Email, login.Senha);
            if (!result)
            {
                return Unauthorized("Email ou senha inv�lidos.");
            }

            var usuario = await _autenticadorService.GetUserByEmail(login.Email);

            var token = _autenticadorService.GerarToken(usuario.Email, usuario.Id, usuario.TipoUsuarioId);

            return Ok(new UserToken
            {
                Token = token
            });
        }
    }
}