-- Script para inserir tipos de usuário básicos
-- Execute este script primeiro antes de fazer cadastros

-- Limpar dados existentes (opcional)
-- DELETE FROM TB_TIPO_USUARIO;

-- Inserir tipos de usuário básicos
SET IDENTITY_INSERT TB_TIPO_USUARIO ON;

INSERT INTO TB_TIPO_USUARIO (Id, Nome) VALUES (1, 'Cliente');
INSERT INTO TB_TIPO_USUARIO (Id, Nome) VALUES (2, 'Administrador');
INSERT INTO TB_TIPO_USUARIO (Id, Nome) VALUES (3, 'Funcionário');

SET IDENTITY_INSERT TB_TIPO_USUARIO OFF;

-- Verificar se foi inserido corretamente
SELECT * FROM TB_TIPO_USUARIO;
