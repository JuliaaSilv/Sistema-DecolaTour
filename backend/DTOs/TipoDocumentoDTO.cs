using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace agencia.DTOs
{
    public class TipoDocumentoDTO
    {
        public int Id { get; set; }

        public string TipoDocumentoNome { get; set; } = string.Empty;

        public string NumeroDocumento { get; set; } = string.Empty;

        public int UsuarioId { get; set; }
    }
}