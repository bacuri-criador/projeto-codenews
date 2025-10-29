# projeto-codenews
Projeto full-stack de gestão de atendimento médico focado em transparência, referente à Atividade Integrada TADS/UNITINS.

# 🏥 Projeto CodeNews - Gestão de Atendimento Médico

> 🚧 **Status:** Em Desenvolvimento 🚧

[cite_start]Projeto acadêmico da **Atividade Integrada 2025/2** do curso de Análise e Desenvolvimento de Sistemas (TADS) da UNITINS. [cite_start]O objetivo é desenvolver um sistema de gestão de filas e atendimentos médicos para a startup fictícia "CodeNews", com foco principal na transparência de dados e ética no atendimento ao paciente[cite: 8, 9, 10].

---

## 🎯 O Desafio

[cite_start]A "CodeNews" identificou uma lacuna no mercado de softwares médicos: a falta de transparência no uso de dados de pacientes e na gestão de filas de espera em unidades de saúde[cite: 10].

[cite_start]O desafio é desenvolver um sistema que forneça um dashboard em tempo real para os colaboradores gerenciarem a fila (classificação de risco, tempo de espera, médico responsável, etc.), ao mesmo tempo que seja totalmente transparente sobre a coleta e uso de dados, em conformidade com as leis de proteção de dados[cite: 11, 12, 16].

## ✨ Funcionalidades Principais

* [cite_start]**Dashboard em Tempo Real:** Visualização de informações críticas como classificação de risco, tempo de espera, paciente em atendimento, sala, médico e total de atendimentos do dia[cite: 73].
* [cite_start]**Gestão de Pacientes (CRUD):** Telas para cadastro, edição, exclusão e filtros de busca de pacientes[cite: 76, 78].
* [cite_start]**Gestão de Atendimentos (CRUD):** Telas para cadastro, edição, exclusão, visualização de histórico de atendimentos e filtros de busca[cite: 79].
* [cite_start]**Acesso Restrito:** Sistema de login para áreas internas[cite: 75].
* [cite_start]**Transparência:** Exibição clara da Política de Privacidade e Termos de Uso[cite: 74, 108].
* [cite_start]**Página da Equipe:** Apresentação dos integrantes do grupo[cite: 80].

## 🛠️ Tecnologias Utilizadas

Este projeto é uma aplicação full-stack que integra um backend robusto com um frontend moderno.

* **Backend (API)**
    * Java
    * Spring Boot (para criação da API REST)
    * Spring Data JPA (para persistência de dados)
    * H2 (banco de dados em memória para desenvolvimento)

* **Frontend (Web)**
    * TypeScript
    * React (com Vite)
    * Axios (para comunicação com a API)
    * CSS Modules / Styled-Components (para estilização)

* **Design e Prototipagem**
    * [cite_start]Figma (para prototipação de baixa, média ou alta fidelidade [cite: 57, 82])
cd ../frontend
npm install
npm run dev
# A aplicação estará disponível em http://localhost:5173 (ou outra porta indicada)
