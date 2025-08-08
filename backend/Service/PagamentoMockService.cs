using agencia.DTOs;
using agencia.Interfaces.Services;
using agencia.Interfaces.Repository;
using agencia.Models;
using Microsoft.Extensions.Logging;
using System.Text;

namespace agencia.Service
{
    public class PagamentoMockService : IPagamentoMockService
    {
        private readonly ILogger<PagamentoMockService> _logger;
        private readonly IPagamentoRepository _pagamentoRepository;
        private readonly IEmailService _emailService;
        private readonly Random _random;

        public PagamentoMockService(
            ILogger<PagamentoMockService> logger,
            IPagamentoRepository pagamentoRepository,
            IEmailService emailService)
        {
            _logger = logger;
            _pagamentoRepository = pagamentoRepository;
            _emailService = emailService;
            _random = new Random();
        }

        public async Task<RespostaPagamentoDTO> ProcessarPagamentoPixAsync(PagamentoCompletoRequestDTO request, Pagamento pagamento)
        {
            _logger.LogInformation($"Processando pagamento PIX para reserva {request.ReservaId}");
            
            // Simular delay de processamento reduzido
            await Task.Delay(500);

            // Lógica fake para PIX: aprova se a chave não for "teste@falha.com"
            bool aprovado = request.DadosPix?.ChavePix != "teste@falha.com";

            if (aprovado)
            {
                var comprovante = await GerarComprovanteAsync(pagamento, request);
                
                // PIX com webhook rápido para testes
                int delayWebhook = 2;
                _ = Task.Run(async () => await SimularWebhookAsync(pagamento.Id, delayWebhook));

                return new RespostaPagamentoDTO
                {
                    Sucesso = true,
                    Mensagem = "PIX processado com sucesso. Aguarde a confirmação.",
                    PagamentoId = pagamento.Id,
                    Status = StatusPagamento.Pendente.ToString(),
                    Comprovante = comprovante,
                    DataProcessamento = DateTime.Now,
                    TempoEstimadoWebhook = delayWebhook
                };
            }
            else
            {
                return new RespostaPagamentoDTO
                {
                    Sucesso = false,
                    Mensagem = "Falha no processamento do PIX. Chave PIX inválida.",
                    Status = StatusPagamento.Rejeitado.ToString(),
                    CodigoErro = "PIX_001",
                    DataProcessamento = DateTime.Now
                };
            }
        }

        public async Task<RespostaPagamentoDTO> ProcessarPagamentoCartaoAsync(PagamentoCompletoRequestDTO request, Pagamento pagamento)
        {
            _logger.LogInformation($"Processando pagamento cartão para reserva {request.ReservaId}");
            
            // Simular delay de processamento reduzido
            await Task.Delay(500);

            var dadosCartao = request.DadosCartao;
            
            // Verificar se dados do cartão existem
            if (dadosCartao == null)
            {
                return new RespostaPagamentoDTO
                {
                    Sucesso = false,
                    Mensagem = "Dados do cartão não informados.",
                    Status = StatusPagamento.Rejeitado.ToString(),
                    CodigoErro = "CARTAO_003",
                    DataProcessamento = DateTime.Now
                };
            }
            
            // Lógica fake para cartão: 
            // - Falha se termina com 0000
            // - Falha se CVV for 000
            // - Falha se valor for maior que R$ 5000 e cartão débito
            bool cartaoValido = !dadosCartao.NumeroCartao.EndsWith("0000") && dadosCartao.CVV != "000";
            bool valorPermitido = !(pagamento.FormaDePagamento == FormaDePagamento.CartaoDebito && pagamento.Valor > 5000);
            
            bool aprovado = cartaoValido && valorPermitido;

            if (aprovado)
            {
                var comprovante = await GerarComprovanteAsync(pagamento, request);
                
                // Para cartão, webhook rápido para testes
                int delayWebhook = 2;
                _ = Task.Run(async () => await SimularWebhookAsync(pagamento.Id, delayWebhook));

                return new RespostaPagamentoDTO
                {
                    Sucesso = true,
                    Mensagem = $"Pagamento no {pagamento.FormaDePagamento} aprovado com sucesso.",
                    PagamentoId = pagamento.Id,
                    Status = StatusPagamento.Pendente.ToString(),
                    Comprovante = comprovante,
                    DataProcessamento = DateTime.Now,
                    TempoEstimadoWebhook = delayWebhook
                };
            }
            else
            {
                string motivoRejeicao = !cartaoValido ? "Dados do cartão inválidos" : "Valor não permitido para cartão de débito";
                
                return new RespostaPagamentoDTO
                {
                    Sucesso = false,
                    Mensagem = $"Pagamento rejeitado: {motivoRejeicao}",
                    Status = StatusPagamento.Rejeitado.ToString(),
                    CodigoErro = cartaoValido ? "CARTAO_002" : "CARTAO_001",
                    DataProcessamento = DateTime.Now
                };
            }
        }

