using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace agencia.Models
{   
    [Table("TB_PROMOCOES")]
    public class Promocao
    {

        [Key]
        public int Id { get; set; }

        [Required]
        [Column("NOME")]
        public string Nome { get; set; }

        [Required]
        [Column("DESCRICAO")]
        public string Descricao { get; set; }

        [Required]
        [Column("DESCONTO_PERCENTUAL")]
        public float DescontoPercentual { get; set; }

        [Required]
        [Column("DATA_INICIO")]
        public DateTime DataInicio { get; set; }

        [Required]
        [Column("DATA_FIM")]
        public DateTime DataFim { get; set; }

        public List<Pacote> Pacotes { get; set; } = new List<Pacote>();
    }
}
