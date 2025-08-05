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
        private readonly IReservaService _reservaService;
        private readonly IMapper _mapper;
        private readonly IEmailService _emailService;
        private readonly IPagamentoMockService _pagamentoMockService;

        public PagamentoService(IPagamentoRepository pagamentoRepository, IReservaService reservaService, IReservaRepository reservaRepository, IMapper mapper, IEmailService emailService, IPagamentoMockService pagamentoMockService)
        {
            _pagamentoRepository = pagamentoRepository;
            _reservaRepository = reservaRepository;
            _reservaService = reservaService;
            _mapper = mapper;
            _emailService = emailService;
            _pagamentoMockService = pagamentoMockService;
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
                FormaDePagamento = System.Enum.Parse<FormaDePagamento>(dto.Metodo, true),
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

        public async Task<RespostaPagamentoDTO> ProcessarPagamentoCompletoAsync(PagamentoCompletoRequestDTO dto)
        {
            try
            {
                // Validação básica
                if (dto == null)
                    throw new ArgumentNullException(nameof(dto), "Dados do pagamento não informados.");

                // Buscar a reserva
                var reserva = await _reservaRepository.BuscarReservaPorIdAsync(dto.ReservaId);
                if (reserva == null)
                    throw new Exception("Reserva não encontrada para o pagamento.");

                if (reserva.Viajantes == null || !reserva.Viajantes.Any())
                    throw new Exception("Adicione pelo menos um viajante à reserva antes de realizar o pagamento.");

                // Calcular valor total
                int quantidadeViajantes = reserva.Viajantes.Count;
                float valorTotal = reserva.ValorUnitario * quantidadeViajantes;

                // Criar o pagamento
                var pagamento = new Pagamento
                {
                    Valor = valorTotal,
                    FormaDePagamento = dto.FormaDePagamento,
                    DataPagamento = DateTime.Now,
                    StatusPagamento = StatusPagamento.Pendente,
                    Reserva = reserva
                };

                await _pagamentoRepository.CriarPagamentoAsync(pagamento);

                // Processar o pagamento usando o mock service
                RespostaPagamentoDTO resposta = dto.FormaDePagamento switch
                {
                    FormaDePagamento.Pix => await _pagamentoMockService.ProcessarPagamentoPixAsync(dto, pagamento),
                    FormaDePagamento.CartaoCredito or FormaDePagamento.CartaoDebito => 
                        await _pagamentoMockService.ProcessarPagamentoCartaoAsync(dto, pagamento),
                    FormaDePagamento.Boleto => await _pagamentoMockService.ProcessarPagamentoBoletoAsync(dto, pagamento),
                    _ => throw new ArgumentException("Forma de pagamento não suportada.")
                };

                // Se o pagamento foi rejeitado imediatamente, atualizar o status
                if (!resposta.Sucesso && resposta.Status == StatusPagamento.Rejeitado.ToString())
                {
                    await AtualizarStatusAsync(pagamento.Id, StatusPagamento.Rejeitado.ToString());
                }

                // Enviar email de status do pagamento
                if (resposta.Sucesso)
                {
                    // Usa status 'Aprovado' para template de aprovação
                    object payload = resposta.Comprovante != null ? (object)resposta.Comprovante : (object)resposta;
                    await _emailService.EnviarStatusPagamentoAsync(dto.Email, "Aprovado", payload);
                }
                else
                {
                    // Usa status 'Rejeitado' para template de rejeição
                    await _emailService.EnviarStatusPagamentoAsync(dto.Email, "Rejeitado", resposta);
                }

                return resposta;
            }
            catch (Exception ex)
            {
                return new RespostaPagamentoDTO
                {
                    Sucesso = false,
                    Mensagem = ex.Message,
                    Status = StatusPagamento.Rejeitado.ToString(),
                    CodigoErro = "ERRO_INTERNO",
                    DataProcessamento = DateTime.Now
                };
            }
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
            if (!System.Enum.TryParse<StatusPagamento>(status, true, out var novoStatus))
                throw new Exception("Status de pagamento inválido.");

            pagamento.StatusPagamento = novoStatus;
            await _pagamentoRepository.AtualizaPagamentoAsync(pagamento);

            // Se desejar, envie e-mail de notificação
            // if (pagamento.Reserva != null && !string.IsNullOrEmpty(pagamento.Reserva.Email))
            //     await _emailService.EnviarStatusPagamentoAsync(pagamento.Reserva.Email, status, pagamento);
        }

        public async Task AtualizarStatusAsync(int pagamentoId, string status)
        {
            // Buscar pagamento pelo ID
            if (pagamentoId < 0)
                throw new ArgumentException("ID do pagamento inválido.");

            var pagamento = await _pagamentoRepository.BuscarPagamentoPorIdAsync(pagamentoId);
            if (pagamento == null)
                throw new Exception("Pagamento não encontrado.");

            // Atualizar status
            if (!System.Enum.TryParse<StatusPagamento>(status, true, out var novoStatus))
                throw new Exception("Status de pagamento inválido.");

            pagamento.StatusPagamento = novoStatus;
            await _pagamentoRepository.AtualizaPagamentoAsync(pagamento);

            var statusReseva = "";

            // Converte a string para o enum (com tratamento de erro)
            if (System.Enum.TryParse<StatusPagamento>(pagamento.StatusPagamento.ToString(), out StatusPagamento statusEnum))
            {
                switch (statusEnum)
                {
                    case StatusPagamento.Pago:
                        statusReseva = StatusReseva.Confirmada.ToString();
                        break;

                    case StatusPagamento.Pendente:
                        statusReseva = StatusReseva.Pendente.ToString();
                        break;

                    case StatusPagamento.Reembolsado :
                        statusReseva = StatusReseva.Cancelada.ToString();
                        break;

                    case StatusPagamento.Rejeitado :
                        statusReseva = StatusReseva.Pendente.ToString();
                        break;

                    default:
                        Console.WriteLine("Status de pagamento não reconhecido");
                        break;
                }
            }
            else
            {
                Console.WriteLine($"Status inválido: {statusReseva}");
            }

            await _reservaService.AtualizarStatusAsync(pagamento.Reserva.Id, statusReseva);
        }
    }
}
