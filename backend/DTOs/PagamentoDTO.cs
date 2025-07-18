using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace agencia.DTOs
{
    public class PagamentoDTO
    {
        public int Id { get; set; }

        public decimal Valor { get; set; }

        public string FormaDePagamento { get; set; } = string.Empty;

        public DateTime DataPagamento { get; set; }

        public string StatusPagamento { get; set; } = string.Empty;

        public int ReservaId { get; set; }
    }
}