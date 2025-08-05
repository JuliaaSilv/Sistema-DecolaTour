namespace agencia.DTOs
{
    public class ReservaUsuarioDTO
    {
        public int Id { get; set; }
        public int NumeroReserva { get; set; }
        public string TituloPacote { get; set; } = string.Empty;
        public string ImagemPacoteUrl { get; set; } = string.Empty;
        public DateTime DataReserva { get; set; }
        public DateTime? DataViagem { get; set; }
        public int QuantidadeViajantes { get; set; }
        public decimal ValorTotal { get; set; }
    }
}
