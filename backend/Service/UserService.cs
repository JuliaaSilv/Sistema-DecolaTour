using agencia.Models;
using agencia.Response;
using agencia.Repository;
using InterfaceService;
using BCrypt.Net;
using AutoMapper;
using agencia.DTOs;

namespace agencia.Service
{
    public class UserService : IUserService
    {
        private IUserRepository Repository { get; }
        private IMapper _mapper { get; }
        public UserService(IUserRepository repository, IMapper mapper)
        {
            Repository = repository;
            _mapper = mapper;
        }

        //GetAll, Método buscando todos os usuários
        public async Task<IEnumerable<UsuarioDTO>> GetAllAsync()
        {
            var usuarios = await Repository.GetAllAsync();
            return _mapper.Map<IEnumerable<UsuarioDTO>>(usuarios);
        }


        //GetById, buscando todos usuários por Id.
        public async Task<UsuarioDTO?> GetByIdAsync(int id)
        {
            var usuario = await Repository.GetByIdAsync(id);
            return usuario == null ? null : _mapper.Map<UsuarioDTO>(usuario);
        }


        //Register, criando usuário, juntamente com uma tratativa Response.
        public async Task<ApiResponse> RegisterAsync(UsuarioDTO usuarioDTO)
        {
            if (string.IsNullOrWhiteSpace(usuarioDTO.Nome) ||
                string.IsNullOrWhiteSpace(usuarioDTO.Email) ||
                string.IsNullOrWhiteSpace(usuarioDTO.Senha) ||
                string.IsNullOrWhiteSpace(usuarioDTO.Cpf) ||
                string.IsNullOrWhiteSpace(usuarioDTO.Telefone))
            {
                return new ApiResponse(null, new ErrorResponse("Todos os campos obrigatórios devem ser preenchidos."), 400);
            }

            if (await Repository.CpfExistsAsync(usuarioDTO.Cpf))
            {
                return new ApiResponse(null, new ErrorResponse("CPF já cadastrado."), 409);
            }
            var usuario = _mapper.Map<Usuario>(usuarioDTO);
            usuario.Senha = BCrypt.Net.BCrypt.HashPassword(usuarioDTO.Senha);

            var novoUsuario = await Repository.AddAsync(usuario);
            var novoUsuarioDTO = _mapper.Map<UsuarioDTO>(novoUsuario);

            return new ApiResponse(
                new { Mensagem = "Usuário criado com sucesso", Usuario = novoUsuarioDTO },
                null,
                201
            );
        }


        //Delete, deleta usuário por id.
        public async Task<ApiResponse> DeleteAsync(int id)
        {
            var usuario = await Repository.GetByIdAsync(id);
            if (usuario == null)
            {
                return new ApiResponse(null, new ErrorResponse("Usuário não encontrado."), 404);
            }
            var sucesso = await Repository.DeleteAsync(id);
            if (!sucesso)
            {
                return new ApiResponse(null, new ErrorResponse("Erro ao deletar usuário."), 500);
            }

            var usuarioDTO = _mapper.Map<UsuarioDTO>(usuario);

            return new ApiResponse(
            new { Mensagem = "Usuário deletado com sucesso", Usuario = usuarioDTO },
            null,
            204
            );
        }


        //Update, buscando usuário e atualizando o campo desejado.
        public async Task<ApiResponse> UpdateAsync(UsuarioDTO usuario)
        {
            var usuarioExistente = await Repository.GetByIdAsync(usuario.Id);
            if (usuarioExistente == null)
            {
                return new ApiResponse(null, new ErrorResponse("Usuário não encontrado."), 404);
            }

            _mapper.Map(usuario, usuarioExistente);
            if (!string.IsNullOrWhiteSpace(usuario.Senha))
                usuarioExistente.Senha = BCrypt.Net.BCrypt.HashPassword(usuario.Senha);

            await Repository.UpdateAsync(usuarioExistente);

            var usuarioDTO = _mapper.Map<UsuarioDTO>(usuarioExistente);

            return new ApiResponse(
                new { Mensagem = "Usuário atualizado com sucesso", Usuario = usuarioExistente },
                null,
                200
            );
        }
    }

}