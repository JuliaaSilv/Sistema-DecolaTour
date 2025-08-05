namespace agencia.DTOs
{
    public class ReservaParaAvaliacaoDTO
    {
        public int Id { get; set; }
        public string NumeroReserva { get; set; } = string.Empty;
        public DateTime DataReserva { get; set; }
        public UsuarioDTO? Usuario { get; set; }
        public PacoteDTO? Pacote { get; set; }
    }
}
