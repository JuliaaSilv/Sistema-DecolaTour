using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace agencia.DTOs
{
    public class ReservaCompletaDTO
    {
        public int Id { get; set; }
        public string Codigo { get; set; }       // NUMERO_RESERVA → codigo
        public string Cliente { get; set; }      // u.NOME → cliente
        public string Email { get; set; }        // u.EMAIL → email
        public string Pacote { get; set; }       // p.DESCRICAO → pacote
        public string Destino { get; set; }      // p.DESTINO → destino
        public DateTime DataViagem { get; set; } // p.DATA_DISPONIVEL → dataViagem
        public DateTime DataReserva { get; set; }// r.DATA_RESERVA → dataReserva
        public decimal Valor { get; set; }       // p.VALOR_TOTAL → valor
        public string Status { get; set; }       // r.STATUS → status
        
        public int Pessoas { get; set; }    // pg.qnt_viajantes → pessoas
        public string Pagamento { get; set; }    // pg.STATUS_PAGAMENTO → pagamento
    }
}