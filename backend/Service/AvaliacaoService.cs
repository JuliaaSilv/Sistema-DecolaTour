using AutoMapper;
using agencia.DTOs;
using agencia.Models;
using agencia.Response;
using agencia.Interfaces.Repository;
using agencia.Interfaces.Services;
using agencia.Enum;

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

        public async Task<ApiResponse> CriarAvaliacaoAsync(AvaliacaoDTO dto, int usuarioId)
        {
            // Buscar a reserva informada
            var reserva = await _reservaRepository.BuscarReservaPorIdAsync(dto.ReservaId);

            if (reserva == null)
            {
                return new ApiResponse(null, new ErrorResponse("Reserva não encontrada!"), 404);
            }

            // Verifica se a reserva pertence ao usuário logado
            if (reserva.UsuarioId != usuarioId)
            {
                return new ApiResponse(null, new ErrorResponse("Você não tem permissão para avaliar essa reserva!"), 403);
            }

            // Verifica se esse usuário já avaliou essa reserva
            var avaliacaoExistente = await _avaliacaoRepository.ObterPorReservaEUsuarioAsync(dto.ReservaId, usuarioId);
            if (avaliacaoExistente != null)
            {
                return new ApiResponse(null, new ErrorResponse("Você já avaliou essa reserva!"), 400);
            }

            // Criar avaliação
            var avaliacao = new Avaliacao
            {
                Comentario = dto.Comentario,
                Nota = dto.Nota,
                Data = DateTime.Now,
                ReservaId = dto.ReservaId,
                Status = StatusAvaliacao.Pendente // Usar enum em vez de string
            };

            await _avaliacaoRepository.CriarAvaliacaoAsync(avaliacao);

            return new ApiResponse(new { mensagem = "Avaliação criada com sucesso!" }, null, 201);
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

        public async Task<ApiResponse> VerificarSeUsuarioPodeAvaliarPacoteAsync(int pacoteId, int usuarioId)
        {
            try
            {
                // Buscar todas as reservas do usuário para o pacote específico
                var reservasUsuario = await _reservaRepository.ListarPorUsuarioAsync(usuarioId);
                var reservasDoPacote = reservasUsuario.Where(r => r.PacoteId == pacoteId).ToList();

                if (!reservasDoPacote.Any())
                {
                    return new ApiResponse(new { podeAvaliar = false, motivo = "Usuário não possui reservas para este pacote" }, null, 200);
                }

                // Verificar se já existe avaliação para alguma das reservas deste pacote
                foreach (var reserva in reservasDoPacote)
                {
                    var avaliacaoExistente = await _avaliacaoRepository.ObterPorReservaEUsuarioAsync(reserva.Id, usuarioId);
                    if (avaliacaoExistente != null)
                    {
                        return new ApiResponse(new { podeAvaliar = false, motivo = "Usuário já avaliou este pacote", avaliacaoId = avaliacaoExistente.Id }, null, 200);
                    }
                }

                // Se chegou até aqui, o usuário tem reserva(s) e ainda não avaliou
                var reservaParaAvaliar = reservasDoPacote.OrderByDescending(r => r.DataReserva).First();
                return new ApiResponse(new { 
                    podeAvaliar = true, 
                    reservaId = reservaParaAvaliar.Id,
                    numeroReserva = reservaParaAvaliar.NumeroReserva 
                }, null, 200);
            }
            catch (Exception ex)
            {
                return new ApiResponse(null, new ErrorResponse($"Erro interno: {ex.Message}"), 500);
            }
        }

        // Métodos para moderação
        public async Task<ApiResponse> ListarAvaliacoesPendentesAsync()
        {
            try
            {
                var avaliacoesPendentes = await _avaliacaoRepository.ListarAvaliacoesPendentesAsync();
                var avaliacoesDTO = _mapper.Map<IEnumerable<AvaliacaoCompletaDTO>>(avaliacoesPendentes);

                return new ApiResponse(avaliacoesDTO, null, 200);
            }
            catch (Exception ex)
            {
                return new ApiResponse(null, new ErrorResponse($"Erro interno: {ex.Message}"), 500);
            }
        }

        public async Task<ApiResponse> AprovarAvaliacaoAsync(int avaliacaoId)
        {
            try
            {
                var sucesso = await _avaliacaoRepository.AtualizarStatusAsync(avaliacaoId, StatusAvaliacao.Aprovada);
                
                if (!sucesso)
                {
                    return new ApiResponse(null, new ErrorResponse("Avaliação não encontrada"), 404);
                }

                return new ApiResponse(new { mensagem = "Avaliação aprovada com sucesso!" }, null, 200);
            }
            catch (Exception ex)
            {
                return new ApiResponse(null, new ErrorResponse($"Erro interno: {ex.Message}"), 500);
            }
        }

        public async Task<ApiResponse> RejeitarAvaliacaoAsync(int avaliacaoId)
        {
            try
            {
                var sucesso = await _avaliacaoRepository.AtualizarStatusAsync(avaliacaoId, StatusAvaliacao.Rejeitada);
                
                if (!sucesso)
                {
                    return new ApiResponse(null, new ErrorResponse("Avaliação não encontrada"), 404);
                }

                return new ApiResponse(new { mensagem = "Avaliação rejeitada com sucesso!" }, null, 200);
            }
            catch (Exception ex)
            {
                return new ApiResponse(null, new ErrorResponse($"Erro interno: {ex.Message}"), 500);
            }
        }
    }
}
