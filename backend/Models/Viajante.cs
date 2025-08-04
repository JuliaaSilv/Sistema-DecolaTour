using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace agencia.Models
{
    [Table("TB_VIAGANTES")]
    public class Viajante
    {
        [Key]
        public int Id { get; set; } 

        [Required]
        [Column("NOME")]
        public string Nome { get; set; } = string.Empty;

        [Required]
        [Column("DOCUMENTO")]
        public string Documento { get; set; } = string.Empty;

        [Required]
        [Column("PASSAPORTE")]
        public string Passaporte { get; set; }

        [Required]
        [Column("ID_RESERVA")]
        public int ReservaId { get; set; }
        public Reserva? Reserva { get; set; }
    }
}