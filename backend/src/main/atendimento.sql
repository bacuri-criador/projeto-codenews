CREATE TABLE atendimento (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(200) NOT NULL,
    risco VARCHAR(50) NOT NULL,
    sala VARCHAR(10) NOT NULL,
    medico VARCHAR(200) NOT NULL,
    situacao VARCHAR(50) NOT NULL,
    data_hora_entrada TIMESTAMP NOT NULL,
    data_hora_atendimento TIMESTAMP,
    data_hora_saida TIMESTAMP
);