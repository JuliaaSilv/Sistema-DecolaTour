using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;


namespace agencia.Models
{
    [Table("TB_USUARIOS")]
    public class Usuario
    {
        [Key]
        public int Id { get; set; } 

        [Required]
        [Column("NOME")]
        public string Nome { get; set; } = string.Empty;

        [Required]
        [Column("CPF")]
        public string Cpf { get; set; } = string.Empty;

        [Required]
        [Column("TELEFONE")]
        public string Telefone { get; set; } = string.Empty;

        [Required]
        [Column("DATA_NASCIMENTO")]
        public DateTime DataNascimento { get; set; }

        [Required]
        [Column("EMAIL")]
        public string Email { get; set; } = string.Empty;
        
        [Required]
        [Column("SENHA")]
        public string Senha { get; set; } = string.Empty;

        [Required]
        [Column("TIPO_USUARIO_ID")]
        public int TipoUsuarioId { get; set; }

        [ForeignKey("TipoUsuarioId")]
        [System.Text.Json.Serialization.JsonIgnore]
        public TipoUsuario? TipoUsuario { get; set; } 

    }
}