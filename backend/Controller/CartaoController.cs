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
    public class CartaoController : ControllerBase
    {
        private readonly ICartaoService _cartaoService;

        public CartaoController(ICartaoService cartaoService)
        {
            _cartaoService = cartaoService;
        }

        [HttpGet]
        public async Task<ActionResult> GetCartoes()
        {
            var usuarioId = ObterUsuarioIdDoToken();
            if (usuarioId == 0)
                return Unauthorized("Token inválido ou usuário não encontrado.");

            var response = await _cartaoService.GetByUsuarioIdAsync(usuarioId);
            if (response.Error != null)
                return StatusCode(response.StatusCode, response.Error);

            return Ok(response.Data);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult> GetCartao(int id)
        {
            var response = await _cartaoService.GetByIdAsync(id);
            if (response.Error != null)
                return StatusCode(response.StatusCode, response.Error);

            return Ok(response.Data);
        }

        [HttpGet("{id}/for-payment")]
        public async Task<ActionResult> GetCartaoForPayment(int id)
        {
            var usuarioId = ObterUsuarioIdDoToken();
            if (usuarioId == 0)
                return Unauthorized("Token inválido ou usuário não encontrado.");

            var response = await _cartaoService.GetByIdForPaymentAsync(id, usuarioId);
            if (response.Error != null)
                return StatusCode(response.StatusCode, response.Error);

            return Ok(response.Data);
        }

        [HttpPost]
        public async Task<ActionResult> CreateCartao(CreateCartaoDTO createCartaoDTO)
        {
            var usuarioId = ObterUsuarioIdDoToken();
            if (usuarioId == 0)
                return Unauthorized("Token inválido ou usuário não encontrado.");

            var response = await _cartaoService.CreateAsync(usuarioId, createCartaoDTO);
            if (response.Error != null)
                return StatusCode(response.StatusCode, response.Error);

            return StatusCode(response.StatusCode, response.Data);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> UpdateCartao(int id, UpdateCartaoDTO updateCartaoDTO)
        {
            var usuarioId = ObterUsuarioIdDoToken();
            if (usuarioId == 0)
                return Unauthorized("Token inválido ou usuário não encontrado.");

            if (id != updateCartaoDTO.Id)
                return BadRequest("ID do cartão não corresponde.");

            var response = await _cartaoService.UpdateAsync(usuarioId, updateCartaoDTO);
            if (response.Error != null)
                return StatusCode(response.StatusCode, response.Error);

            return Ok(response.Data);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteCartao(int id)
        {
            var usuarioId = ObterUsuarioIdDoToken();
            if (usuarioId == 0)
                return Unauthorized("Token inválido ou usuário não encontrado.");

            var response = await _cartaoService.DeleteAsync(usuarioId, id);
            if (response.Error != null)
                return StatusCode(response.StatusCode, response.Error);

            return Ok(new { mensagem = "Cartão removido com sucesso" });
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
