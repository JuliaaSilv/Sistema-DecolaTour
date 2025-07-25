 using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using agencia.Response;
using agencia.Service;
using agencia.Interfaces.Services; 
using agencia.DTOs;               
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

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
        public async Task<ActionResult> CriarReserva([FromBody] ReservaDTO reservaDTO)
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
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult> ListarReservas()
        {
            var reservas = await ReservaService.ListarReservasAsync();
            if (reservas == null || !reservas.Any())
                return NotFound(new ApiResponse(null, new ErrorResponse("Nenhuma reserva encontrada."), 404));

            return Ok(new ApiResponse(reservas, null, 200));
        }

       
        /// Busca uma reserva específica pelo ID (apenas para administradores).
        [HttpGet("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult> BuscarReservaPorId(int id)
        {
            var reserva = await ReservaService.BuscarReservaPorIdAsync(id);
            if (reserva == null)
                return NotFound(new ApiResponse(null, new ErrorResponse("Reserva não encontrada."), 404));

            return Ok(new ApiResponse(reserva, null, 200));
        }

        
        /// Atualiza o status de uma reserva (apenas para administradores).
        [HttpPatch("{id}/status")]
        [Authorize(Roles = "Admin")]
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
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult> DeletarReserva(int id)
        {
            var response = await ReservaService.DeletarReservaAsync(id);
            if (response.Error != null)
                return StatusCode(response.StatusCode, response.Error);

            return Ok(response);
        }
      
    }
} 