namespace agencia.DTOs
{
    public class ReservaUsuarioDTO
    {

        public int Id { get; set; }
        public string TituloPacote { get; set; }
        public string ImagemPacoteUrl { get; set; }
        public DateTime DataReserva { get; set; }
        public int QuantidadeViajantes { get; set; }
        public decimal ValorTotal { get; set; }
    }
}
