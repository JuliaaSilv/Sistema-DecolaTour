using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace agencia.Models
{
    [Table("TB_PACOTES")]
    public class Pacote
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [Column("TITULO")]
        public string Titulo { get; set; } = string.Empty;

        [Required]
        [Column("DESCRICAO")]
        public string Descricao { get; set; } = string.Empty;

        [Required]
        [Column("DESTINO")]
        public string Destino { get; set; } = string.Empty;

        [Required]
        [Column("ESTRELAS")]
        public int Estrelas { get; set; }

        [Required]
        [Column("DURACAO")]
        public int Duracao { get; set; }

        [Required]
        [Column("DATA_DISPONIVEL")]
        public DateTime DataDisponivel { get; set; }

        [Required]
        [Column("VALOR_TOTAL")]
        public float ValorTotal { get; set; }
        [Required]
        [Column("QUANTIDADE_MAXIMA")]
        public int QuantidadeMaximaPessoas { get; set; }

        [Column("CATEGORIAS")]
        public string Categorias { get; set; } = string.Empty;

        public ICollection<ImagemPacote> Imagens { get; set; } = new List<ImagemPacote>();
        public ICollection<VideoPacote> Videos { get; set; } = new List<VideoPacote>();
    }
}
