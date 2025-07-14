using agencia.Models;
using agencia.Response;
using agencia.Repository;
using InterfaceService;
using BCrypt.Net;

namespace agencia.Service
{
    public class UserService : IUserService
    {
        private IUserRepository Repository { get; }

        public UserService(IUserRepository repository)
        {
            Repository = repository;
        }

        public async Task<ApiResponse> RegisterAsync(Usuario usuario)
        {
            var exists = await Repository.CpfExistsAsync(usuario.Cpf);
            if (exists)
            {
                return new ApiResponse(null, new ErrorResponse("CPF já cadastrado."), 409);
            }

            usuario.Senha = BCrypt.Net.BCrypt.HashPassword(usuario.Senha);


            var novoUsuario = await Repository.AddAsync(usuario);

            return new ApiResponse(novoUsuario, null, 201);
        }
        public async Task<Usuario?> GetByIdAsync(int id)
        {
            return await Repository.GetByIdAsync(id);
        }

        public async Task<IEnumerable<Usuario>> GetAllAsync()
        {
            return await Repository.GetAllAsync();
        }
    }

}