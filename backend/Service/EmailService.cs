using agencia.Interfaces.Services;
using agencia.Models;
using MailKit.Net.Smtp;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Options;
using MimeKit;
using System.Net;
using System.Net.Mail;
using System.Net.Mime;
using System.Threading.Tasks;

namespace agencia.Service
{
    /// <summary>
    /// Serviço responsável pelo envio de e-mails, incluindo templates de status de pagamento.
    /// </summary>
    public class EmailService : IEmailService
    {
     
   
            private readonly EmailSettings _emailSettings;

            public EmailService(IOptions<EmailSettings> emailSettings)
            {
                _emailSettings = emailSettings.Value;
            }

        /// <summary>
        /// Envia um e-mail simples para o destinatário informado.
        /// </summary>
        public async Task EnviarEmailAsync(string destinatario, string assunto, string mensagem)
        {
            if (string.IsNullOrWhiteSpace(destinatario))
                throw new ArgumentException("Destinatário do e-mail não pode ser nulo ou vazio.", nameof(destinatario));

            var message = new MailMessage
            {
                From = new MailAddress(_emailSettings.From),
                Subject = assunto,
                Body = mensagem,
                IsBodyHtml = true
            };
            message.To.Add(new MailAddress(destinatario));

            using (var client = new System.Net.Mail.SmtpClient(_emailSettings.SmtpServer, _emailSettings.Port))
            {
                client.Credentials = new NetworkCredential(_emailSettings.UserName, _emailSettings.Password);
                client.EnableSsl = _emailSettings.EnableSsl;
                await client.SendMailAsync(message);
            }
        }

        /// <summary>
        /// Envia um e-mail de status de pagamento (aprovado ou reprovado) usando template HTML.
        /// </summary>
        public async Task EnviarStatusPagamentoAsync(string destinatario, string status, object pagamento)
        {
            // Carregar template de acordo com o status
            string templatePath = status.ToLower() == "aprovado"
                ? "Templates/pagamento_aprovado.html"
                : "Templates/pagamento_reprovado.html";

            string html = System.IO.File.ReadAllText(templatePath);

            // Substituir variáveis do template
            html = html.Replace("{{valor}}", pagamento?.GetType().GetProperty("Valor")?.GetValue(pagamento)?.ToString() ?? "-");
            html = html.Replace("{{metodo}}", pagamento?.GetType().GetProperty("Metodo")?.GetValue(pagamento)?.ToString() ?? "-");
            html = html.Replace("{{status}}", status);

            string assunto = status.ToLower() == "aprovado" ? "Pagamento aprovado" : "Pagamento reprovado";
            await EnviarEmailAsync(destinatario, assunto, html);
        }
    }
}
   
