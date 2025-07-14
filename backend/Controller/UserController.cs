using Microsoft.AspNetCore.Mvc;
using agencia.Models;
using agencia.Data;
using agencia.Response;
using Microsoft.AspNetCore.Mvc.ApiExplorer;
using InterfaceService;

namespace agencia.Controller
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private IUserService UserService { get; }

        public UserController(IUserService userService)
        {
            UserService = userService;
        }

        [HttpPost]
        public async Task<ActionResult<ApiResponseFormat>> Post([FromBody] Usuario usuario)
        {
            var response = await UserService.RegisterAsync(usuario);
            return StatusCode(response.StatusCode, response);

        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Usuario>> GetById(int id)
    {
        var usuario = await UserService.GetByIdAsync(id);
        if (usuario == null)
        return NotFound();
        return Ok(usuario);
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Usuario>>> GetAll()
    {
    var usuarios = await UserService.GetAllAsync();
    return Ok(usuarios);
    }

    }
}