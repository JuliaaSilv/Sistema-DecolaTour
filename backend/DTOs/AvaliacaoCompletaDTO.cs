using System;

namespace agencia.DTOs
{
    public class AvaliacaoCompletaDTO
    {
        public int Id { get; set; }
        public string Comentario { get; set; } = string.Empty;
        public int Nota { get; set; }
        public DateTime Data { get; set; }
        public int ReservaId { get; set; }
        
        // Dados da reserva e usuário
        public ReservaParaAvaliacaoDTO? Reserva { get; set; }
    }

    public class ReservaParaAvaliacaoDTO
    {
        public int Id { get; set; }
        public int NumeroReserva { get; set; }
        public DateTime DataReserva { get; set; }
        public string Status { get; set; } = string.Empty;
        public decimal ValorUnitario { get; set; }
        public int UsuarioId { get; set; }
        public int PacoteId { get; set; }
        public int QuantidadeViajantes { get; set; }
        public decimal ValorTotal => ValorUnitario * QuantidadeViajantes;
        
        // Dados do usuário
        public UsuarioDTO? Usuario { get; set; }
    }
}
