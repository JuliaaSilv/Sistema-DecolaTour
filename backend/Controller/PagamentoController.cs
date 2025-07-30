using agencia.DTOs;
using agencia.Interfaces.Services;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;

namespace agencia.Controller
{
    [ApiController]
    [Route("api/[controller]")]
    public class PagamentoController : ControllerBase
    {
        private readonly IPagamentoService _pagamentoService;
        private readonly IMapper _mapper;

        public PagamentoController(IPagamentoService pagamentoService, IMapper mapper)
        {
            _pagamentoService = pagamentoService;
            _mapper = mapper;
        }

        /// Busca um pagamento por ID
        [HttpGet("{id}")]
        public async Task<IActionResult> GetPagamentoById(int id)
        {
            var pagamento = await _pagamentoService.GetPagamentoByIdAsync(id);
            if (pagamento == null) return NotFound();
            return Ok(pagamento);
        }

        /// Lista todos os pagamentos de uma reserva
        [HttpGet("reserva/{reservaId}")]
        public async Task<IActionResult> GetPagamentosByReserva(int reservaId)
        {
            var pagamentos = await _pagamentoService.GetPagamentosByReservaAsync(reservaId);
            return Ok(pagamentos);
        }

        /// Lista todos os pagamentos
        [HttpGet]
        [Authorize(Roles = "1,2")]
        public async Task<IActionResult> GetAllPagamentos()
        {
            var pagamentos = await _pagamentoService.GetAllPagamentosAsync();
            return Ok(pagamentos);
        }

        /// Cria um novo pagamento.
        [HttpPost]
        public async Task<IActionResult> CriarPagamento([FromBody] PagamentoRequestDTO dto)
        {
            try
            {
                var pagamento = await _pagamentoService.CriarPagamentoAsync(dto);
                // Mapeia para DTO para evitar ciclo de serialização
                var pagamentoDTO = _mapper.Map<PagamentoDTO>(pagamento);
                return Ok(pagamentoDTO);
            }
            catch (Exception ex)
            {
                return BadRequest(new { erro = ex.Message });
            }
        }

        [HttpPost("webhook")]
        public async Task<IActionResult> Webhook([FromBody] dynamic data)
        {
            string pagamentoId = data.data.id;
            string status = data.data.status;
            await _pagamentoService.AtualizarStatusPagamentoAsync(pagamentoId, status);
            return Ok();
        }
    }
}