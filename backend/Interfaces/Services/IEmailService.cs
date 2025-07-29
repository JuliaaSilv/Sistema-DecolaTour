namespace agencia.Interfaces.Services
{
    public interface IEmailService
    {
        Task EnviarEmailAsync(string destinatario, string assunto, string mensagem);
        Task EnviarStatusPagamentoAsync(string destinatario, string status, object pagamento);
    }
}
