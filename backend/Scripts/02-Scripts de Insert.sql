-- Usuarios

INSERT INTO Usuarios(Nome, Cpf, Telefone, DataNascimento, Email, Senha, Tipo)
VALUES 
('Maria Lima', '12345678900', '11999999999', '1990-05-10', 'maria@email.com', '123456', 0),
('Carlos Souza', '98765432100', '11988887777', '1985-07-20', 'carlos@email.com', 'senhaSegura', 1);

-- TipoDocumento


INSERT INTO TipoDocumento (NumeroDocumento, [UsuarioId],TipoDocumentoNome)
SELECT 'AB123456', ID, 'PASSAPORTE' FROM Usuarios WHERE NOME = 'Maria Lima';

INSERT INTO TipoDocumento (NumeroDocumento, [UsuarioId],TipoDocumentoNome)
SELECT 'RG987654', ID, 'RG' FROM Usuarios WHERE NOME = 'Carlos Souza';


-- Pacotes 

INSERT INTO Pacotes (Titulo, Descricao, Destino, Duracao, DataDisponivel, ValorTotal)
VALUES 
('Pacote Cancún', 'Viagem completa para Cancún', 'Cancún', 7, '2025-08-01', 6000.00),
('Pacote Paris', 'Viagem dos sonhos para Paris', 'Paris', 10, '2025-09-15', 8500.00);

-- Promocoes

INSERT INTO Promocoes (Nome, Descricao, DescontoPercentual, DataInicio, DataFim)
VALUES 
('Verão Quente', 'Desconto especial para o verão', 15.0, '2025-07-01', '2025-09-01'),
('Black Friday', 'Super desconto relampago', 25.0, '2025-11-20', '2025-11-30');

-- Promoções dos Pacotes.

INSERT INTO Pacotes (Titulo, Descricao, Destino, Duracao, DataDisponivel, ValorTotal, PromocaoId)
select p.Titulo +  ' -  '  + pr.Nome Titulo, p.Descricao +  ' - '  + pr.Nome Descricao, p.Destino, p.Duracao, p.DataDisponivel, p.ValorTotal, pr.id from Pacotes p, Promocoes pr

-- Reservas

INSERT INTO Reservas ([UsuarioId], [PacoteId], NumeroReserva, DataReserva, ValorUnitario, Status)
SELECT 
    u.Id, p.Id, 1001, '2025-07-10', 6000.00, 1
FROM Usuarios U, Pacotes p
WHERE U.NOME = 'Maria Lima' AND P.TITULO = 'Pacote Cancún -  Black Friday';

 -- Pagamentos

INSERT INTO Pagamentos (ReservaId, Valor, FormaDePagamento, DataPagamento, StatusPagamento)
SELECT R.Id ReservaId, 6000.00, 'PIX', '2025-07-12', 'CONFIRMADA'
FROM Reservas R
WHERE NumeroReserva = 1001;


-- Avaliações

INSERT INTO Avaliacoes (ReservaId, Nota, [Data],  Comentario)
SELECT Id, 5, '2025-07-12' , 'Viagem maravilhosa, tudo perfeito!' FROM Reservas WHERE NumeroReserva = 1001;


-- Viajantes

INSERT INTO Viajantes (ReservaId, Nome, Documento, Passaporte)
SELECT Id, 'Ana Beatriz', '12345678900', 'XP112233'
FROM Reservas
WHERE NumeroReserva = 1001;


-- Mídia 

INSERT INTO Midias (Tipo, Url, PacoteId)
SELECT 'imagem', 'https://viajar.com/cancun.jpg', ID FROM Pacotes WHERE TITULO = 'Pacote Cancún';

INSERT INTO Midias (Tipo, URL, PacoteId)
SELECT 'video', 'https://viajar.com/paris.mp4', ID FROM Pacotes WHERE TITULO = 'Pacote Paris';
