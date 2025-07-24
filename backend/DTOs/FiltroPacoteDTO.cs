namespace agencia.DTOs
{
    public class FiltroPacoteDTO
    {
        public string? Origem { get; set; }
        public string? Destino { get; set; }
        public DateTime? DataIda { get; set; }
        public DateTime? DataVolta { get; set; }
        public int? Viajantes { get; set; }
    }
}
