using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace agencia.Dto.Write
{
    public class PromocaoDTO
    {
        public int Id { get; set; }

        public string Nome { get; set; } = string.Empty;

        public string Descricao { get; set; } = string.Empty;

        public float DescontoPercentual { get; set; }

        public DateTime DataInicio { get; set; }

        public DateTime DataFim { get; set; }
        
        public List<int> PacotesDTO { get; set; } = new List<int>();
        
    }
}