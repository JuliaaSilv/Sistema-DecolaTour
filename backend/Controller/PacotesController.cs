using agencia.DTOs;
using agencia.Interfaces.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;

[ApiController]
[Route("api/[controller]")]
public class PacoteController : ControllerBase
{
    private readonly IPacoteService _service;

    public PacoteController(IPacoteService service)
    {
        _service = service;
    }

    [HttpGet]
    [SwaggerOperation(Summary = "Lista todos os pacotes dispon�veis")]
    public async Task<IActionResult> Listar()
    {
        var pacotes = await _service.ListarPacotesAsync();
        return Ok(pacotes);
    }

    [HttpGet("{id}")]
    [SwaggerOperation(Summary = "Busca pacote por ID")]
    public async Task<IActionResult> BuscarPorId(int id)
    {
        var pacote = await _service.BuscarDetalhesAsync(id);
        return pacote == null ? NotFound() : Ok(pacote);
    }

    [HttpPost("cadastrar-simples")]
    [Authorize(Roles = "1,2")]
    [SwaggerOperation(Summary = "Cadastra um novo pacote (dados simples)")]
    public async Task<IActionResult> CadastrarSimples([FromForm] CreatePacoteDTO dto)
    {
        try
        {
            // Debug: verificar claims do usuário
            var userRole = User.FindFirst(System.Security.Claims.ClaimTypes.Role)?.Value;
            Console.WriteLine($"Role do usuário: {userRole}");

            await _service.CadastrarSimplesAsync(dto);
            return Ok(new { message = "Pacote cadastrado com sucesso!" });
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Erro no controller: {ex.Message}");
            Console.WriteLine($"Stack trace: {ex.StackTrace}");
            return BadRequest(new { message = $"Erro ao cadastrar pacote: {ex.Message}" });
        }
    }

    [HttpPost("buscar")]
    [SwaggerOperation(Summary = "Busca pacotes com filtros")]
    public async Task<IActionResult> BuscarComFiltro([FromBody] FiltroPacoteDTO dto)
    {
        var resultado = await _service.BuscarComFiltroAsync(dto);
        return Ok(resultado);
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "1,2")]
    [SwaggerOperation(Summary = "Atualiza um pacote existente")]
    public async Task<ActionResult> Atualizar(int id, [FromForm] PacoteUploadDTO dto)
    {
        try
        {
            // Verifica se o modelo é válido
            if (!ModelState.IsValid)
            {
                var errors = ModelState
                    .Where(x => x.Value?.Errors?.Count > 0)
                    .Select(x => new { 
                        Field = x.Key, 
                        Errors = x.Value?.Errors?.Select(e => e.ErrorMessage ?? string.Empty).ToArray() ?? new string[0]
                    })
                    .ToArray();
                
                return BadRequest(new { 
                    message = "Dados inválidos", 
                    errors = errors 
                });
            }

            await _service.AtualizarAsync(id, dto);
            return Ok(new { message = "Pacote atualizado com sucesso!" });
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Erro ao atualizar pacote: {ex.Message}");
            Console.WriteLine($"Stack trace: {ex.StackTrace}");
            return BadRequest(new { message = $"Erro ao atualizar pacote: {ex.Message}" });
        }
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "1,2")]
    [SwaggerOperation(Summary = "Remove um pacote")]
    public async Task<ActionResult> Remover(int id)
    {
        try
        {
            await _service.RemoverAsync(id);
            return Ok(new { message = "Pacote removido com sucesso!" });
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Erro ao remover pacote: {ex.Message}");
            return BadRequest(new { message = $"Erro ao remover pacote: {ex.Message}" });
        }
    }
    [HttpGet("categorias")]
    public async Task<IActionResult> ListarCategorias()
    {
        var pacotes = await _service.ListarPacotesAsync();
        var categorias = pacotes
            .SelectMany(p => p.Categorias.Split(',', StringSplitOptions.RemoveEmptyEntries))
            .Distinct()
            .ToList();
        return Ok(categorias);
    }

    [HttpGet("galeria/tamanhos")]
    [SwaggerOperation(Summary = "Retorna os tamanhos das imagens do mosaico da galeria")]
    public IActionResult ObterTamanhosMosaico()
    {
        var tamanhos = agencia.Service.ImageProcessingService.GetMosaicSizes();
        return Ok(tamanhos);
    }

    [HttpGet("historico/{pacoteId}")]
    public async Task<IActionResult> ObterHistorico(int pacoteId)
    {
        var historico = await _service.ListarHistoricoPorPacoteIdAsync(pacoteId);
        return Ok(historico);
    }
}