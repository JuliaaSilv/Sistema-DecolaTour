using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace agencia.Models
{
    [Table("TB_ENDERECOS")]
    public class Endereco
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [Column("USUARIO_ID")]
        public int UsuarioId { get; set; }

        [Required]
        [Column("CEP")]
        public string CEP { get; set; } = string.Empty;

        [Required]
        [Column("LOGRADOURO")]
        public string Logradouro { get; set; } = string.Empty;

        [Required]
        [Column("NUMERO")]
        public string Numero { get; set; } = string.Empty;

        [Column("COMPLEMENTO")]
        public string? Complemento { get; set; }

        [Required]
        [Column("BAIRRO")]
        public string Bairro { get; set; } = string.Empty;

        [Required]
        [Column("CIDADE")]
        public string Cidade { get; set; } = string.Empty;

        [Required]
        [Column("ESTADO")]
        public string Estado { get; set; } = string.Empty;

        [Required]
        [Column("PAIS")]
        public string Pais { get; set; } = string.Empty;

        [Column("APELIDO")]
        public string? Apelido { get; set; } // Casa, Trabalho, etc

        [Column("ATIVO")]
        public bool Ativo { get; set; } = true;

        [ForeignKey("UsuarioId")]
        [System.Text.Json.Serialization.JsonIgnore]
        public Usuario? Usuario { get; set; }

        public Endereco() { }

        public Endereco(int usuarioId, string cep, string logradouro, string numero, string bairro, string cidade, string estado, string pais)
        {
            UsuarioId = usuarioId;
            CEP = cep;
            Logradouro = logradouro;
            Numero = numero;
            Bairro = bairro;
            Cidade = cidade;
            Estado = estado;
            Pais = pais;
        }

        public string EnderecoCompleto => $"{Logradouro}, {Numero}{(string.IsNullOrEmpty(Complemento) ? "" : $", {Complemento}")}, {Bairro}, {Cidade} - {Estado}, {CEP}";
    }
}
