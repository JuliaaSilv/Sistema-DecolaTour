/* using agencia.DTOs;
using agencia.Models;
using agencia.Response;
using agencia.Interfaces.Repository;
using agencia.Interfaces.Services;
using AutoMapper;

namespace agencia.Service
{
    public class ReservaService : IReservaService
    {
        private IReservaRepository _reservaRepository { get; }
        private IMapper _mapper { get; }

        public ReservaService(IReservaRepository reservaRepository, IMapper mapper)
        {
            _reservaRepository = reservaRepository;
            _mapper = mapper;
        }

        // Lista todas as reservas do sistema.
        public async Task<IEnumerable<ReservaDTO>> ListarReservasAsync()
        {
            var reservas = await _reservaRepository.ListarReservasAsync();
            return _mapper.Map<IEnumerable<ReservaDTO>>(reservas);
        }

        // Busca uma reserva específica pelo seu ID.
        public async Task<ReservaDTO?> BuscarReservaPorIdAsync(int id)
        {
            var reserva = await _reservaRepository.BuscarReservaPorIdAsync(id);
            return reserva == null ? null : _mapper.Map<ReservaDTO>(reserva);
        }

        // Cria uma nova reserva no sistema, com tratativa de resposta padronizada.
        public async Task<ApiResponse> CriarReservaAsync(ReservaDTO reservaDTO)
        {
            if (reservaDTO == null)
                return new ApiResponse(null, new ErrorResponse("Dados da reserva não informados!"), 400);

            var reserva = _mapper.Map<Reserva>(reservaDTO);
            reserva.NumeroReserva = new Random().Next(100000, 999999);
            reserva.DataReserva = DateTime.UtcNow;
            reserva.Status = StatusReseva.Pendente.ToString();

            var reservaCriada = await _reservaRepository.CriarReservaAsync(reserva);
            var reservaCriadaDTO = _mapper.Map<ReservaDTO>(reservaCriada);

            return new ApiResponse(
                new { Mensagem = "Reserva criada com sucesso", Reserva = reservaCriadaDTO },
                null,
                201
            );
        }

        // Atualiza o status de uma reserva existente, com tratativa de resposta padronizada.
        public async Task<ApiResponse> AtualizarStatusAsync(int reservaId, string novoStatus)
        {
            var reserva = await _reservaRepository.BuscarReservaPorIdAsync(reservaId);
            if (reserva == null)
                return new ApiResponse(null, new ErrorResponse("Reserva não encontrada."), 404);

            if (!System.Enum.TryParse(typeof(StatusReseva), novoStatus, true, out var statusEnum))
                return new ApiResponse(null, new ErrorResponse("Status inválido."), 400);

            reserva.Status = novoStatus;
            await _reservaRepository.AtualizarStatusAsync(reservaId, novoStatus);

            return new ApiResponse(
                new { Mensagem = $"Status atualizado para {novoStatus}" },
                null,
                200
            );
        }

        // Deleta uma reserva pelo ID.
        public async Task<ApiResponse> DeletarReservaAsync(int id)
        {
            var reserva = await _reservaRepository.BuscarReservaPorIdAsync(id);
            if (reserva == null)
                return new ApiResponse(null, new ErrorResponse("Reserva não encontrada."), 404);

            var sucesso = await _reservaRepository.DeletarReservaAsync(id);
            if (!sucesso)
                return new ApiResponse(null, new ErrorResponse("Erro ao deletar reserva."), 500);

            return new ApiResponse(
                new { Mensagem = "Reserva deletada com sucesso" },
                null,
                200
            );
        }
    }
} */