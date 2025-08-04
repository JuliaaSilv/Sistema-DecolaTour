using agencia.DTOs;
using agencia.Models;

namespace agencia.Interfaces.Services
{
    public interface IPagamentoMockService
    {
        Task<RespostaPagamentoDTO> ProcessarPagamentoPixAsync(PagamentoCompletoRequestDTO request, Pagamento pagamento);
        Task<RespostaPagamentoDTO> ProcessarPagamentoCartaoAsync(PagamentoCompletoRequestDTO request, Pagamento pagamento);
        Task<RespostaPagamentoDTO> ProcessarPagamentoBoletoAsync(PagamentoCompletoRequestDTO request, Pagamento pagamento);
        Task<ComprovantePagamentoDTO> GerarComprovanteAsync(Pagamento pagamento, PagamentoCompletoRequestDTO request);
        Task SimularWebhookAsync(int pagamentoId, int delaySegundos = 5);
        string GerarCodigoTransacao();
        string GerarQrCodePix(decimal valor, string chavePix);
        string GerarCodigoBarrasBoleto();
    }
}
