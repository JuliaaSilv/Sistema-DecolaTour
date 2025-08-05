namespace agencia.DTOs
{
    public class AvaliacaoCompletaDTO
    {
        public int Id { get; set; }
        public int Nota { get; set; }
        public string Comentario { get; set; } = string.Empty;
        public DateTime DataAvaliacao { get; set; }
        public string Status { get; set; } = string.Empty;
        public UsuarioDTO? Usuario { get; set; }
        public PacoteDTO? Pacote { get; set; }
        public ReservaDTO? Reserva { get; set; }
    }
}
