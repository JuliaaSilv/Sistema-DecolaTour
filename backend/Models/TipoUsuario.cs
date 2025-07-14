
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace agencia.Models
{
    [Table("TB_TIPO_USUARIO")]
    public class TipoUsuario
    {
        [Key]
        public int Id { get; set; }

        
        [Column("NOME")]
        public string Nome { get; set; } = string.Empty;
        
    }
}