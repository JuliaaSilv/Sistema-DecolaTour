using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
namespace agencia.Models
{
    [Table("TB_RESERVAS")]
    public class Reserva
    {
        [Key]
        public int Id { get; set; } 

        [Required]
        [Column("NUMERO_RESERVA")]
        public int NumeroReserva { get; set; } 

        [Required]
        [Column("DATA_RESERVA")]
        public DateTime DataReserva { get; set; } 

        [Required]
        [Column("STATUS")]
        public string Status { get; set; } = "PENDENTE";

        [Required]
        [Column("VALOR_UNITARIO")]
        public float ValorUnitario { get; set; } 

        [Required]
        [ForeignKey("USUARIO_ID")]
        public Usuario Usuario { get; set; } 

        [Required]
        [Column("PACOTE_ID")]
        public int PacoteId { get; set; } 

        [ForeignKey("PACOTE_ID")]
        public Pacote Pacote { get; set; }

        public List<Viajante> Viajantes { get; set; } 
    }
}