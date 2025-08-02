using agencia.DTOs;
using agencia.Interfaces.Services;
using agencia.Response;
using agencia.Service;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace agencia.Controller
{
    [ApiController]
    [Route("api/[controller]")]
    public class ReservaController : ControllerBase
    {
        private IReservaService ReservaService { get; }
        private IPacoteService PacoteService { get; }

        public ReservaController(IReservaService reservaService, IPacoteService pacoteService)
        {
            ReservaService = reservaService;
            PacoteService = pacoteService;
        }

        /// Cria uma nova reserva.
        [HttpPost]
        [Authorize(Roles = "1,2")]
        public async Task<ActionResult> CriarReserva([FromBody] CreateReservaDTO reservaDTO)
        {
            if (reservaDTO == null)
                return BadRequest(new ApiResponse(null, new ErrorResponse("Dados da reserva não informados!"), 400));

            var response = await ReservaService.CriarReservaAsync(reservaDTO);

            if (response.Error != null)
                return StatusCode(response.StatusCode, response.Error);

            return StatusCode(response.StatusCode, response.Data);
        }

        /// Lista todas as reservas do sistema (apenas para administradores).
        [HttpGet]
        [Authorize(Roles = "2")]
        public async Task<ActionResult> ListarReservas()
        {
            var reservas = await ReservaService.ListarReservasAsync();
            if (reservas == null || !reservas.Any())
                return NotFound(new ApiResponse(null, new ErrorResponse("Nenhuma reserva encontrada."), 404));

            return Ok(new ApiResponse(reservas, null, 200));
        }

        // Adicionado para tela de administrador.
        // Lista todas as reservas juntamente com alguns dados associados como pagamento, cliente (apenas para administradores e atendentes).
        [HttpGet("/api/Reserva/lista-completa")]
        [Authorize(Roles = "1,2")]
        public async Task<ActionResult> ListarCompletaDeReservas()
        {
            var reservas = await ReservaService.ListaCompletaDeReservasAsync();
            if (reservas == null || !reservas.Any())
                return NotFound(new ApiResponse(null, new ErrorResponse("Nenhuma reserva encontrada."), 404));

            return Ok(new ApiResponse(reservas, null, 200));
        }

        /// Busca uma reserva específica pelo ID (apenas para administradores).
        [HttpGet("{id}")]
        [Authorize(Roles = "1")]
        public async Task<ActionResult> BuscarReservaPorId(int id)
        {
            var reserva = await ReservaService.BuscarReservaPorIdAsync(id);
            if (reserva == null)
                return NotFound(new ApiResponse(null, new ErrorResponse("Reserva não encontrada."), 404));

            return Ok(new ApiResponse(reserva, null, 200));
        }


        /// Atualiza o status de uma reserva (apenas para administradores).
        [HttpPatch("{id}/status")]
        [Authorize(Roles = "1")]
        public async Task<ActionResult> AtualizarStatus(int id, [FromBody] AtualizarStatusReservaDTO dto)
        {
            if (dto == null || string.IsNullOrWhiteSpace(dto.NovoStatus))
                return BadRequest(new ApiResponse(null, new ErrorResponse("Status não informado."), 400));

            var response = await ReservaService.AtualizarStatusAsync(id, dto.NovoStatus);

            if (response.Error != null)
                return StatusCode(response.StatusCode, response.Error);

            return Ok(response);
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "1")]
        public async Task<ActionResult> DeletarReserva(int id)
        {
            var response = await ReservaService.DeletarReservaAsync(id);
            if (response.Error != null)
                return StatusCode(response.StatusCode, response.Error);

            return Ok(response);
        }

        [HttpGet("minhas")]
        public async Task<IActionResult> MinhasReservas()
        {
            var usuarioId = ObterUsuarioIdDoToken();
            if (usuarioId <= 0)
                return Unauthorized();

            var reservas = await ReservaService.ListarMinhasReservasAsync(usuarioId);
            return Ok(reservas);
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