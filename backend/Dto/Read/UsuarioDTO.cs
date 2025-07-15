using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace agencia.Dto.Read
{
    public class UsuarioDTO
    {
        public int Id { get; set; }
        public string Nome { get; set; } = string.Empty;
        public string Cpf { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public int TipoUsuarioId { get; set; }
        public List<TipoDocumentoDTO> Documentos { get; set; } = new List<TipoDocumentoDTO>();
        
    }
}