using agencia.DTOs;
using agencia.Interfaces.Services;
using agencia.Models;
using agencia.Interfaces.Repository;
using AutoMapper;
using System.Threading.Tasks;

namespace agencia.Service
{
    public class PagamentoService : IPagamentoService
    {
        private readonly IPagamentoRepository _pagamentoRepository;
        private readonly IReservaRepository _reservaRepository;
        private readonly IMapper _mapper;
        private readonly IEmailService _emailService;

        public PagamentoService(IPagamentoRepository pagamentoRepository, IReservaRepository reservaRepository, IMapper mapper, IEmailService emailService)
        {
            _pagamentoRepository = pagamentoRepository;
            _reservaRepository = reservaRepository;
            _mapper = mapper;
            _emailService = emailService;
        }

        public async Task<PagamentoDTO?> GetPagamentoByIdAsync(int id)
        {
            var pagamento = await _pagamentoRepository.BuscarPagamentoPorIdAsync(id);
            if (pagamento == null) return null;
            return _mapper.Map<PagamentoDTO>(pagamento);
        }

        public async Task<List<PagamentoDTO>> GetPagamentosByReservaAsync(int reservaId)
        {
            var pagamentos = await _pagamentoRepository.ListarPagamentosPorReservaAsync(reservaId);
            return _mapper.Map<List<PagamentoDTO>>(pagamentos);
        }

        public async Task<List<PagamentoDTO>> GetAllPagamentosAsync()
        {
            var pagamentos = await _pagamentoRepository.ListarTodosPagamentosAsync();
            return _mapper.Map<List<PagamentoDTO>>(pagamentos);
        }

        public async Task<Pagamento> CriarPagamentoAsync(PagamentoRequestDTO dto)
        {
            // Validação básica
            if (dto == null)
                throw new ArgumentNullException(nameof(dto), "Dados do pagamento não informados.");

            // Buscar a reserva usando o repositório de reservas
            Reserva? reserva = null;
            if (dto.ReservaId > 0)
            {
                reserva = await _reservaRepository.BuscarReservaPorIdAsync(dto.ReservaId);
                if (reserva == null)
                    throw new Exception("Reserva não encontrada para o pagamento.");

                // Checagem: só permite pagamento se houver pelo menos um viajante associado
                if (reserva.Viajantes == null || !reserva.Viajantes.Any())
                    throw new Exception("Adicione pelo menos um viajante à reserva antes de realizar o pagamento.");
            }

            // Calcular valor total do pagamento
            int quantidadeViajantes = reserva?.Viajantes?.Count ?? 1;
            float valorTotal = (reserva?.ValorUnitario ?? 0) * quantidadeViajantes;

            var pagamento = new Pagamento
            {
                Valor = valorTotal,
                FormaDePagamento = Enum.Parse<FormaDePagamento>(dto.Metodo, true),
                DataPagamento = DateTime.Now,
                StatusPagamento = StatusPagamento.Pendente,
                Reserva = reserva!
            };

            await _pagamentoRepository.CriarPagamentoAsync(pagamento);
            var pagamentoDTO = _mapper.Map<PagamentoDTO>(pagamento);
            if (!string.IsNullOrEmpty(dto.Email))
                await _emailService.EnviarStatusPagamentoAsync(dto.Email, pagamentoDTO.StatusPagamento, pagamentoDTO);
            return pagamento;
        }

        public async Task AtualizarStatusPagamentoAsync(string pagamentoId, string status)
        {
            // Buscar pagamento pelo ID
            if (!int.TryParse(pagamentoId, out int id))
                throw new ArgumentException("ID do pagamento inválido.");

            var pagamento = await _pagamentoRepository.BuscarPagamentoPorIdAsync(id);
            if (pagamento == null)
                throw new Exception("Pagamento não encontrado.");

            // Atualizar status
            if (!Enum.TryParse<StatusPagamento>(status, true, out var novoStatus))
                throw new Exception("Status de pagamento inválido.");

            pagamento.StatusPagamento = novoStatus;
            await _pagamentoRepository.AtualizaPagamentoAsync(pagamento);

            // Se desejar, envie e-mail de notificação
            // if (pagamento.Reserva != null && !string.IsNullOrEmpty(pagamento.Reserva.Email))
            //     await _emailService.EnviarStatusPagamentoAsync(pagamento.Reserva.Email, status, pagamento);
        }
    }
}