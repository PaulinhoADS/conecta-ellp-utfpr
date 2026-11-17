# Conecta ELLP (UTFPR - Câmpus Cornélio Procópio)

**Plataforma Integrada de Gestão, Credenciamento Escolar e Triagem Baseada em Perfis para o Projeto de Extensão ELLP.**

> Projeto desenvolvido para a disciplina de **Certificadora da Competência Identitária (AS65A)** — Curso Superior de Tecnologia em Análise e Desenvolvimento de Sistemas — Universidade Tecnológica Federal do Paraná (UTFPR), Câmpus Cornélio Procópio.

---

## Equipe Desenvolvedora (Grupo 05)
- **Paulo Cesar Leite** — Representante / Arquitetura Full-Stack, Integração & Documentação
- **Carlos Henrique de Andrade** — Front-end (Módulo de Equipe/Voluntários) & Algoritmos
- **Higor Claro da Silva** — Front-end (Módulo de Escolas Parceiras e Alunos) & Prototipação
- **João Bosco Salviano de Carvalho** — Back-end, Rotas REST & Modelagem de Banco de Dados
- **Victor Hugo Concolato Neves** — Front-end (Painel Admin, Oficinas, RBAC & UI/UX) & Revisão Arquitetural

---

## Sobre o Projeto

### A Ideia
O **Conecta ELLP** é uma plataforma web Full-Stack completa (Front-end e Back-end integrados) criada para modernizar o gerenciamento e a triagem de participantes do programa de extensão **ELLP (Ensino Lúdico de Lógica e Programação)**. A solução permite o credenciamento de escolas parceiras, a emissão de cartas-convite oficiais, o cadastro de estudantes com geração automática de credenciais, a gestão de oficinas e voluntários com controle de vagas, e traz como diferencial o **"Quiz Perfil Tech"** — um motor de recomendação baseado em árvore de decisão que cruza a faixa etária e as aptidões do estudante para indicar e vincular a oficina ideal da grade do projeto.

