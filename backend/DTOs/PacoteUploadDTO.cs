public class PacoteUploadDTO
{
    public string Titulo { get; set; } = string.Empty;
    public string Descricao { get; set; } = string.Empty;
    public string Destino { get; set; } = string.Empty;
    public string Origem { get; set; } = string.Empty;
    public int Duracao { get; set; }
    public DateTime DataDisponivel { get; set; }
    public float ValorTotal { get; set; }
    public int QuantidadeMaximaPessoas { get; set; }
    public string Categorias { get; set; } = string.Empty;
    public List<IFormFile> Imagens { get; set; }
    public List<IFormFile> Videos { get; set; }

}
