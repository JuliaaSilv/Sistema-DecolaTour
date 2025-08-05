using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using agencia.Interfaces.Services;
using agencia.DTOs;
using agencia.Response;
using System.Security.Claims;
using System.Linq;

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
        [Authorize] // Qualquer usuário logado pode tentar criar avaliação (validação no service)
        public async Task<ActionResult> CriarAvaliacao([FromBody] CreateAvaliaçãoDTO createAvaliacaoDTO)
        {
            if (createAvaliacaoDTO == null)
                return BadRequest(new ApiResponse(null, new ErrorResponse("Dados da avaliação não informados!"), 400));

            // Obtém o ID do usuário autenticado
            var usuarioId = ObterUsuarioIdDoToken();

            if (usuarioId == 0)
                return Unauthorized("Token inválido ou usuário não encontrado.");

            // Converte CreateAvaliacaoDTO para AvaliacaoDTO
            var avaliacaoDTO = new AvaliacaoDTO
            {
                Comentario = createAvaliacaoDTO.Comentario,
                Nota = createAvaliacaoDTO.Nota,
                ReservaId = createAvaliacaoDTO.ReservaId,
                Data = DateTime.Now
            };

            var response = await _avaliacaoService.CriarAvaliacaoAsync(avaliacaoDTO, usuarioId);

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
        [Authorize(Roles = "1,3")]
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
        public async Task<ActionResult> ListarAvaliacoesPorReserva(int reservaId)
        {
            var response = await _avaliacaoService.ListarAvaliacoesPorReservaAsync(reservaId);

            if (response.Error != null)
                return StatusCode(response.StatusCode, response.Error);

            return StatusCode(response.StatusCode, response.Data);
        }

        // Atualiza uma avaliação existente
        [HttpPut("{id}")]
        [Authorize(Roles = "1")]
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

        // Verifica se o usuário logado pode avaliar um pacote específico
        [HttpGet("pode-avaliar/{pacoteId}")]
        [Authorize] // Qualquer usuário logado pode verificar se pode avaliar
        public async Task<ActionResult> VerificarSeUsuarioPodeAvaliarPacote(int pacoteId)
        {
            // Obtém o ID do usuário autenticado
            var usuarioId = ObterUsuarioIdDoToken();

            if (usuarioId == 0)
                return Unauthorized("Token inválido ou usuário não encontrado.");

            var response = await _avaliacaoService.VerificarSeUsuarioPodeAvaliarPacoteAsync(pacoteId, usuarioId);

            if (response.Error != null)
                return StatusCode(response.StatusCode, response.Error);

            return StatusCode(response.StatusCode, response.Data);
        }

        // Endpoints para moderação - apenas administradores
        [HttpGet("pendentes")]
        [Authorize(Roles = "1")] // Apenas administradores
        public async Task<ActionResult> ListarAvaliacoesPendentes()
        {
            var response = await _avaliacaoService.ListarAvaliacoesPendentesAsync();

            if (response.Error != null)
                return StatusCode(response.StatusCode, response.Error);

            return StatusCode(response.StatusCode, response.Data);
        }

        [HttpPut("aprovar/{avaliacaoId}")]
        [Authorize(Roles = "1")] // Apenas administradores
        public async Task<ActionResult> AprovarAvaliacao(int avaliacaoId)
        {
            var response = await _avaliacaoService.AprovarAvaliacaoAsync(avaliacaoId);

            if (response.Error != null)
                return StatusCode(response.StatusCode, response.Error);

            return StatusCode(response.StatusCode, response.Data);
        }

        [HttpPut("rejeitar/{avaliacaoId}")]
        [Authorize(Roles = "1")] // Apenas administradores
        public async Task<ActionResult> RejeitarAvaliacao(int avaliacaoId)
        {
            var response = await _avaliacaoService.RejeitarAvaliacaoAsync(avaliacaoId);

            if (response.Error != null)
                return StatusCode(response.StatusCode, response.Error);

            return StatusCode(response.StatusCode, response.Data);
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
