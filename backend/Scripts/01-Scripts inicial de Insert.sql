INSERT INTO TB_TIPO_USUARIO (Nome) VALUES ('Cliente');
INSERT INTO TB_TIPO_USUARIO (Nome) VALUES ('Administrador');
INSERT INTO TB_TIPO_USUARIO (Nome) VALUES ('Funcionário');

INSERT INTO [dbo].[TB_USUARIOS] (
    [NOME],
    [CPF],
    [TELEFONE],
    [DATA_NASCIMENTO],
    [EMAIL],
    [EMAIL_COMFIRMADO],
    [TOKEN_EMAILCONFIRMADO],
    [TOKEN_EXPIRACAO_EMAILCONFIRMADO],
    [TOKEN_RECUPERACAO_SENHA],
    [TOKEN_EXPIRACAO_RECUPERACAO_SENHA],
    [SENHA],
    [TIPO_USUARIO_ID]
)
VALUES (
    'Administrador',
    '000.000.000-00',
    '(00) 00000-0000',
    '1990-01-01',
    'admin@decolatour.com',
    1,
    NULL,
    NULL,
    NULL,
    NULL,
    '$2b$12$D5ARIB.W7jXi5aOtGVSc8ecbLyv4ckX8/OhHx.JVWKVTMCZoAW0xm',
    1
);

INSERT INTO [dbo].[TB_USUARIOS] (
    [NOME],
    [CPF],
    [TELEFONE],
    [DATA_NASCIMENTO],
    [EMAIL],
    [EMAIL_COMFIRMADO],
    [TOKEN_EMAILCONFIRMADO],
    [TOKEN_EXPIRACAO_EMAILCONFIRMADO],
    [TOKEN_RECUPERACAO_SENHA],
    [TOKEN_EXPIRACAO_RECUPERACAO_SENHA],
    [SENHA],
    [TIPO_USUARIO_ID]
)
VALUES (
    'Cliente',
    '110.000.000-01',
    '(00) 00000-0000',
    '1990-01-01',
    'cliente@decolatour.com',
    1,
    NULL,
    NULL,
    NULL,
    NULL,
    '$2b$12$rzXSc291A5pyvxg8E7wvWe9z2L0XLBxchx/BZz7JWTmKW9GUDVThC',
    3
);


INSERT INTO TB_PACOTES 
  (TITULO, DESCRICAO, [ORIGEM], DESTINO, CATEGORIAS, DURACAO, DATA_DISPONIVEL, VALOR_UNITARIO, VALOR_TOTAL, [QUANTIDADE_MAXIMA])
