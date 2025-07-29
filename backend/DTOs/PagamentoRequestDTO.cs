using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace agencia.DTOs
{
    public class PagamentoRequestDTO
    {
        public string Metodo { get; set; } // "pix", "cartao", "boleto"
        public int ReservaId { get; set; }
        public string? Email { get; set; }
        // Dados do cartão, se necessário
        public string? CardToken { get; set; }
        public int? Parcelas { get; set; }
    }
}