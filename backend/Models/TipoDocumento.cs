using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace agencia.Models
{
    [Table("TB_DOCUMENTOS")]
    public class TipoDocumento
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [Column("TIPO_DOCUMENTO")]
        public string TipoDocumentoNome { get; set; }

        [Required]
        [Column("NUMERO_DOCUMENTO")]
        public string NumeroDocumento { get; set; }

        [Required]
        [Column("USUARIO_ID")]
        public int UsuarioId { get; set; }

        [ForeignKey("USUARIO_ID")]
        public Usuario Usuario { get; set; }
    }
}
