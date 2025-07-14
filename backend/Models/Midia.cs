using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace agencia.Models
{
    [Table("TB_MIDIAS")]
    public class Midia
    {
        [Key]
        public int Id { get; set; } 

        [Required]
        [Column("TIPO")]
        public string Tipo { get; set; } = string.Empty;

        [Required]
        [Column("URL")]    
        public string Url { get; set; } = string.Empty;

        [Required]
        [Column("PACOTE_ID")]
        public int PacoteId { get; set; }   
       
        [ForeignKey("PACOTE_ID")]
        public Pacote Pacote { get; set; }

    }
}
