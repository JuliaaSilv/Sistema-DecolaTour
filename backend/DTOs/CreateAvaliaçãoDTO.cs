namespace agencia.DTOs
{
    public class CreateAvaliaçãoDTO
    {
        public string Comentario { get; set; } = string.Empty;
        public int Nota { get; set; }
        public int ReservaId { get; set; }
    }
}
