public class PacoteUploadDTO
{
    public string Titulo { get; set; } = string.Empty;
    public string Descricao { get; set; } = string.Empty;
    public string Destino { get; set; } = string.Empty;
    public string Origem { get; set; } = string.Empty;
    public int Duracao { get; set; }
    public DateTime DataDisponivel { get; set; }
    public float ValorUnitario { get; set; }
    public float ValorTotal { get; set; }
    public int QuantidadeMaximaPessoas { get; set; }
    public string Categorias { get; set; } = string.Empty;
    public List<IFormFile> Imagens { get; set; } = new List<IFormFile>();
    public List<IFormFile> Videos { get; set; } = new List<IFormFile>();
    
    // Campos opcionais para dados híbridos
    public string? HotelServices { get; set; }
    public string? Politicas { get; set; }
    public string? Inclusions { get; set; }
    public string? Highlights { get; set; }
    public string? Overview { get; set; }
}
