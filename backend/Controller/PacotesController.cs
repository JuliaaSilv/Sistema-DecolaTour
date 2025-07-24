using agencia.DTOs;
using agencia.Interfaces.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

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
    public async Task<IActionResult> Listar()
    {
        var pacotes = await _service.ListarPacotesAsync();
        return Ok(pacotes);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> BuscarPorId(int id)
    {
        var pacote = await _service.BuscarDetalhesAsync(id);
        return pacote == null ? NotFound() : Ok(pacote);
    }

    [HttpPost]
    [Authorize(Roles = "1")]
    public async Task<IActionResult> Cadastrar([FromForm] PacoteUploadDTO dto)
    {
        await _service.CadastrarAsync(dto);
        return Ok("Pacote cadastrado com sucesso!");
    }

    [HttpPost("buscar")]
    public async Task<IActionResult> BuscarComFiltro([FromBody] FiltroPacoteDTO dto)
    {
        var resultado = await _service.BuscarComFiltroAsync(dto);
        return Ok(resultado);
    }
}