        public async Task<RespostaPagamentoDTO> ProcessarPagamentoBoletoAsync(PagamentoCompletoRequestDTO request, Pagamento pagamento)
        {
            _logger.LogInformation($"Processando pagamento boleto para reserva {request.ReservaId}");
            
            // Simular delay de processamento reduzido
            await Task.Delay(500);

            // Lógica fake para boleto: sempre aprova a geração
            // Mas simula pagamento em 2 segundos (via webhook)
            var comprovante = await GerarComprovanteAsync(pagamento, request);
            
            // Boleto com delay reduzido para testes
            int delayWebhook = 2;
            _ = Task.Run(async () => await SimularWebhookAsync(pagamento.Id, delayWebhook));

            return new RespostaPagamentoDTO
            {
                Sucesso = true,
                Mensagem = "Boleto gerado com sucesso. Aguarde o pagamento para confirmação.",
                PagamentoId = pagamento.Id,
                Status = StatusPagamento.Pendente.ToString(),
                Comprovante = comprovante,
                DataProcessamento = DateTime.Now,
                TempoEstimadoWebhook = delayWebhook
            };
        }

        public Task<ComprovantePagamentoDTO> GerarComprovanteAsync(Pagamento pagamento, PagamentoCompletoRequestDTO request)
        {
            var comprovante = new ComprovantePagamentoDTO
            {
                IdComprovante = Guid.NewGuid().ToString("N")[..12].ToUpper(),
                PagamentoId = pagamento.Id,
                FormaPagamento = pagamento.FormaDePagamento.ToString(),
                Valor = (decimal)pagamento.Valor,
                DataPagamento = pagamento.DataPagamento,
                Status = pagamento.StatusPagamento.ToString(),
                CodigoTransacao = GerarCodigoTransacao(),
                NomeCliente = request.DadosCartao?.NomePortador ?? request.DadosBoleto?.NomePagador ?? "Cliente",
                EmailCliente = request.Email,
                DescricaoReserva = $"Reserva #{pagamento.Reserva.Id} - Pacote Turístico",
                QuantidadeViajantes = pagamento.Reserva.Viajantes?.Count ?? 1
            };

            // Adicionar dados específicos por forma de pagamento
            switch (pagamento.FormaDePagamento)
            {
                case FormaDePagamento.Pix:
                    comprovante.QrCodePix = GerarQrCodePix((decimal)pagamento.Valor, request.DadosPix?.ChavePix ?? "");
                    break;
                    
                case FormaDePagamento.CartaoCredito:
                case FormaDePagamento.CartaoDebito:
                    comprovante.AutorizacaoCartao = _random.Next(100000, 999999).ToString();
                    break;
                    
                case FormaDePagamento.Boleto:
                    comprovante.CodigoBarras = GerarCodigoBarrasBoleto();
                    break;
            }

            return Task.FromResult(comprovante);
        }

        public async Task SimularWebhookAsync(int pagamentoId, int delaySegundos = 5)
        {
            _logger.LogInformation($"Webhook simulado iniciado para pagamento {pagamentoId}. Delay: {delaySegundos}s");
            await Task.Delay(delaySegundos * 1000);

            // 90% de chance de aprovar o pagamento
            bool aprovado = _random.NextDouble() > 0.1;
            var novoStatus = aprovado ? StatusPagamento.Pago : StatusPagamento.Rejeitado;

            // Buscar e atualizar o pagamento diretamente via repositório
            var pagamento = await _pagamentoRepository.BuscarPagamentoPorIdAsync(pagamentoId);
            if (pagamento != null)
            {
                pagamento.StatusPagamento = novoStatus;
                await _pagamentoRepository.AtualizaPagamentoAsync(pagamento);
                _logger.LogInformation($"Webhook executado para pagamento {pagamentoId}. Novo status: {novoStatus}");
                
                // COMENTADO: Envio de email removido para garantir redirecionamento
                // try
                // {
                //     await _emailService.EnviarStatusPagamentoAsync(
                //         "cliente@exemplo.com", // Aqui você pode pegar o email do cliente da reserva
                //         novoStatus.ToString(),
                //         pagamento
                //     );
                // }
                // catch
                // {
                //     // Erro ao enviar email não impede o fluxo nem o redirecionamento
                // }
            }
            else
            {
                _logger.LogWarning($"Pagamento {pagamentoId} não encontrado para webhook");
            }
        }

        public string GerarCodigoTransacao()
        {
            return $"TXN{DateTime.Now:yyyyMMddHHmmss}{_random.Next(1000, 9999)}";
        }

        public string GerarQrCodePix(decimal valor, string chavePix)
        {
            // Simular QR Code PIX (normalmente seria uma string EMVCo)
            return Convert.ToBase64String(Encoding.UTF8.GetBytes($"PIX|{chavePix}|{valor:F2}|{DateTime.Now:yyyy-MM-dd}"));
        }

        public string GerarCodigoBarrasBoleto()
        {
            // Simular código de barras de boleto (48 dígitos)
            var sb = new StringBuilder();
            for (int i = 0; i < 48; i++)
            {
                sb.Append(_random.Next(0, 10));
            }
            return sb.ToString();
        }
    }
}
