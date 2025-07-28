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
    [SwaggerOperation(Summary = "Lista todos os pacotes disponíveis")]
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

    [HttpPost]
    [Authorize(Roles = "1")]
    [SwaggerOperation(Summary = "Cadastra um novo pacote")]
    public async Task<IActionResult> Cadastrar([FromForm] PacoteUploadDTO dto)
    {
        await _service.CadastrarAsync(dto);
        return Ok("Pacote cadastrado com sucesso!");
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
