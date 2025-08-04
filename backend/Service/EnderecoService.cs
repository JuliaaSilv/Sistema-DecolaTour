using agencia.DTOs;
using agencia.Interfaces.Repository;
using agencia.Interfaces.Services;
using agencia.Models;
using agencia.Response;
using AutoMapper;

namespace agencia.Service
{
    public class EnderecoService : IEnderecoService
    {
        private readonly IEnderecoRepository _enderecoRepository;
        private readonly IMapper _mapper;

        public EnderecoService(IEnderecoRepository enderecoRepository, IMapper mapper)
        {
            _enderecoRepository = enderecoRepository;
            _mapper = mapper;
        }

        public async Task<ApiResponse> GetByUsuarioIdAsync(int usuarioId)
        {
            try
            {
                var enderecos = await _enderecoRepository.GetByUsuarioIdAsync(usuarioId);
                var enderecosDTO = _mapper.Map<List<EnderecoDTO>>(enderecos);

                return new ApiResponse(enderecosDTO, null, 200);
            }
            catch (Exception ex)
            {
                return new ApiResponse(null, new ErrorResponse(ex.Message), 500);
            }
        }

        public async Task<ApiResponse> GetByIdAsync(int id)
        {
            try
            {
                var endereco = await _enderecoRepository.GetByIdAsync(id);
                if (endereco == null)
                {
                    return new ApiResponse(null, new ErrorResponse("Endereço não encontrado"), 404);
                }

                var enderecoDTO = new EnderecoDTO
                {
                    Id = endereco.Id,
                    UsuarioId = endereco.UsuarioId,
                    CEP = endereco.CEP,
                    Logradouro = endereco.Logradouro,
                    Numero = endereco.Numero,
                    Complemento = endereco.Complemento,
                    Bairro = endereco.Bairro,
                    Cidade = endereco.Cidade,
                    Estado = endereco.Estado,
                    Pais = endereco.Pais,
                    Apelido = endereco.Apelido,
                    Ativo = endereco.Ativo,
                    EnderecoCompleto = endereco.EnderecoCompleto
                };

                return new ApiResponse(enderecoDTO, null, 200);
            }
            catch (Exception ex)
            {
                return new ApiResponse(null, new ErrorResponse(ex.Message), 500);
            }
        }

        public async Task<ApiResponse> CreateAsync(int usuarioId, CreateEnderecoDTO createEnderecoDTO)
        {
            try
            {
                var endereco = new Endereco(
                    usuarioId,
                    createEnderecoDTO.CEP,
                    createEnderecoDTO.Logradouro,
                    createEnderecoDTO.Numero,
                    createEnderecoDTO.Bairro,
                    createEnderecoDTO.Cidade,
                    createEnderecoDTO.Estado,
                    createEnderecoDTO.Pais
                )
                {
                    Complemento = createEnderecoDTO.Complemento,
                    Apelido = createEnderecoDTO.Apelido
                };

                var enderecoCriado = await _enderecoRepository.CreateAsync(endereco);

                var enderecoDTO = new EnderecoDTO
                {
                    Id = enderecoCriado.Id,
                    UsuarioId = enderecoCriado.UsuarioId,
                    CEP = enderecoCriado.CEP,
                    Logradouro = enderecoCriado.Logradouro,
                    Numero = enderecoCriado.Numero,
                    Complemento = enderecoCriado.Complemento,
                    Bairro = enderecoCriado.Bairro,
                    Cidade = enderecoCriado.Cidade,
                    Estado = enderecoCriado.Estado,
                    Pais = enderecoCriado.Pais,
                    Apelido = enderecoCriado.Apelido,
                    Ativo = enderecoCriado.Ativo,
                    EnderecoCompleto = enderecoCriado.EnderecoCompleto
                };

                return new ApiResponse(enderecoDTO, null, 201);
            }
            catch (Exception ex)
            {
                return new ApiResponse(null, new ErrorResponse(ex.Message), 500);
            }
        }

        public async Task<ApiResponse> UpdateAsync(int usuarioId, UpdateEnderecoDTO updateEnderecoDTO)
        {
            try
            {
                var endereco = await _enderecoRepository.GetByIdAsync(updateEnderecoDTO.Id);
                if (endereco == null)
                {
                    return new ApiResponse(null, new ErrorResponse("Endereço não encontrado"), 404);
                }

                if (endereco.UsuarioId != usuarioId)
                {
                    return new ApiResponse(null, new ErrorResponse("Não autorizado"), 403);
                }

                endereco.CEP = updateEnderecoDTO.CEP;
                endereco.Logradouro = updateEnderecoDTO.Logradouro;
                endereco.Numero = updateEnderecoDTO.Numero;
                endereco.Complemento = updateEnderecoDTO.Complemento;
                endereco.Bairro = updateEnderecoDTO.Bairro;
                endereco.Cidade = updateEnderecoDTO.Cidade;
                endereco.Estado = updateEnderecoDTO.Estado;
                endereco.Pais = updateEnderecoDTO.Pais;
                endereco.Apelido = updateEnderecoDTO.Apelido;
                endereco.Ativo = updateEnderecoDTO.Ativo;

                var enderecoAtualizado = await _enderecoRepository.UpdateAsync(endereco);

                var enderecoDTO = new EnderecoDTO
                {
                    Id = enderecoAtualizado.Id,
                    UsuarioId = enderecoAtualizado.UsuarioId,
                    CEP = enderecoAtualizado.CEP,
                    Logradouro = enderecoAtualizado.Logradouro,
                    Numero = enderecoAtualizado.Numero,
                    Complemento = enderecoAtualizado.Complemento,
                    Bairro = enderecoAtualizado.Bairro,
                    Cidade = enderecoAtualizado.Cidade,
                    Estado = enderecoAtualizado.Estado,
                    Pais = enderecoAtualizado.Pais,
                    Apelido = enderecoAtualizado.Apelido,
                    Ativo = enderecoAtualizado.Ativo,
                    EnderecoCompleto = enderecoAtualizado.EnderecoCompleto
                };

                return new ApiResponse(enderecoDTO, null, 200);
            }
            catch (Exception ex)
            {
                return new ApiResponse(null, new ErrorResponse(ex.Message), 500);
            }
        }

        public async Task<ApiResponse> DeleteAsync(int usuarioId, int enderecoId)
        {
            try
            {
                var endereco = await _enderecoRepository.GetByIdAsync(enderecoId);
                if (endereco == null)
                {
                    return new ApiResponse(null, new ErrorResponse("Endereço não encontrado"), 404);
                }

                if (endereco.UsuarioId != usuarioId)
                {
                    return new ApiResponse(null, new ErrorResponse("Não autorizado"), 403);
                }

                var deleted = await _enderecoRepository.DeleteAsync(enderecoId);
                return new ApiResponse(new { mensagem = "Endereço removido com sucesso", sucesso = deleted }, null, 200);
            }
            catch (Exception ex)
            {
                return new ApiResponse(null, new ErrorResponse(ex.Message), 500);
            }
        }
    }
}
