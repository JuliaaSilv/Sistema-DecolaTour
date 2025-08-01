using System.ComponentModel.DataAnnotations;

public class PacoteUploadDTO
{
    [Required(ErrorMessage = "Título é obrigatório")]
    [StringLength(200, ErrorMessage = "Título deve ter no máximo 200 caracteres")]
    public string Titulo { get; set; } = string.Empty;
    
    [Required(ErrorMessage = "Descrição é obrigatória")]
    public string Descricao { get; set; } = string.Empty;
    
    [Required(ErrorMessage = "Destino é obrigatório")]
    [StringLength(100, ErrorMessage = "Destino deve ter no máximo 100 caracteres")]
    public string Destino { get; set; } = string.Empty;
    
    [Range(1, 5, ErrorMessage = "Estrelas deve ser entre 1 e 5")]
    public int Estrelas { get; set; }
    
    [Range(1, int.MaxValue, ErrorMessage = "Duração deve ser maior que zero")]
    public int Duracao { get; set; }
    
    [Required(ErrorMessage = "Data disponível é obrigatória")]
    public DateTime DataDisponivel { get; set; }
    
    [Range(0.01, float.MaxValue, ErrorMessage = "Valor total deve ser maior que zero")]
    public float ValorTotal { get; set; }
    
    [Range(1, int.MaxValue, ErrorMessage = "Quantidade máxima de pessoas deve ser maior que zero")]
    public int QuantidadeMaximaPessoas { get; set; }
    
    [Required(ErrorMessage = "Categorias são obrigatórias")]
    public string Categorias { get; set; } = string.Empty;

    public string? CriadoPor { get; set; } = string.Empty;
    public DateTime? CriadoEm { get; set; } = DateTime.Now;
    public string? AtualizadoPor { get; set; } = string.Empty;
    public DateTime? AtualizadoEm { get; set; } = DateTime.Now;

    public List<IFormFile> Imagens { get; set; } = new List<IFormFile>();
    public List<IFormFile> Videos { get; set; } = new List<IFormFile>();
    
}
