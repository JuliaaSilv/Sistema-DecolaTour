using AutoMapper;
using agencia.DTOs;
using agencia.Models;
using agencia.Response;
using agencia.Interfaces.Repository;
using agencia.Interfaces.Services;

namespace agencia.Service
{
    public class AvaliacaoService : IAvaliacaoService
    {
        private readonly IAvaliacaoRepository _avaliacaoRepository;
        private readonly IReservaRepository _reservaRepository;
        private readonly IMapper _mapper;

        public AvaliacaoService(
            IAvaliacaoRepository avaliacaoRepository,
            IReservaRepository reservaRepository,
            IMapper mapper)
        {
            _avaliacaoRepository = avaliacaoRepository;
            _reservaRepository = reservaRepository;
            _mapper = mapper;
        }

        public async Task<ApiResponse> CriarAvaliacaoAsync(AvaliacaoDTO avaliacaoDTO)
        {
            try
            {
                // Validar se a reserva existe
                var reserva = await _reservaRepository.BuscarReservaPorIdAsync(avaliacaoDTO.ReservaId);
                if (reserva == null)
                {
                    return new ApiResponse(null, new ErrorResponse("Reserva não encontrada!"), 404);
                }

                // Validar nota (1-5)
                if (avaliacaoDTO.Nota < 1 || avaliacaoDTO.Nota > 5)
                {
                    return new ApiResponse(null, new ErrorResponse("A nota deve estar entre 1 e 5!"), 400);
                }

                // Verificar se já existe avaliação para esta reserva
                var avaliacoesExistentes = await _avaliacaoRepository.ListarAvaliacoesPorReservaAsync(avaliacaoDTO.ReservaId);
                if (avaliacoesExistentes.Any())
                {
                    return new ApiResponse(null, new ErrorResponse("Já existe uma avaliação para esta reserva!"), 400);
                }

                var avaliacao = _mapper.Map<Avaliacao>(avaliacaoDTO);
                avaliacao.Data = DateTime.Now;

                var avaliacaoCriada = await _avaliacaoRepository.AdicionarAsync(avaliacao);
                var resultado = _mapper.Map<AvaliacaoDTO>(avaliacaoCriada);

                return new ApiResponse(resultado, null, 201);
            }
            catch (Exception ex)
            {
                return new ApiResponse(null, new ErrorResponse($"Erro interno: {ex.Message}"), 500);
            }
        }

        public async Task<ApiResponse> ListarAvaliacoesAsync()
        {
            try
            {
                var avaliacoes = await _avaliacaoRepository.ListarAsync();
                var avaliacoesDTO = _mapper.Map<IEnumerable<AvaliacaoDTO>>(avaliacoes);

                return new ApiResponse(avaliacoesDTO, null, 200);
            }
            catch (Exception ex)
            {
                return new ApiResponse(null, new ErrorResponse($"Erro interno: {ex.Message}"), 500);
            }
        }

        public async Task<ApiResponse> BuscarAvaliacaoPorIdAsync(int id)
        {
            try
            {
                var avaliacao = await _avaliacaoRepository.BuscarPorIdAsync(id);
                if (avaliacao == null)
                {
                    return new ApiResponse(null, new ErrorResponse("Avaliação não encontrada!"), 404);
                }

                var avaliacaoDTO = _mapper.Map<AvaliacaoDTO>(avaliacao);
                return new ApiResponse(avaliacaoDTO, null, 200);
            }
            catch (Exception ex)
            {
                return new ApiResponse(null, new ErrorResponse($"Erro interno: {ex.Message}"), 500);
            }
        }

        public async Task<ApiResponse> ListarAvaliacoesPorPacoteAsync(int pacoteId)
        {
            try
            {
                var avaliacoes = await _avaliacaoRepository.ListarAvaliacoesPorPacoteAsync(pacoteId);
                var avaliacoesDTO = _mapper.Map<IEnumerable<AvaliacaoCompletaDTO>>(avaliacoes);

                return new ApiResponse(avaliacoesDTO, null, 200);
            }
            catch (Exception ex)
            {
                return new ApiResponse(null, new ErrorResponse($"Erro interno: {ex.Message}"), 500);
            }
        }

        public async Task<ApiResponse> ListarAvaliacoesPorReservaAsync(int reservaId)
        {
            try
            {
                var avaliacoes = await _avaliacaoRepository.ListarAvaliacoesPorReservaAsync(reservaId);
                var avaliacoesDTO = _mapper.Map<IEnumerable<AvaliacaoDTO>>(avaliacoes);

                return new ApiResponse(avaliacoesDTO, null, 200);
            }
            catch (Exception ex)
            {
                return new ApiResponse(null, new ErrorResponse($"Erro interno: {ex.Message}"), 500);
            }
        }

        public async Task<ApiResponse> AtualizarAvaliacaoAsync(int id, AvaliacaoDTO avaliacaoDTO)
        {
            try
            {
                var avaliacaoExistente = await _avaliacaoRepository.BuscarPorIdAsync(id);
                if (avaliacaoExistente == null)
                {
                    return new ApiResponse(null, new ErrorResponse("Avaliação não encontrada!"), 404);
                }

                // Validar nota (1-5)
                if (avaliacaoDTO.Nota < 1 || avaliacaoDTO.Nota > 5)
                {
                    return new ApiResponse(null, new ErrorResponse("A nota deve estar entre 1 e 5!"), 400);
                }

                // Atualizar campos
                avaliacaoExistente.Nota = avaliacaoDTO.Nota;
                avaliacaoExistente.Comentario = avaliacaoDTO.Comentario;
                avaliacaoExistente.Data = DateTime.Now; // Atualiza a data da modificação

                await _avaliacaoRepository.AtualizarAsync(avaliacaoExistente);

                var resultado = _mapper.Map<AvaliacaoDTO>(avaliacaoExistente);
                return new ApiResponse(resultado, null, 200);
            }
            catch (Exception ex)
            {
                return new ApiResponse(null, new ErrorResponse($"Erro interno: {ex.Message}"), 500);
            }
        }

        public async Task<ApiResponse> RemoverAvaliacaoAsync(int id)
        {
            try
            {
                var avaliacao = await _avaliacaoRepository.BuscarPorIdAsync(id);
                if (avaliacao == null)
                {
                    return new ApiResponse(null, new ErrorResponse("Avaliação não encontrada!"), 404);
                }

                var removido = await _avaliacaoRepository.DeletarAsync(id);
                if (!removido)
                {
                    return new ApiResponse(null, new ErrorResponse("Erro ao remover avaliação!"), 500);
                }

                return new ApiResponse(new { message = "Avaliação removida com sucesso!" }, null, 200);
            }
            catch (Exception ex)
            {
                return new ApiResponse(null, new ErrorResponse($"Erro interno: {ex.Message}"), 500);
            }
        }

        public async Task<ApiResponse> CalcularMediaAvaliacoesAsync(int pacoteId)
        {
            try
            {
                var media = await _avaliacaoRepository.CalcularMediaNotasAsync(pacoteId);
                var totalAvaliacoes = await _avaliacaoRepository.ContarAvaliacoesPorPacoteAsync(pacoteId);

                var resultado = new
                {
                    PacoteId = pacoteId,
                    MediaNota = Math.Round(media, 2),
                    TotalAvaliacoes = totalAvaliacoes
                };

                return new ApiResponse(resultado, null, 200);
            }
            catch (Exception ex)
            {
                return new ApiResponse(null, new ErrorResponse($"Erro interno: {ex.Message}"), 500);
            }
        }
    }
}
