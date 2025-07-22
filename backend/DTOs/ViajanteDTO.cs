using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace agencia.DTOs
{
    public class ViajanteDTO
    {
        public int Id { get; set; }

        public string Nome { get; set; } = string.Empty;

        public string Documento { get; set; } = string.Empty;

        public string Passaporte { get; set; } = string.Empty;

        public int ReservaId { get; set; }

    }
}