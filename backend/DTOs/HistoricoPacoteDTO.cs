public class HistoricoPacoteDTO
{
    public int Id { get; set; }
    public int PacoteId { get; set; }
    public string Titulo { get; set; } = string.Empty;
    public string Descricao { get; set; } = string.Empty;
    public string Destino { get; set; } = string.Empty;
    public int Estrelas { get; set; }
    public int Duracao { get; set; }
    public DateTime DataDisponivel { get; set; }
    public float ValorTotal { get; set; }
    public int QuantidadeMaximaPessoas { get; set; }
    public string? CriadoPor { get; set; }
    public DateTime? CriadoEm { get; set; }
    public string? AtualizadoPor { get; set; }
    public DateTime? AtualizadoEm { get; set; }
    public int VERSAO { get; set; }
    public string Categorias { get; set; } = string.Empty;

}


