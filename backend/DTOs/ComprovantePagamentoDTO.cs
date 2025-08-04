namespace agencia.DTOs
{
    public class ComprovantePagamentoDTO
    {
        public string IdComprovante { get; set; }
        public int PagamentoId { get; set; }
        public string FormaPagamento { get; set; }
        public decimal Valor { get; set; }
        public DateTime DataPagamento { get; set; }
        public string Status { get; set; }
        public string CodigoTransacao { get; set; }
        public string? CodigoBarras { get; set; } // Para boleto
        public string? QrCodePix { get; set; } // Para PIX
        public string? AutorizacaoCartao { get; set; } // Para cartões
        public string NomeCliente { get; set; }
        public string EmailCliente { get; set; }
        public string DescricaoReserva { get; set; }
        public int QuantidadeViajantes { get; set; }
    }

    public class RespostaPagamentoDTO
    {
        public bool Sucesso { get; set; }
        public string Mensagem { get; set; }
        public int? PagamentoId { get; set; }
        public string Status { get; set; }
        public ComprovantePagamentoDTO? Comprovante { get; set; }
        public string? CodigoErro { get; set; }
        public DateTime DataProcessamento { get; set; }
        public int? TempoEstimadoWebhook { get; set; } // Em segundos
    }
}
