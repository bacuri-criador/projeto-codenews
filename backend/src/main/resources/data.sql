-- Nosso usuário de teste para o login
INSERT INTO usuario (id, login, senha, nome_completo) 
VALUES (1, 'admin@codenews.com', '123456', 'Administrador do Sistema');

-- Alguns atendimentos iniciais
INSERT INTO atendimento (nome, risco, sala, medico, situacao, data_hora_entrada) 
VALUES 
('Ana Souza', 'Emergência', '3', 'Dr. Gabriel Fernandes', 'Em Atendimento', '2025-01-15T11:35:00'),
('Júlia Oliveira', 'Urgente', '5', 'Dr. Gabriel Fernandes', 'A ser Atendido', '2025-01-15T11:33:00'),
('Pedro Pereira', 'Urgente', '2', 'Dr. Letícia Andrade', 'A ser Atendido', '2025-01-15T11:31:00');