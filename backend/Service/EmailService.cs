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
    public class EmailService : IEmailService
    {
     
   
            private readonly EmailSettings _emailSettings;

            public EmailService(IOptions<EmailSettings> emailSettings)
            {
                _emailSettings = emailSettings.Value;
            }

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
    }
}
   
