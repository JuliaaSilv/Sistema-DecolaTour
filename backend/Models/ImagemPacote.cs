using System.ComponentModel.DataAnnotations;

namespace agencia.Models
{
    public class ImagemPacote
    {
        public int Id { get; set; }

        [Required]
        public string Url { get; set; } = string.Empty;

        public int PacoteId { get; set; }
        public Pacote Pacote { get; set; }
    }
}
