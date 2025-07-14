 ## ↗️ MODELAGEM DO PROJETO 
```mermaid
 classDiagram

class Usuario {
  +id: int
  +nome: string
  +cpf: string
  +telefone: string
  +dataNascimento: date
  +email: string
  +senha: string
  +tipo: string <<enum>> // "administrador", "atendente", "cliente"
}

class TipoDocumento {
  +idUsuario: int
  +tipoDocumento: string
  +numeroDocumento: string
}

class Reserva {
  +idReserva: int
  +idUsuario: int
  +numeroReserva: int
  +dataReserva: date
  +status: string <<enum>> // "pendente", "confirmada", "cancelada"
  +idPacote: int
  +ValorUnitário: float
}

class Avaliacao {
  +idAvaliacao: int
  +nota: int
  +comentario: string
  +data: date
  +idReserva: int
}

class Pacote {
  +id: int
  +titulo: string
  +descricao: string
  +destino: string
  +duracao: int
  +dataDisponivel: date
  +valorTotal: float
}

class Midia {
  +id: int
  +tipo: string
  +url: string
  +idPacote: int
}

class Pagamento {
  +id: int
  +valor: float
  +formaDePagamento: string <<enum>> // "cartao", "pix", "boleto"
  +dataPagamento: date
  +idReserva: int
  +statusPagamento: string // "pendente", "confirmada", "cancelada"
}

class Viajante {
  +id: int
  +nome: string
  +documento: string
  +passaporte: string
  +idReserva: int
}

class Promocao {
  +id: int
  +nome: string
  +descricao: string
  +descontoPercentual: float
  +dataInicio: date
  +dataFim: date
}

%% ========= RELACIONAMENTOS =========

Usuario "1" --> "N" Reserva : faz
Usuario "1" --> "1" TipoDocumento : possui

Reserva "1" --> "1" Avaliacao : possui
Reserva "1" --> "1" Pagamento : gera
Reserva "1" --> "N" Viajante : inclui
Reserva "N" --> "1" Pacote : seleciona

Pacote "1" --> "N" Midia : contém
Pacote "N" --> "N" Promocao : participa



```
