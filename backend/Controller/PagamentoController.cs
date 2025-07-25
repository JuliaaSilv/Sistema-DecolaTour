using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using agencia.DTOs;
using agencia.Interfaces.Services;
using agencia.Response;
using agencia.Models;
using AutoMapper;

public interface IPagamentoController
{
    Task<ActionResult> BuscarPagamentoPorId(int id);
    Task<ActionResult> CriarPagamento(PagamentoDTO pagamentoDTO);
    
}

[ApiController]
[Route("api/[controller]")]
public class PagamentoController : ControllerBase, IPagamentoController
{
    private readonly IPagamentoService _pagamentoService;

    private IMapper _mapper { get; }

    public PagamentoController(IPagamentoService pagamentoService, IMapper mapper)
    {
        _pagamentoService = pagamentoService;
        _mapper = mapper;
    }

    /// <summary>
    /// Cria um novo pagamento.
    /// </summary>
    [HttpPost]
    [Authorize(Roles = "1,2")]
    public async Task<ActionResult> CriarPagamento([FromBody] PagamentoDTO pagamentoDTO)
    {
        if (pagamentoDTO == null)
            return BadRequest(new ApiResponse(null, new ErrorResponse("Dados do pagamento não informados."), 400));

        try
        {
            var pagamentoCriado = await _pagamentoService.CriarPagamentoAsync(pagamentoDTO);

            return StatusCode(201, _mapper.Map<PagamentoDTO>(pagamentoCriado));
            
        }
        catch (Exception ex)
        {
            return StatusCode(500, new ApiResponse(null, new ErrorResponse("Erro ao criar pagamento: " + ex.Message), 500));
        }
    }

    /// <summary>
    /// Busca um pagamento específico pelo ID.
    /// </summary>
    [HttpGet("{id}")]
    [Authorize(Roles = "1,2")]
    public async Task<ActionResult> BuscarPagamentoPorId(int id)
    {
        var pagamento = await _pagamentoService.BuscarPagamentoPorIdAsync(id);
        if (pagamento == null)
            return NotFound(new ApiResponse(null, new ErrorResponse("Pagamento não encontrado."), 404));

        return Ok(new ApiResponse(pagamento, null, 200));
    }
 /*
    [HttpGet("{idReserva}/reserva")]
    [Authorize(Roles = "1,2")]
    public async Task<ActionResult> BuscarPagamentoDaReserva(int idReserva)
    {
        var pagamento = await _pagamentoService.BuscarPagamentoPorIdAsync(idReserva);
        if (pagamento == null)
            return NotFound(new ApiResponse(null, new ErrorResponse("Pagamento não encontrado."), 404));

        return Ok(new ApiResponse(pagamento, null, 200));
    }
*/
    [HttpPut("{id}")]
    [Authorize(Roles = "1,2")]
    public async Task<ActionResult> AtualizarPagamento(int id, [FromBody] PagamentoDTO pagamentoDTO)
    {
        if (pagamentoDTO == null || id <= 0)
            return BadRequest(new ApiResponse(null, new ErrorResponse("Dados inválidos."), 400));

        var pagamentoAtualizado = await _pagamentoService.AtualizaPagamentoAsync(pagamentoDTO);
        if (pagamentoAtualizado == null)
            return NotFound(new ApiResponse(null, new ErrorResponse("Pagamento não encontrado ou não foi possível atualizar."), 404));

        return Ok(new ApiResponse(pagamentoAtualizado, null, 200));
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "1,2")]
    public async Task<ActionResult> DeletarPagamento(int id)
    {
        if (id <= 0)
            return BadRequest(new ApiResponse(null, new ErrorResponse("ID inválido."), 400));

        var pagamento = await _pagamentoService.BuscarPagamentoPorIdAsync(id);
        if (pagamento == null)
            return NotFound(new ApiResponse(null, new ErrorResponse("Pagamento não encontrado."), 404));

        await _pagamentoService.DeletarPagamentoAsync(id);
        return Ok(new ApiResponse("Pagamento deletado com sucesso.", null, 200));
    }
}