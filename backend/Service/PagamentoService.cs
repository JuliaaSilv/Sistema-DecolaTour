using agencia.DTOs;
using agencia.Models;
using agencia.Interfaces.Repository;
using agencia.Interfaces.Services;
using AutoMapper;

namespace agencia.Service
{
    public class PagamentoService : IPagamentoService
    {
        private IPagamentoRepository _pagamentoRepository { get; }
        private IReservaService _reservaService { get; }
        private IMapper _mapper { get; }

        public PagamentoService(IPagamentoRepository pagamentoRepository, IReservaService reservaService, IMapper mapper)
        {
            _pagamentoRepository = pagamentoRepository;
            _reservaService = reservaService;
            _mapper = mapper;
        }

        // Cria um novo pagamento no sistema.
        public async Task<Pagamento?> CriarPagamentoAsync(PagamentoDTO pagamentoDTO)
        {
            if (pagamentoDTO == null)
                throw new Exception("Pagamento a ser criado inválido.");

            try
            {
                var pagamento = _mapper.Map<Pagamento>(pagamentoDTO);
                var pagamentoCriado = await _pagamentoRepository.CriarPagamentoAsync(pagamento);
                return pagamentoCriado;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }

        }

        // Busca um pagamento específico pelo seu ID.
        public async Task<Pagamento?> BuscarPagamentoPorIdAsync(int id)
        {
            var pagamento = await _pagamentoRepository.BuscarPagamentoPorIdAsync(id);
            return pagamento == null ? null : pagamento;
        }

        // Deleta um pagamento existente pelo seu ID.
        public async Task DeletarPagamentoAsync(int idPagamento)
        {
            if (idPagamento <= 0)
                throw new Exception("Id do pagamento informado é inválido.");

            var pagamento = await _pagamentoRepository.BuscarPagamentoPorIdAsync(idPagamento);

            if (pagamento == null)
                throw new Exception("Pagamento informado não existe.");

            try
            {
                await _pagamentoRepository.DeletarPagamentoAsync(idPagamento);
            }
            catch (Exception ex)
            {
                throw new Exception("Erro ao deletar pagamento. Detalhe: " + ex.Message);
            }
        }

        // Lista todos os pagamentos para uma determinada reserva.
        public async Task<IEnumerable<Pagamento>> ListarPagamentosAsync(int idReserva)
        {
            if (idReserva <= 0)
                throw new Exception("Id da reserva informada é inválido.");

            var reserva = await _reservaService.BuscarReservaPorIdAsync(idReserva);
            if (reserva == null)
                throw new Exception("Reserva não encontrada.");

            try
            {
                var pagamentos = await _pagamentoRepository.ListarPagamentosAsync(idReserva);

                if (pagamentos == null || !pagamentos.Any())
                    return Enumerable.Empty<Pagamento>();

                return _mapper.Map<IEnumerable<Pagamento>>(pagamentos);
            }
            catch (Exception ex)
            {
                throw new Exception("Erro ao listar pagamentos da reserva. Detalhe: " + ex.Message);
            }
        }

        public async Task AtualizarStatusDaReservaPeloPagamentoAsync(int pagamentoId, string novoStatus)
        {
            if (pagamentoId <= 0)
                throw new Exception("Id do pagamento informado é inválido.");

            var pagamento = await _pagamentoRepository.BuscarPagamentoPorIdAsync(pagamentoId);
            if (pagamento == null)
                throw new Exception("Pagamento informado não encontrado.");

            var response = await _reservaService.AtualizarStatusAsync(pagamento.Reserva.Id, novoStatus);

            if (response.Error != null)
                throw new Exception(response.Error.Message);

        }

        public async Task<Pagamento?> AtualizaPagamentoAsync(PagamentoDTO pagamentoDTO)
        {
            if (pagamentoDTO == null)
                throw new Exception("Pagamento a ser atualizado inválido.");

            try
            {
                var pagamento = _mapper.Map<Pagamento>(pagamentoDTO);
                var pagamentoAtualizado = await _pagamentoRepository.AtualizaPagamentoAsync(pagamento);

                switch (pagamentoAtualizado.StatusPagamento)
                {

                    case StatusPagamento.Pendente:
                        await AtualizarStatusDaReservaPeloPagamentoAsync(pagamentoAtualizado.Id, StatusReseva.Pendente.ToString());
                        break;

                    case StatusPagamento.Aprovado:
                        await AtualizarStatusDaReservaPeloPagamentoAsync(pagamentoAtualizado.Id, StatusReseva.Confirmada.ToString());
                        break;

                    case StatusPagamento.Rejeitado:
                        await AtualizarStatusDaReservaPeloPagamentoAsync(pagamentoAtualizado.Id, StatusReseva.Pendente.ToString());
                        break;

                    case StatusPagamento.Cancelado:
                        await AtualizarStatusDaReservaPeloPagamentoAsync(pagamentoAtualizado.Id, StatusReseva.Cancelada.ToString());
                        break;

                }


                return pagamentoAtualizado;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
    }
}