namespace agencia.DTOs
{
    public class CartaoDTO
    {
        public int Id { get; set; }
        public int UsuarioId { get; set; }
        public string NomeTitular { get; set; } = string.Empty;
        public string NumeroCartaoMascarado { get; set; } = string.Empty; // **** **** **** 1234
        public string? NumeroCartao { get; set; } // Número completo (usado apenas para pagamento)
        public string Validade { get; set; } = string.Empty;
        public string TipoCartao { get; set; } = string.Empty;
        public string? Apelido { get; set; }
        public bool Ativo { get; set; }
    }

    public class CreateCartaoDTO
    {
        public string NomeTitular { get; set; } = string.Empty;
        public string NumeroCartao { get; set; } = string.Empty;
        public string Validade { get; set; } = string.Empty;
        public string CVV { get; set; } = string.Empty;
        public string TipoCartao { get; set; } = string.Empty;
        public string? Apelido { get; set; }
    }

    public class UpdateCartaoDTO
    {
        public int Id { get; set; }
        public string NomeTitular { get; set; } = string.Empty;
        public string Validade { get; set; } = string.Empty;
        public string CVV { get; set; } = string.Empty;
        public string TipoCartao { get; set; } = string.Empty;
        public string? Apelido { get; set; }
        public bool Ativo { get; set; }
    }
}
