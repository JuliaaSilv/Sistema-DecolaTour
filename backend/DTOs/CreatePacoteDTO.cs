using System;
namespace agencia.DTOs
{
    public class CreatePacoteDTO
    {
        public string? Titulo { get; set; }
        public string? Descricao { get; set; }
        public string? Destino { get; set; }
        public int? Estrelas { get; set; }

        public string? Categorias { get; set; }
        public int? Duracao { get; set; }
        public DateTime? DataDisponivel { get; set; }
        public float? ValorTotal { get; set; }
        public int? QuantidadeMaximaPessoas { get; set; }

        // Uploads
        public List<IFormFile>? Imagens { get; set; }
        public List<IFormFile>? Videos { get; set; }

    }
}
