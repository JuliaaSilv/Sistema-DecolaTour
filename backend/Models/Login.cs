using System.ComponentModel.DataAnnotations;

namespace agencia.Models
{
    public class Login
    {
        [Required(ErrorMessage = "O campo 'Email' é obrigatório.")]
        [EmailAddress(ErrorMessage = "O campo 'Email' deve conter um endereço de email válido.")]
        [DataType(DataType.EmailAddress)]
        public required string Email { get; set; }


        [Required(ErrorMessage = "O campo 'Senha' é obrigatório.")]
        [MinLength(6, ErrorMessage = "A senha deve ter no mínimo 6 caracteres.")]
        [DataType(DataType.Password)]
        public required string Senha { get; set; }
    }
}
