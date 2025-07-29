using agencia.DTOs;
using agencia.Interfaces.Services;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace agencia.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    /// <summary>
    /// Controller responsável pelos endpoints de Viajante (CRUD).
    /// </summary>
    public class ViajanteController : ControllerBase
    {
        private readonly IViajanteService _service;

        /// <summary>
        /// Injeta o serviço de viajante.
        /// </summary>
        public ViajanteController(IViajanteService service)
        {
            _service = service;
        }

        [HttpGet]
        /// <summary>
        /// Retorna todos os viajantes cadastrados.
        /// </summary>
        public async Task<IActionResult> GetAll()
        {
            var viajantes = await _service.GetAllAsync();
            return Ok(viajantes);
        }

        [HttpGet("{id}")]
        /// <summary>
        /// Busca um viajante pelo ID.
        /// </summary>
        public async Task<IActionResult> GetById(int id)
        {
            var viajante = await _service.GetByIdAsync(id);
            if (viajante == null) return NotFound();
            return Ok(viajante);
        }

        [HttpPost]
        /// <summary>
        /// Cria um novo viajante.
        /// </summary>
        public async Task<IActionResult> Create([FromBody] ViajanteDTO viajanteDTO)
        {
            await _service.AddAsync(viajanteDTO);
            return CreatedAtAction(nameof(GetById), new { id = viajanteDTO.Id }, viajanteDTO);
        }
        [HttpPut("{id}")]
        /// <summary>
        /// Atualiza um viajante existente.
        /// </summary>
        public async Task<IActionResult> Update(int id, [FromBody] ViajanteDTO viajanteDTO)
        {
            viajanteDTO.Id = id;
            await _service.UpdateAsync(viajanteDTO);
            return NoContent();
        }


        [HttpDelete("{id}")]
        /// <summary>
        /// Remove um viajante pelo ID.
        /// </summary>
        public async Task<IActionResult> Delete(int id)
        {
            await _service.DeleteAsync(id);
            return NoContent();
        }
    }
}