-- Script de debug - inserindo dados um por vez para identificar o problema

-- Primeiro, vamos inserir apenas os tipos de usuário
INSERT INTO TB_TIPO_USUARIO (NOME) VALUES ('Cliente');
INSERT INTO TB_TIPO_USUARIO (NOME) VALUES ('Administrador');
INSERT INTO TB_TIPO_USUARIO (NOME) VALUES ('Funcionário');

-- Agora vamos inserir o usuário administrador
INSERT INTO TB_USUARIOS (
    NOME,
    CPF,
    TELEFONE,
    DATA_NASCIMENTO,
    EMAIL,
    EMAIL_COMFIRMADO,
    SENHA,
    TIPO_USUARIO_ID
)
VALUES (
    'Administrador',
    '000.000.000-00',
    '(00) 00000-0000',
    '1990-01-01',
    'admin@decolatour.com',
    1,
    '$2b$12$D5ARIB.W7jXi5aOtGVSc8ecbLyv4ckX8/OhHx.JVWKVTMCZoAW0xm',
    2
);

-- Inserindo usuário cliente
INSERT INTO TB_USUARIOS (
    NOME,
    CPF,
    TELEFONE,
    DATA_NASCIMENTO,
    EMAIL,
    EMAIL_COMFIRMADO,
    SENHA,
    TIPO_USUARIO_ID
)
VALUES (
    'Cliente',
    '110.000.000-01',
    '(00) 00000-0000',
    '1990-01-01',
    'cliente@decolatour.com',
    1,
    '$2b$12$rzXSc291A5pyvxg8E7wvWe9z2L0XLBxchx/BZz7JWTmKW9GUDVThC',
    1
);

-- Inserindo pacote
INSERT INTO TB_PACOTES (TITULO, DESCRICAO, [ORIGEM], DESTINO, DURACAO, DATA_DISPONIVEL, VALOR_UNITARIO, VALOR_TOTAL, [QUANTIDADE_MAXIMA], CATEGORIAS)
VALUES ('Pacote Cancún', 'Viagem completa para Cancún', 'Recife', 'Cancún', 7, '2025-08-01', 6000.00, 6000.00, 1, 'Internacional,Praia');

-- Inserindo reserva
INSERT INTO TB_RESERVAS (USUARIO_ID, PACOTE_ID, NUMERO_RESERVA, DATA_RESERVA, VALOR_UNITARIO, STATUS)
SELECT 
    u.Id, p.Id, 1001, '2025-07-10', 6000.00, 'PENDENTE'
FROM TB_USUARIOS u, TB_PACOTES p
WHERE u.NOME = 'Cliente' AND p.TITULO = 'Pacote Cancún';