### Sobre o Programa ELLP (UTFPR-CP)
Sob a coordenação do **Prof. Antonio Carlos Fernandes da Silva**, o programa ELLP promove inclusão digital e educação tecnológica para a comunidade de Cornélio Procópio e região, utilizando a programação e a robótica como ferramentas de reforço escolar em matemática e ciências.
- **Público-alvo:** Crianças e adolescentes (a partir de 10 anos) de escolas públicas, ONGs e projetos sociais.
- **Grade de Oficinas Reais no Sistema:** Robótica LEGO, Robótica com Arduino (10+), Modelagem 3D (12+), Fábrica de Sites (13+) e Desenvolvimento de Jogos.
- **Execução:** Aulas presenciais aos sábados na UTFPR-CP, ministradas por estudantes voluntários.
- **Site Oficial:** [https://grupoellp.com.br](https://grupoellp.com.br)

### Motivação e Problema Resolvido
A expansão do ELLP esbarrava na burocracia de controles manuais em planilhas e na alocação genérica dos alunos das escolas parceiras, o que frequentemente gerava evasão quando um estudante era alocado em uma turma incompatível com sua idade ou interesse. O **Conecta ELLP** centraliza toda a operação administrativa em banco de dados relacional e garante uma triagem personalizada para cada jovem.

---

## Especificações Técnicas e Arquitetura

- **Front-end (SPA):** React 19 (Vite), React Router DOM v7 (rotas aninhadas e guardas de rota `ProtectedRoute`), Context API (`AuthContext`), Axios (com *interceptors* injetando o token JWT) e CSS3 estruturado com variáveis globais e metodologia **BEM (Block, Element, Modifier)**.
- **Back-end (API REST Modularizada):** Node.js, Express 5, CORS, Dotenv, `bcryptjs` (criptografia de senhas em hash) e `jsonwebtoken` (autenticação JWT), organizados em `config/`, `models/`, `controllers/`, `routes/` e `middlewares/`.
- **Banco de Dados Relacional e Auto-Seed:** **PostgreSQL** mapeado via ORM **Sequelize** com 5 entidades relacionais (`Usuario`, `Escola`, `Aluno`, `Oficina` e `Administrador`). Ao iniciar o servidor (`node server.js`), caso o banco esteja vazio, uma rotina automática de **Database Seeding** popula as oficinas reais do ELLP, a equipe de coordenadores/voluntários, as escolas parceiras e os alunos iniciais para avaliação imediata.
- **Segurança e Controle de Acesso (RBAC + Ownership):** Autenticação centralizada na tabela `usuarios` e controle de permissões tanto no Back-end (`authMiddleware`) quanto no Front-end (`ProtectedRoute`) baseado em 4 papéis (`superadmin`, `admin`, `escola` e `aluno`), verificação estrita de propriedade de registro (*ownership*), geração de senhas via Web Crypto API (`crypto.getRandomValues`) e modal acessível de redefinição de senha.

---

## Funcionalidades Implementadas e Guia de Navegação

1. **Página Inicial Institucional (`/`) e Quiz Perfil Tech (`/quiz`):**
   - Apresentação interativa das 5 oficinas reais do ELLP, seção institucional sobre o programa e acesso direto ao **Quiz Perfil Tech**.
   - O Quiz avalia idade, interesses tecnológicos e estilo de aprendizagem via árvore de decisão booleana. Se o aluno estiver logado, o resultado atualiza automaticamente seu cadastro no PostgreSQL e vincula sua vaga (`oficinaId`).
2. **Painel Administrativo — Dashboard (`/admin`):**
   - Exclusivo para Coordenação (`superadmin`) e Voluntários (`admin`). Exibe contadores em tempo real vindos da API (administradores ativos, oficinas ativas, escolas aprovadas e alunos ativos), lista solicitações de escolas pendentes e oferece atalhos rápidos.
3. **Gestão de Escolas Parceiras e Carta-Convite (`/escolas` e `/escolas/:id`):**
   - Listagem com resumo de métricas, busca por nome/CNPJ/responsável e filtro por status (*Aprovada*, *Pendente*, *Inativa*).
   - No painel de detalhes da escola (`/escolas/:id`), a coordenação pode **aprovar a instituição em 1 clique** (ativando o login da escola) e **emitir a Carta-Convite Oficial da UTFPR**, pronta para impressão ou salvamento em PDF (`@media print`).
4. **Gestão de Alunos, Controle de Vagas e Senhas (`/escolas/:id` e `/escolas/:escolaId/alunos/:id`):**
   - Dentro do painel da escola, é possível cadastrar os alunos encaminhados. O sistema sugere automaticamente o `@username`, gera uma **senha inicial segura** (gravada com hash `bcrypt` na tabela `usuarios`) e valida o limite de vagas da oficina escolhida.
   - Tela exclusiva de perfil do estudante com verificação de *ownership*, inativação lógica (*soft delete*) e redefinição de senha (`PUT /auth/senha`).
5. **Catálogo e CRUD de Oficinas (`/oficinas`, `/oficinas/nova`, `/oficinas/:id`):**
   - Consulta pública das oficinas do ELLP e, para administradores, criação, edição, controle de limite de vagas e chave seletora (*switch*) para ativar/inativar turmas preservando o histórico.
6. **Gestão de Equipe Administrativa e Voluntários (`/administradores` e `/voluntarios`):**
   - Cadastro e controle de membros da equipe no PostgreSQL diferenciando **Professor/Coordenador (`superadmin`)** e **Voluntário (`admin`)**, com busca dinâmica, filtro por status e inativação (*soft delete*) com notificações *Toast*.

---

## Dados de Acesso e Perfis para Teste (Avaliação)

Ao iniciar o sistema pela primeira vez com o Back-end rodando, o `AuthContext` realiza login automático na API como **Superadmin** (`admin`) para facilitar a inspeção imediata de todas as telas pelo avaliador.

Caso deseje testar a tela de Login (`/login`) ou alternar entre as visões de cada tipo de usuário (clique no ícone de perfil no topo direito -> **Sair**), você pode usar os **4 Botões de Login Rápido** na própria tela de Login ou digitar qualquer um dos usuários reais abaixo criados pelo *Seed* no PostgreSQL com a senha padrão **`ellp12345`**:

| Perfil de Acesso | Usuário para Login (`login`) | Senha Padrão | Papel (`role`) | O que pode acessar e testar |
| :--- | :--- | :--- | :--- | :--- |
| **Coordenação (Prof. Antonio)** | `admin` | `ellp12345` | `superadmin` | Acesso total: Dashboard, Escolas, Carta-Convite, Oficinas, Equipe e Alunos. |
| **Estudante Voluntário** | `pauloleite@alunos.utfpr.edu.br` | `ellp12345` | `admin` | Gestão operacional do Dashboard, Oficinas, Escolas e Equipe. |
| **Escola Parceira** | `direcao@monteirolobato.pr.gov.br` | `ellp12345` | `escola` | Acesso restrito ao painel da própria escola (`/escolas/1`) e gestão de seus alunos. |
| **Estudante (Aluno)** | `lucas.martins` | `ellp12345` | `aluno` | Acesso restrito ao próprio perfil (`/escolas/1/alunos/1`), redefinição de senha e Quiz. |

---

## Documentação, Requisitos e Banco de Dados

- **Requisitos Funcionais e Não Funcionais:** [Clique aqui para ler o Documento de Requisitos (RF / RNF)](docs/requisitos.md)
- **Diagrama Entidade-Relacionamento (DER):** [Clique aqui para visualizar o Diagrama de Banco de Dados](docs/DER-BD.png)

### Capturas de Tela do Sistema (Versão Final)
- [Visualizar a Tela Inicial — Hero e Oficinas (Home)](docs/tela-home.png)
- [Visualizar a Seção Institucional e Chamada do Quiz (Home)](docs/tela-home2.png)
- [Visualizar o Motor de Recomendação (Quiz Perfil Tech)](docs/tela-quiz.png)
- [Visualizar a Tela de Login e Acesso Rápido Multi-Perfil](docs/tela-login.png)
- [Visualizar o Painel Administrativo (Dashboard)](docs/tela-dashboard.png)
- [Visualizar o Painel da Escola Parceira, Alunos e Carta-Convite](docs/tela-escolas.png)
- [Visualizar o Catálogo e Gestão de Oficinas](docs/tela-oficinas.png)
- [Visualizar a Gestão de Equipe Administrativa e Voluntários](docs/tela-voluntarios.png)

*(Protótipos iniciais da Etapa 1: [Protótipo Home](docs/prototipo-tela-home.png) | [Protótipo Quiz](docs/prototipo-tela-quiz.png))*

---

## Cronograma Executado

- **Setembro (Semanas 3 e 4):** Levantamento de requisitos, estruturação do repositório, modelagem inicial do Banco de Dados e prototipação.
- **Outubro (Semanas 1 e 2):** Estruturação do Back-end (Node.js/Sequelize), gravação do Pitch e apresentação do Seminário de Relatório (16/10).
- **Outubro (Semanas 3 e 4):** Desenvolvimento da interface em React (Home, Quiz com oficinas reais do ELLP, Login e estilização BEM).
- **Novembro (Semanas 1 e 2):** Construção dos módulos de CRUD (Oficinas, Escolas, Alunos, Equipe/Voluntários), Dashboard Administrativo, Carta-Convite e controle de rotas RBAC.
- **Novembro (Semanas 3 e 4):** Refatoração arquitetural do Back-end (entidade `Usuario`, hash `bcrypt`, autenticação JWT, controle de vagas), integração 100% via Axios com PostgreSQL, documentação final, Relatório em PDF e gravação dos vídeos individuais (Entrega Final 30/11).

---

## Como Rodar Este Projeto na Sua Máquina

### Opção 1: Download Direto (Sem Git)
1. No topo desta página do GitHub, clique no botão verde **"<> Code"** e selecione **"Download ZIP"**.
2. Extraia o arquivo compactado, abra a pasta no VS Code e siga os passos abaixo.

### Opção 2: Via Git (Recomendado)
**Pré-requisitos:** Node.js e PostgreSQL instalados e ativos.

Clone o repositório no seu terminal:

    git clone https://github.com/PaulinhoADS/conecta-ellp-utfpr.git
    cd conecta-ellp-utfpr

#### Passo 1: Iniciar o Back-end (API Node.js + PostgreSQL + Auto-Seed)
1. Crie um banco de dados vazio no seu PostgreSQL (pgAdmin 4) chamado `ellp_db`.
2. Abra um terminal na pasta `backend` e instale as dependências:

    cd backend
    npm install

3. Copie o arquivo `.env.example`, renomeie para `.env` e informe a senha do seu PostgreSQL local (`DB_PASSWORD`).
4. Inicie o servidor da API:

    node server.js

*(O Sequelize criará automaticamente as 5 tabelas `usuarios`, `escolas`, `alunos`, `oficinas` e `administradores` na porta `3333` e executará o Seed inicial com todos os dados de demonstração).*

#### Passo 2: Iniciar o Front-end (Aplicação React Integrada)
1. Abra um **novo terminal** na pasta `frontend` e instale as dependências:

    cd frontend
    npm install
    npm run dev

2. Acesse o endereço exibido no terminal (geralmente `http://localhost:5173`).