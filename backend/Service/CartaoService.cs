using agencia.DTOs;
using agencia.Interfaces.Repository;
using agencia.Interfaces.Services;
using agencia.Models;
using agencia.Response;
using AutoMapper;

namespace agencia.Service
{
    public class CartaoService : ICartaoService
    {
        private readonly ICartaoRepository _cartaoRepository;
        private readonly IMapper _mapper;

        public CartaoService(ICartaoRepository cartaoRepository, IMapper mapper)
        {
            _cartaoRepository = cartaoRepository;
            _mapper = mapper;
        }

        public async Task<ApiResponse> GetByUsuarioIdAsync(int usuarioId)
        {
            try
            {
                var cartoes = await _cartaoRepository.GetByUsuarioIdAsync(usuarioId);
                var cartoesDTO = cartoes.Select(c => new CartaoDTO
                {
                    Id = c.Id,
                    UsuarioId = c.UsuarioId,
                    NomeTitular = c.NomeTitular,
                    NumeroCartaoMascarado = MascararNumeroCartao(c.NumeroCartao),
                    Validade = c.Validade,
                    TipoCartao = c.TipoCartao,
                    Apelido = c.Apelido,
                    Ativo = c.Ativo
                });

                return new ApiResponse(cartoesDTO, null, 200);
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
                var cartao = await _cartaoRepository.GetByIdAsync(id);
                if (cartao == null)
                {
                    return new ApiResponse(null, new ErrorResponse("Cartão não encontrado"), 404);
                }

                var cartaoDTO = new CartaoDTO
                {
                    Id = cartao.Id,
                    UsuarioId = cartao.UsuarioId,
                    NomeTitular = cartao.NomeTitular,
                    NumeroCartaoMascarado = MascararNumeroCartao(cartao.NumeroCartao),
                    Validade = cartao.Validade,
                    TipoCartao = cartao.TipoCartao,
                    Apelido = cartao.Apelido,
                    Ativo = cartao.Ativo
                };

                return new ApiResponse(cartaoDTO, null, 200);
            }
            catch (Exception ex)
            {
                return new ApiResponse(null, new ErrorResponse(ex.Message), 500);
            }
        }

        public async Task<ApiResponse> CreateAsync(int usuarioId, CreateCartaoDTO createCartaoDTO)
        {
            try
            {
                var cartao = new Cartao(
                    usuarioId,
                    createCartaoDTO.NomeTitular,
                    createCartaoDTO.NumeroCartao,
                    createCartaoDTO.Validade,
                    createCartaoDTO.CVV,
                    createCartaoDTO.TipoCartao
                )
                {
                    Apelido = createCartaoDTO.Apelido
                };

                var cartaoCriado = await _cartaoRepository.CreateAsync(cartao);

                var cartaoDTO = new CartaoDTO
                {
                    Id = cartaoCriado.Id,
                    UsuarioId = cartaoCriado.UsuarioId,
                    NomeTitular = cartaoCriado.NomeTitular,
                    NumeroCartaoMascarado = MascararNumeroCartao(cartaoCriado.NumeroCartao),
                    Validade = cartaoCriado.Validade,
                    TipoCartao = cartaoCriado.TipoCartao,
                    Apelido = cartaoCriado.Apelido,
                    Ativo = cartaoCriado.Ativo
                };

                return new ApiResponse(cartaoDTO, null, 201);
            }
            catch (Exception ex)
            {
                return new ApiResponse(null, new ErrorResponse(ex.Message), 500);
            }
        }

        public async Task<ApiResponse> UpdateAsync(int usuarioId, UpdateCartaoDTO updateCartaoDTO)
        {
            try
            {
                var cartao = await _cartaoRepository.GetByIdAsync(updateCartaoDTO.Id);
                if (cartao == null)
                {
                    return new ApiResponse(null, new ErrorResponse("Cartão não encontrado"), 404);
                }

                if (cartao.UsuarioId != usuarioId)
                {
                    return new ApiResponse(null, new ErrorResponse("Não autorizado"), 403);
                }

                cartao.NomeTitular = updateCartaoDTO.NomeTitular;
                cartao.Validade = updateCartaoDTO.Validade;
                cartao.CVV = updateCartaoDTO.CVV;
                cartao.TipoCartao = updateCartaoDTO.TipoCartao;
                cartao.Apelido = updateCartaoDTO.Apelido;
                cartao.Ativo = updateCartaoDTO.Ativo;

                var cartaoAtualizado = await _cartaoRepository.UpdateAsync(cartao);

                var cartaoDTO = new CartaoDTO
                {
                    Id = cartaoAtualizado.Id,
                    UsuarioId = cartaoAtualizado.UsuarioId,
                    NomeTitular = cartaoAtualizado.NomeTitular,
                    NumeroCartaoMascarado = MascararNumeroCartao(cartaoAtualizado.NumeroCartao),
                    Validade = cartaoAtualizado.Validade,
                    TipoCartao = cartaoAtualizado.TipoCartao,
                    Apelido = cartaoAtualizado.Apelido,
                    Ativo = cartaoAtualizado.Ativo
                };

                return new ApiResponse(cartaoDTO, null, 200);
            }
            catch (Exception ex)
            {
                return new ApiResponse(null, new ErrorResponse(ex.Message), 500);
            }
        }

        public async Task<ApiResponse> DeleteAsync(int usuarioId, int cartaoId)
        {
            try
            {
                var cartao = await _cartaoRepository.GetByIdAsync(cartaoId);
                if (cartao == null)
                {
                    return new ApiResponse(null, new ErrorResponse("Cartão não encontrado"), 404);
                }

                if (cartao.UsuarioId != usuarioId)
                {
                    return new ApiResponse(null, new ErrorResponse("Não autorizado"), 403);
                }

                var deleted = await _cartaoRepository.DeleteAsync(cartaoId);
                return new ApiResponse(new { mensagem = "Cartão removido com sucesso", sucesso = deleted }, null, 200);
            }
            catch (Exception ex)
            {
                return new ApiResponse(null, new ErrorResponse(ex.Message), 500);
            }
        }

        public async Task<ApiResponse> GetByIdForPaymentAsync(int id, int usuarioId)
        {
            try
            {
                var cartao = await _cartaoRepository.GetByIdAsync(id);
                if (cartao == null)
                {
                    return new ApiResponse(null, new ErrorResponse("Cartão não encontrado"), 404);
                }

                if (cartao.UsuarioId != usuarioId)
                {
                    return new ApiResponse(null, new ErrorResponse("Não autorizado"), 403);
                }

                var cartaoDTO = new CartaoDTO
                {
                    Id = cartao.Id,
                    UsuarioId = cartao.UsuarioId,
                    NomeTitular = cartao.NomeTitular,
                    NumeroCartao = cartao.NumeroCartao, // Número completo para pagamento
                    Validade = cartao.Validade,
                    TipoCartao = cartao.TipoCartao,
                    Apelido = cartao.Apelido,
                    Ativo = cartao.Ativo
                };

                return new ApiResponse(cartaoDTO, null, 200);
            }
            catch (Exception ex)
            {
                return new ApiResponse(null, new ErrorResponse(ex.Message), 500);
            }
        }

        private string MascararNumeroCartao(string numeroCartao)
        {
            if (string.IsNullOrEmpty(numeroCartao) || numeroCartao.Length < 4)
                return "****";

            return $"**** **** **** {numeroCartao.Substring(numeroCartao.Length - 4)}";
        }
    }
}
