using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using agencia.Enum;

namespace agencia.Models
{
    [Table("TB_AVALIACOES")]
    public class Avaliacao
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [Column("STATUS")]
        public StatusAvaliacao Status { get; set; } = StatusAvaliacao.Pendente;

        [Required]
        [Column("NOTA")]    
        public int Nota { get; set; } 
        
        [Required]
        [Column("COMENTARIO")]
        public string Comentario { get; set; } = string.Empty;

        [Required]
        [Column("DATA_AVALIACAO")]
        public DateTime Data { get; set; }

        [Required]
        [Column("ID_RESERVA")]
        public int ReservaId { get; set; }

        [ForeignKey("ReservaId")]
        public Reserva Reserva { get; set; }

    }
}