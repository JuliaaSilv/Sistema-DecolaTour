using agencia.DTOs;
using agencia.Interfaces.Services;
using InterfaceService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;

namespace agencia.Controller
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;

        public UserController(IUserService userService)
        {
            _userService = userService;
        }

        [Authorize(Roles = "1,2,3")]
        [HttpGet("Listar Todos Usuário")]
        public async Task<ActionResult<IEnumerable<UsuarioDTO>>> GetAll()
        {
            var usuarios = await _userService.GetAllAsync();
            return Ok(usuarios);
        }

        [Authorize(Roles = "1,2,3")]
        [HttpGet("{id}")]
        public async Task<ActionResult<UsuarioDTO>> GetById(int id)
        {
            var usuario = await _userService.GetByIdAsync(id);
            if (usuario == null)
                return NotFound();
            return Ok(usuario);
        }

        [Authorize(Roles = "1,2,3")]
        [HttpGet("perfil")]
        public async Task<ActionResult<UsuarioDTO>> GetProfile()
        {
            var usuarioId = ObterUsuarioIdDoToken();
            if (usuarioId == 0)
                return Unauthorized("Token inválido ou usuário não encontrado.");

            var usuario = await _userService.GetByIdAsync(usuarioId);
            if (usuario == null)
                return NotFound("Usuário não encontrado.");
            
            return Ok(usuario);
        }
        [Authorize(Roles = "1,2,3")]
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, UsuarioDTO usuarioDTO)
        {
            if (id != usuarioDTO.Id)
                return BadRequest("ID do usuário não corresponde.");

            var response = await _userService.UpdateAsync(usuarioDTO);
            if (response.Error != null)
                return StatusCode(response.StatusCode, response.Error);

            dynamic resultado = response.Data;
            var novoUsuario = resultado.Usuario;
            var mensagem = resultado.Mensagem;

            return Ok(new
            {
                Mensagem = mensagem,
                Usuario = novoUsuario
            });
        }
        [Authorize(Roles = "1,2")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var response = await _userService.DeleteAsync(id);
            if (response.Error != null)
                return StatusCode(response.StatusCode, response.Error);

            return StatusCode(response.StatusCode, response.Data);
        }

        private int ObterUsuarioIdDoToken()
        {
            var idClaim = User?.Claims?.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;

            if (int.TryParse(idClaim, out var id))
                return id;

            return 0; // ou lançar exceção se preferir
        }
    }
}
