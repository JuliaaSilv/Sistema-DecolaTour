using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace agencia.Models
{
    [Table("TB_CARTOES")]
    public class Cartao
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [Column("USUARIO_ID")]
        public int UsuarioId { get; set; }

        [Required]
        [Column("NOME_TITULAR")]
        public string NomeTitular { get; set; } = string.Empty;

        [Required]
        [Column("NUMERO_CARTAO")]
        public string NumeroCartao { get; set; } = string.Empty;

        [Required]
        [Column("VALIDADE")]
        public string Validade { get; set; } = string.Empty;

        [Required]
        [Column("CVV")]
        public string CVV { get; set; } = string.Empty;

        [Required]
        [Column("TIPO_CARTAO")]
        public string TipoCartao { get; set; } = string.Empty; // Crédito, Débito

        [Column("APELIDO")]
        public string? Apelido { get; set; } // Nome personalizado para o cartão

        [Column("ATIVO")]
        public bool Ativo { get; set; } = true;

        [ForeignKey("UsuarioId")]
        [System.Text.Json.Serialization.JsonIgnore]
        public Usuario? Usuario { get; set; }

        public Cartao() { }

        public Cartao(int usuarioId, string nomeTitular, string numeroCartao, string validade, string cvv, string tipoCartao)
        {
            UsuarioId = usuarioId;
            NomeTitular = nomeTitular;
            NumeroCartao = numeroCartao;
            Validade = validade;
            CVV = cvv;
            TipoCartao = tipoCartao;
        }
    }
}
