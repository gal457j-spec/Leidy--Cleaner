-- admin_create.sql
-- Use este script para criar um usuário administrador diretamente no banco.
-- Ajuste nomes das colunas/tabelas conforme seu esquema.

INSERT INTO users (name, email, password_hash, cpf, role, created_at)
VALUES ('Admin Local', 'admin@example.com', '$2b$10$REPLACE_WITH_BCRYPT_HASH', '00000000000', 'admin', NOW());

-- Exemplo para PostgreSQL: atualizar senha usando pgcrypto
-- UPDATE users SET password_hash = crypt('SENHA_FORTE', gen_salt('bf')) WHERE email = 'admin@example.com';
