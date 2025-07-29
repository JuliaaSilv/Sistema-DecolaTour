using System;
using System.Collections.Generic;
namespace agencia.DTOs
{
    public class CreateUsuarioDTO
    {
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
