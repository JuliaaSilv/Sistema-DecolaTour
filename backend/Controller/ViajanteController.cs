using agencia.Models;
using agencia.Services;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace agencia.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ViajanteController : ControllerBase
    {
        private readonly ViajanteService _service;

        public ViajanteController(ViajanteService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var viajantes = await _service.ListarTodosAsync();
            return Ok(viajantes);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var viajante = await _service.BuscarPorIdAsync(id);
            if (viajante == null) return NotFound();
            return Ok(viajante);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] Viajante viajante)
        {
            await _service.AdicionarAsync(viajante);
            return CreatedAtAction(nameof(GetById), new { id = viajante.Id }, viajante);
        }
        [HttpPut("{id}")]
public async Task<IActionResult> Update(int id, [FromBody] Viajante viajante)
{
    if (id != viajante.Id) return BadRequest();
    await _service.AtualizarAsync(viajante);
    return NoContent();
}

[HttpDelete("{id}")]
public async Task<IActionResult> Delete(int id)
{
    await _service.RemoverAsync(id);
    return NoContent();
}
    }
}