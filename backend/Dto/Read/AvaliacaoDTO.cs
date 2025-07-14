using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace agencia.Dto.Read
{
    public class AvaliacaoDTO
    {
        public int Id { get; set; }
        public string Comentario { get; set; } = string.Empty;
        public int Nota { get; set; }
        public DateTime Data { get; set; }
        public int ReservaId { get; set; }
        
    }
}