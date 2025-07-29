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
    [Authorize(Roles = "1")]
    [SwaggerOperation(Summary = "Cadastra um novo pacote (dados simples)")]
    public async Task<IActionResult> CadastrarSimples([FromBody] CreatePacoteDTO dto)
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
    [SwaggerOperation(Summary = "Atualiza um pacote existente")]
    public async Task<ActionResult> Atualizar(int id, [FromForm] PacoteUploadDTO dto)
    {
        await _service.AtualizarAsync(id, dto);
        return Ok();
    }

    [HttpDelete("{id}")]
    [SwaggerOperation(Summary = "Remove um pacote")]
    public async Task<ActionResult> Remover(int id)
    {
        await _service.RemoverAsync(id);
        return Ok();
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
}
