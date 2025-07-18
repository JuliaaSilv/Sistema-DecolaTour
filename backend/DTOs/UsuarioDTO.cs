using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace agencia.DTOs
{
    public class UsuarioDTO
    {
        public int Id { get; set; }

        public string Nome { get; set; } = string.Empty;

        public string Telefone { get; set; } = string.Empty;

        public string Senha { get; set; } = string.Empty;

        public DateTime DataNascimento { get; set; }

        public string Cpf { get; set; } = string.Empty;

        public string Email { get; set; } = string.Empty;

        public int TipoUsuarioId { get; set; }

        public List<TipoDocumentoDTO> Documentos { get; set; } = new List<TipoDocumentoDTO>();
    }
}