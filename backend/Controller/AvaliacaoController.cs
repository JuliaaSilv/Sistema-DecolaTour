using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using agencia.Interfaces.Services;
using agencia.DTOs;
using agencia.Response;

namespace agencia.Controller
{
    [ApiController]
    [Route("api/[controller]")]
    public class AvaliacaoController : ControllerBase
    {
        private readonly IAvaliacaoService _avaliacaoService;

        public AvaliacaoController(IAvaliacaoService avaliacaoService)
        {
            _avaliacaoService = avaliacaoService;
        }

        // Cria uma nova avaliação para uma reserva
        [HttpPost]
        [Authorize(Roles = "2")] // Apenas viajantes podem criar avaliações
        public async Task<ActionResult> CriarAvaliacao([FromBody] AvaliacaoDTO avaliacaoDTO)
        {
            if (avaliacaoDTO == null)
                return BadRequest(new ApiResponse(null, new ErrorResponse("Dados da avaliação não informados!"), 400));

            var response = await _avaliacaoService.CriarAvaliacaoAsync(avaliacaoDTO);

            if (response.Error != null)
                return StatusCode(response.StatusCode, response.Error);

            return StatusCode(response.StatusCode, response.Data);
        }

        // Lista todas as avaliações (apenas para administradores)
        [HttpGet]
        [Authorize(Roles = "1")] // Apenas administradores
        public async Task<ActionResult> ListarAvaliacoes()
        {
            var response = await _avaliacaoService.ListarAvaliacoesAsync();

            if (response.Error != null)
                return StatusCode(response.StatusCode, response.Error);

            return StatusCode(response.StatusCode, response.Data);
        }

        // Busca avaliação por ID
        [HttpGet("{id}")]
        [Authorize(Roles = "1,2")]
        public async Task<ActionResult> BuscarAvaliacaoPorId(int id)
        {
            var response = await _avaliacaoService.BuscarAvaliacaoPorIdAsync(id);

            if (response.Error != null)
                return StatusCode(response.StatusCode, response.Error);

            return StatusCode(response.StatusCode, response.Data);
        }


        // Lista avaliações de um pacote específico
      
        [HttpGet("pacote/{pacoteId}")]
        [AllowAnonymous] // Qualquer pessoa pode ver avaliações de pacotes
        public async Task<ActionResult> ListarAvaliacoesPorPacote(int pacoteId)
        {
            var response = await _avaliacaoService.ListarAvaliacoesPorPacoteAsync(pacoteId);

            if (response.Error != null)
                return StatusCode(response.StatusCode, response.Error);

            return StatusCode(response.StatusCode, response.Data);
        }

       
        // Lista avaliações de uma reserva específica
        [HttpGet("reserva/{reservaId}")]
        [Authorize(Roles = "1,2")]
        public async Task<ActionResult> ListarAvaliacoesPorReserva(int reservaId)
        {
            var response = await _avaliacaoService.ListarAvaliacoesPorReservaAsync(reservaId);

            if (response.Error != null)
                return StatusCode(response.StatusCode, response.Error);

            return StatusCode(response.StatusCode, response.Data);
        }

        // Atualiza uma avaliação existente
        [HttpPut("{id}")]
        [Authorize(Roles = "1,2")]
        public async Task<ActionResult> AtualizarAvaliacao(int id, [FromBody] AvaliacaoDTO avaliacaoDTO)
        {
            if (avaliacaoDTO == null)
                return BadRequest(new ApiResponse(null, new ErrorResponse("Dados da avaliação não informados!"), 400));

            var response = await _avaliacaoService.AtualizarAvaliacaoAsync(id, avaliacaoDTO);

            if (response.Error != null)
                return StatusCode(response.StatusCode, response.Error);

            return StatusCode(response.StatusCode, response.Data);
        }

        // Remove uma avaliação
        [HttpDelete("{id}")]
        [Authorize(Roles = "1")] // Apenas administradores podem deletar
        public async Task<ActionResult> RemoverAvaliacao(int id)
        {
            var response = await _avaliacaoService.RemoverAvaliacaoAsync(id);

            if (response.Error != null)
                return StatusCode(response.StatusCode, response.Error);

            return StatusCode(response.StatusCode, response.Data);
        }

        // Calcula a média de avaliações de um pacote
        [HttpGet("media/{pacoteId}")]
        [AllowAnonymous]
        public async Task<ActionResult> CalcularMediaAvaliacoes(int pacoteId)
        {
            var response = await _avaliacaoService.CalcularMediaAvaliacoesAsync(pacoteId);

            if (response.Error != null)
                return StatusCode(response.StatusCode, response.Error);

            return StatusCode(response.StatusCode, response.Data);
        }
    }
}
