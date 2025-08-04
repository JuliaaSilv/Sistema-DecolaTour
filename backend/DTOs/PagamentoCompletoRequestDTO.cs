using agencia.Models;

namespace agencia.DTOs
{
    public class PagamentoCompletoRequestDTO
    {
        public int ReservaId { get; set; }
        public FormaDePagamento FormaDePagamento { get; set; }
        public string Email { get; set; }
        
        // Dados específicos para cada forma de pagamento
        public DadosCartaoDTO? DadosCartao { get; set; }
        public DadosPixDTO? DadosPix { get; set; }
        public DadosBoletoDTO? DadosBoleto { get; set; }
    }

    public class DadosCartaoDTO
    {
        public string NumeroCartao { get; set; }
        public string NomePortador { get; set; }
        public string ValidadeMes { get; set; }
        public string ValidadeAno { get; set; }
        public string CVV { get; set; }
        public int Parcelas { get; set; } = 1;
    }

    public class DadosPixDTO
    {
        public string ChavePix { get; set; } // CPF, email, telefone ou chave aleatória
        public string TipoChave { get; set; } // cpf, email, telefone, aleatoria
    }

    public class DadosBoletoDTO
    {
        public string CpfPagador { get; set; }
        public string NomePagador { get; set; }
        public DateTime? DataVencimento { get; set; }
    }
}
