CREATE TABLE usuario (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    login VARCHAR(150) NOT NULL UNIQUE,
    senha VARCHAR(150) NOT NULL,
    nome_completo VARCHAR(200),
    email VARCHAR(150),
    telefone VARCHAR(20),
    foto_url VARCHAR(255)
);
INSERT INTO usuario (login, senha, nome_completo, email, telefone, foto_url)
VALUES (
    'admin@codenews.com', 
    '123456', 
    'Administrador do Sistema',
    'admin@codenews.com',
    '(63) 90000-0000',
    NULL
);