VALUES
('Paraíso em Cancún', 'Aproveite dias ensolarados nas praias paradisíacas de Cancún com tudo incluso.', 'Recife', 'Cancún', 'praia, internacional, luxo, all-inclusive', 7, '2025-08-01', 6000.00, 6000.00, 1),
('Romance em Paris', 'Explore a Cidade Luz com direito a passeio na Torre Eiffel, Louvre e gastronomia francesa.', 'Recife', 'Paris', 'internacional, romance, cultura, gastronomia', 10, '2025-09-15', 8500.00, 8500.00, 1),
('Natureza em Noronha', 'Descubra a beleza natural e o mergulho em Fernando de Noronha, um dos paraísos do Brasil.', 'Recife', 'Fernando de Noronha', 'praia, nordeste, ecoturismo, natureza', 5, '2025-08-10', 3500.00, 3500.00, 1),
('Salvador Histórica', 'Mergulhe na cultura afro-brasileira, história colonial e culinária baiana.', 'Recife', 'Salvador', 'cultura, nordeste, cidades históricas, gastronomia', 4, '2025-08-05', 2000.00, 2000.00, 1),
('Rio Maravilhoso', 'Cristo Redentor, Pão de Açúcar e as praias de Copacabana esperam por você.', 'Recife', 'Rio de Janeiro', 'praia, sudeste, paisagens, cultura', 6, '2025-09-01', 3000.00, 3000.00, 1),
('Charmoso Gramado', 'Clima europeu, fondue e Natal Luz tornam Gramado um destino mágico.', 'Recife', 'Gramado', 'serra, sul, inverno, romance', 5, '2025-08-20', 4000.00, 4000.00, 1),
('Sol em Fortaleza', 'Aproveite dias ensolarados e passeios para Canoa Quebrada e Beach Park.', 'Recife', 'Fortaleza', 'praia, nordeste, diversão, gastronomia', 4, '2025-08-12', 2800.00, 2800.00, 1),
('Aventura em Bonito', 'Mergulhos em rios cristalinos, cavernas e natureza exuberante.', 'Recife', 'Bonito', 'ecoturismo, natureza, aventura, centro-oeste', 6, '2025-09-10', 3200.00, 3200.00, 1),
('Imersão na Amazônia', 'Experiência única de selva, fauna e comunidades ribeirinhas.', 'Recife', 'Manaus', 'floresta, natureza, cultura, ecoturismo', 7, '2025-10-01', 5000.00, 5000.00, 1),
('Vida Urbana em SP', 'Conheça museus, shoppings e a diversidade cultural de São Paulo.', 'Recife', 'São Paulo', 'cidade grande, sudeste, cultura, gastronomia', 3, '2025-09-20', 1800.00, 1800.00, 1),
('Curitiba Ecológica', 'Passeio de trem para Morretes, Jardim Botânico e culinária local.', 'Recife', 'Curitiba', 'sul, cultura, cidade modelo, ecologia', 4, '2025-09-25', 2500.00, 2500.00, 1),
('Encantos de Maceió', 'Praias azul-turquesa, piscinas naturais e culinária alagoana.', 'Recife', 'Maceió', 'praia, nordeste, gastronomia, relaxamento', 3, '2025-08-08', 1900.00, 1900.00, 1),
('Recife Cultural', 'Explore Recife e Olinda com frevo, história e belas paisagens.', 'Recife', 'Recife', 'nordeste, cultura, cidades históricas, gastronomia', 2, '2025-08-03', 1500.00, 1500.00, 1),
('Natal Litoral', 'Dunas de Genipabu, artesanato potiguar e muito sol.', 'Recife', 'Natal', 'praia, nordeste, sol, dunas', 3, '2025-08-15', 2100.00, 2100.00, 1),
('Porto de Galinhas Deluxe', 'Resorts, jangadas e piscinas naturais para relaxar com estilo.', 'Recife', 'Porto de Galinhas', 'praia, nordeste, relaxamento, resorts', 2, '2025-08-06', 1600.00, 1600.00, 1),
('Exploração no Jalapão', 'Cachoeiras, fervedouros e trilhas em paisagens únicas.', 'Recife', 'Jalapão', 'ecoturismo, aventura, cerrado, natureza', 6, '2025-10-10', 4200.00, 4200.00, 1),
('Brasília Monumental', 'Arquitetura de Niemeyer, política e história nacional.', 'Recife', 'Brasília', 'cultura, arquitetura, centro-oeste, história', 3, '2025-09-05', 2200.00, 2200.00, 1),
('Chapada Diamantina Mística', 'Cachoeiras, grutas e trilhas em um dos lugares mais belos do Brasil.', 'Recife', 'Chapada Diamantina', 'natureza, trilhas, nordeste, aventura', 7, '2025-09-18', 3900.00, 3900.00, 1),
('Arraial do Cabo Azul', 'Águas cristalinas e passeios de barco em um verdadeiro paraíso.', 'Recife', 'Arraial do Cabo', 'praia, sudeste, mergulho, paisagem', 4, '2025-08-25', 2700.00, 2700.00, 1),
('Foz do Iguaçu Inesquecível', 'Cataratas, Tríplice Fronteira e compras no Paraguai.', 'Recife', 'Foz do Iguaçu', 'cataratas, sul, internacional, natureza', 5, '2025-09-12', 3500.00, 3500.00, 1);


INSERT INTO TB_RESERVAS (USUARIO_ID, PACOTE_ID, NUMERO_RESERVA, DATA_RESERVA, VALOR_UNITARIO, STATUS)
SELECT 
    u.Id, p.Id, 1001, '2025-07-10', 6000.00, 1
FROM TB_USUARIOS U, TB_PACOTES p
WHERE U.NOME = 'Maria Lima' AND P.TITULO = 'Pacote Cancún';


