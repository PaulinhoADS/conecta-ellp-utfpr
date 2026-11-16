# Documento de Requisitos - Conecta ELLP

Este documento detalha os Requisitos Funcionais (RF) e os Requisitos Não Funcionais (RNF) mapeados e implementados no sistema **Conecta ELLP**, desenvolvido para a gestão e triagem do projeto de extensão Ensino Lúdico de Lógica e Programação (ELLP) da UTFPR Câmpus Cornélio Procópio.

---

## Requisitos Funcionais (RF)

*O que o sistema faz (Funcionalidades, regras de negócio e interações com o usuário).*

- **RF01 (Concluído):** O sistema deve permitir o cadastro, edição, listagem, filtragem e inativação (*soft delete*) de instituições parceiras (Escolas Públicas, ONGs e Creches) com máscaras de CNPJ e telefone.
- **RF02 (Concluído):** O sistema deve fornecer um ambiente web interativo para a execução do questionário dinâmico **"Quiz Perfil Tech"** pelos alunos inscritos.
- **RF03 (Concluído):** O sistema deve recomendar de forma automatizada a oficina real do ELLP mais adequada ao perfil e à faixa etária do aluno (Robótica LEGO, Robótica com Arduino, Modelagem 3D, Fábrica de Sites ou Desenvolvimento de Jogos) com base nas respostas do quiz, atualizando seu perfil.
- **RF04 (Concluído):** O sistema deve disponibilizar um Painel Administrativo (Dashboard) para coordenadores e voluntários com indicadores dinâmicos de oficinas, escolas, alunos e solicitações pendentes.
- **RF05 (Concluído):** O painel da escola deve permitir a aprovação de credenciamento por administradores e a emissão de **Carta-Convite Oficial** formatada para impressão/PDF.
- **RF06 (Concluído):** O sistema deve permitir o gerenciamento completo (CRUD) do catálogo de oficinas regulares, incluindo controle de vagas e ativação/inativação.
- **RF07 (Concluído):** O sistema deve possuir o módulo de gestão da equipe administrativa e voluntários (CRUD), diferenciando os níveis de acesso entre **Professor/Coordenador (`superadmin`)** e **Estudante Voluntário (`admin`)**, com suporte a *soft delete*.
- **RF08 (Concluído):** O sistema deve permitir que as escolas cadastrem seus alunos vinculados, gerando automaticamente um *username* padronizado e uma **senha temporária criptograficamente segura**, além de disponibilizar modal para redefinição de senha.
- **RF09 (Planejado / Evolução Futura):** Alocação em lote (algoritmo guloso automatizado para fechamento semestral de turmas em nuvem) e geração de certificados de participação em PDF para alunos concluintes.

---

## Requisitos Não Funcionais (RNF)

*Como o sistema se comporta (Arquitetura, desempenho, segurança, usabilidade e tecnologias).*

- **RNF01 (Concluído):** O sistema deve ser desenvolvido como uma aplicação web responsiva do tipo *Single Page Application* (SPA), adaptando-se a computadores e dispositivos móveis.
- **RNF02 (Concluído):** O Front-end deve ser construído utilizando React (com Vite), React Router DOM para roteamento protegido, Axios e estilização CSS modularizada sob a metodologia BEM (*Block, Element, Modifier*).
- **RNF03 (Concluído):** O Back-end deve ser estruturado como uma API RESTful em Node.js com o framework Express.
- **RNF04 (Concluído):** A modelagem de dados relacional deve utilizar PostgreSQL mapeado via ORM Sequelize (`Escola`, `Aluno`, `Oficina` e `Administrador`), contando também com camada de persistência local (`localStorage` *seed*) no Front-end para execução e testes imediatos sem dependência obrigatória de banco externo ativo.
- **RNF05 (Concluído):** O controle de acesso no Front-end deve implementar RBAC (*Role-Based Access Control*) via `AuthContext` e `ProtectedRoute`, restringindo rotas e ações conforme os 4 perfis do sistema (`superadmin`, `admin`, `escola` e `aluno`) e validando a propriedade dos registros (*ownership*).
- **RNF06 (Concluído):** Os componentes interativos (como modais, formulários e menus) devem seguir boas práticas de acessibilidade web (atributos ARIA, navegação por teclado, *focus trap* e retorno de foco).
- **RNF07 (Concluído):** A geração de senhas temporárias para estudantes deve utilizar a Web Crypto API (`crypto.getRandomValues`) para garantir entropia e segurança.