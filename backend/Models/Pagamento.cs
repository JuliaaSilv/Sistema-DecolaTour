using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
namespace agencia.Models
{
    [Table("TB_PAGAMENTOS")]        
    public class Pagamento
    {
        [Key]
        public int Id { get; set; } 

        [Required]
        [Column("VALOR")]
        public float Valor { get; set; }

        [Required]
        [Column("FORMA_DE_PAGAMENTO")]    
        public FormaDePagamento FormaDePagamento { get; set; } 

        [Required]
        [Column("DATA_PAGAMENTO")]
        public DateTime DataPagamento { get; set; } 

        [Required]
        [Column("STATUS_PAGAMENTO")]
        public StatusPagamento StatusPagamento { get; set; } = StatusPagamento.Pendente;

        [Required]
        [Column("ID_RESERVA")]
        public int IdReserva { get; set; }
        
        [ForeignKey("ID_RESERVA")]
        public Reserva Reserva { get; set; }
    }
}