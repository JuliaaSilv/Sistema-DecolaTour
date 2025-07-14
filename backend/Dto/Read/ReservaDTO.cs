using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace agencia.Dto.Read
{
    public class ReservaDTO
    {
        public int Id { get; set; }
        public int NumeroReserva { get; set; }
        public DateTime DataReserva { get; set; }
        public decimal ValorUnitario { get; set; }
        public string Status { get; set; } = string.Empty;
        public int UsuarioId { get; set; }
        public int PacoteId { get; set; }

    }
}