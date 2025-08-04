using System;
namespace agencia.DTOs
{
    public class CreateReservaDTO
    {
        public decimal ValorUnitario { get; set; }
        public int UsuarioId { get; set; }
        public int PacoteId { get; set; }
        public DateTime DataViagem { get; set; }
        public int? QuantidadeViajantes { get; set; }
        public decimal? ValorTotal { get; set; }
    }
}
