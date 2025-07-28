using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace agencia.DTOs
{
    public class PacoteDTO
    {
        public int Id { get; set; }
        public string Titulo { get; set; } = string.Empty;
        public string Descricao { get; set; } = string.Empty;
        public string Destino { get; set; } = string.Empty;
        public string Origem { get; set; } = string.Empty;
        public string Categorias { get; set; } = string.Empty;
        public int Duracao { get; set; }
        public DateTime DataDisponivel { get; set; }
        public float ValorUnitario { get; set; }
        public float ValorTotal { get; set; }
        public string? ImagemUrl { get; set; }

    }
}