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

        public Usuario(string nome, string cpf, string telefone, DateTime dataNascimento, string email, string senha, TipoUsuario tipoUsuario)
        {
            Nome = nome;
            Cpf = cpf;
            Telefone = telefone;
            DataNascimento = dataNascimento;
            Email = email;
            Senha = senha;
            TipoUsuario = TipoUsuario;
        }

        public Usuario(string email, string senha)
        {
            Email = email;
            Senha = senha;

        }

        public Usuario()
        {
        }

        public void AlterarSenha(string senha)
        {
            Senha = senha;
        }



    }
}
    
    
