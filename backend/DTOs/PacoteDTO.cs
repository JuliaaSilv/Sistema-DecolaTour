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
        public int Estrelas { get; set; }
        public string Categorias { get; set; } = string.Empty;
        public int Duracao { get; set; }
        public DateTime DataDisponivel { get; set; }
        public float ValorTotal { get; set; }
        public int QuantidadeMaximaPessoas { get; set; }
        public string? ImagemUrl { get; set; }
        public List<ImagemPacoteDTO>? Imagens { get; set; }
        public List<VideoPacoteDTO>? Videos { get; set; }

    }

    public class ImagemPacoteDTO
    {
        public string Url { get; set; } = string.Empty;
    }

    public class VideoPacoteDTO
    {
        public string Url { get; set; } = string.Empty;
    }
}