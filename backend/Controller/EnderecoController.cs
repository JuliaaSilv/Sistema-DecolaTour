using agencia.DTOs;
using agencia.Interfaces.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace agencia.Controller
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "1,2,3")]
    public class EnderecoController : ControllerBase
    {
        private readonly IEnderecoService _enderecoService;

        public EnderecoController(IEnderecoService enderecoService)
        {
            _enderecoService = enderecoService;
        }

        [HttpGet]
        public async Task<ActionResult> GetEnderecos()
        {
            var usuarioId = ObterUsuarioIdDoToken();
            if (usuarioId == 0)
                return Unauthorized("Token inválido ou usuário não encontrado.");

            var response = await _enderecoService.GetByUsuarioIdAsync(usuarioId);
            if (response.Error != null)
                return StatusCode(response.StatusCode, response.Error);

            return Ok(response.Data);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult> GetEndereco(int id)
        {
            var response = await _enderecoService.GetByIdAsync(id);
            if (response.Error != null)
                return StatusCode(response.StatusCode, response.Error);

            return Ok(response.Data);
        }

        [HttpPost]
        public async Task<ActionResult> CreateEndereco(CreateEnderecoDTO createEnderecoDTO)
        {
            var usuarioId = ObterUsuarioIdDoToken();
            if (usuarioId == 0)
                return Unauthorized("Token inválido ou usuário não encontrado.");

            var response = await _enderecoService.CreateAsync(usuarioId, createEnderecoDTO);
            if (response.Error != null)
                return StatusCode(response.StatusCode, response.Error);

            return StatusCode(response.StatusCode, response.Data);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> UpdateEndereco(int id, UpdateEnderecoDTO updateEnderecoDTO)
        {
            var usuarioId = ObterUsuarioIdDoToken();
            if (usuarioId == 0)
                return Unauthorized("Token inválido ou usuário não encontrado.");

            if (id != updateEnderecoDTO.Id)
                return BadRequest("ID do endereço não corresponde.");

            var response = await _enderecoService.UpdateAsync(usuarioId, updateEnderecoDTO);
            if (response.Error != null)
                return StatusCode(response.StatusCode, response.Error);

            return Ok(response.Data);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteEndereco(int id)
        {
            var usuarioId = ObterUsuarioIdDoToken();
            if (usuarioId == 0)
                return Unauthorized("Token inválido ou usuário não encontrado.");

            var response = await _enderecoService.DeleteAsync(usuarioId, id);
            if (response.Error != null)
                return StatusCode(response.StatusCode, response.Error);

            return Ok(new { mensagem = "Endereço removido com sucesso" });
        }

        private int ObterUsuarioIdDoToken()
        {
            var idClaim = User?.Claims?.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;

            if (int.TryParse(idClaim, out var id))
                return id;

            return 0;
        }
    }
}
