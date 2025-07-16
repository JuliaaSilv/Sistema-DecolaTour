using agencia.Models;
using agencia.Response;
using agencia.Repository;
using InterfaceService;
using BCrypt.Net;
using AutoMapper;
using agencia.Dto.Write;

namespace agencia.Service
{
    public class UserService : IUserService
    {
        private readonly IUserRepository _repository;

        public UserService(IUserRepository repository)
        {
            _repository = repository;
        }






        public async Task<IEnumerable<Usuario>> GetAllAsync()
        {
            return await _repository.GetAllAsync();
        }

        public async Task<Usuario?> GetByIdAsync(int id)
        {
            return await _repository.GetByIdAsync(id);
        }

        public async Task<ApiResponse> RegisterAsync(Usuario usuario)
        {
            if (string.IsNullOrWhiteSpace(usuario.Nome) ||
                string.IsNullOrWhiteSpace(usuario.Email) ||
                string.IsNullOrWhiteSpace(usuario.Senha) ||
                string.IsNullOrWhiteSpace(usuario.Cpf) ||
                string.IsNullOrWhiteSpace(usuario.Telefone))
            {
                return new ApiResponse(null, new ErrorResponse("Todos os campos obrigatórios devem ser preenchidos."), 400);
            }

            if (await _repository.CpfExistsAsync(usuario.Cpf))
            {
                return new ApiResponse(null, new ErrorResponse("CPF já cadastrado."), 409);
            }

            usuario.Senha = BCrypt.Net.BCrypt.HashPassword(usuario.Senha);
            var novoUsuario = await _repository.AddAsync(usuario);

            return new ApiResponse(novoUsuario, null, 201);
        }
    }

}