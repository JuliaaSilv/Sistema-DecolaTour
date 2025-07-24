using System.ComponentModel.DataAnnotations;

namespace agencia.Models
{
    public class VideoPacote
    {
        public int Id { get; set; }

        [Required]
        public string Url { get; set; }

        public int PacoteId { get; set; }
        public Pacote Pacote { get; set; }
    }
}
