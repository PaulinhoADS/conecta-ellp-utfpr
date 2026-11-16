# Conecta ELLP (UTFPR - Câmpus Cornélio Procópio)

**Plataforma Integrada de Gestão, Credenciamento Escolar e Triagem Baseada em Perfis para o Projeto de Extensão ELLP.**

> Projeto desenvolvido para a disciplina de **Certificadora da Competência Identitária (AS65A)** — Curso Superior de Tecnologia em Análise e Desenvolvimento de Sistemas — Universidade Tecnológica Federal do Paraná (UTFPR), Câmpus Cornélio Procópio.

---

## Equipe Desenvolvedora (Grupo 05)
- **Paulo Cesar Leite** — Representante / Back-end, Integração & Documentação
- **Carlos Henrique de Andrade** — Front-end (Módulo de Equipe/Voluntários) & Algoritmos
- **Higor Claro da Silva** — Front-end (Módulo de Escolas Parceiras e Alunos) & Prototipação
- **João Bosco Salviano de Carvalho** — Back-end, Rotas REST & Modelagem de Banco de Dados
- **Victor Hugo Concolato Neves** — Front-end (Painel Admin, Oficinas, Autenticação RBAC & UI/UX)

---

## Sobre o Projeto

### A Ideia
O **Conecta ELLP** é uma plataforma web completa (Front-end e Back-end) criada para modernizar o gerenciamento e a triagem de participantes do programa de extensão **ELLP (Ensino Lúdico de Lógica e Programação)**. A solução permite o credenciamento de escolas parceiras, a emissão de cartas-convite oficiais, o cadastro de estudantes com geração automática de credenciais, a gestão de oficinas e voluntários, e traz como diferencial o **"Quiz Perfil Tech"** — um motor de recomendação baseado em árvore de decisão que cruza a faixa etária e as aptidões do estudante para indicar a oficina ideal da grade do projeto.

### Sobre o Programa ELLP (UTFPR-CP)
Sob a coordenação do **Prof. Antonio Carlos Fernandes da Silva**, o programa ELLP promove inclusão digital e educação tecnológica para a comunidade de Cornélio Procópio e região, utilizando a programação e a robótica como ferramentas de reforço escolar em matemática e ciências.
- **Público-alvo:** Crianças e adolescentes (a partir de 10 anos) de escolas públicas, ONGs e projetos sociais.
- **Grade de Oficinas Reais no Sistema:** Robótica LEGO, Robótica com Arduino (10+), Modelagem 3D (12+), Fábrica de Sites (13+) e Desenvolvimento de Jogos.
- **Execução:** Aulas presenciais aos sábados na UTFPR-CP, ministradas por estudantes voluntários.
- **Site Oficial:** [https://grupoellp.com.br](https://grupoellp.com.br)

### Motivação e Problema Resolvido
A expansão do ELLP esbarrava na burocracia de controles manuais em planilhas e na alocação genérica dos alunos das escolas parceiras, o que frequentemente gerava evasão quando um estudante era alocado em uma turma incompatível com sua idade ou interesse. O **Conecta ELLP** centraliza toda a operação administrativa e garante uma triagem personalizada para cada jovem.

---

## Especificações Técnicas e Arquitetura

- **Front-end (SPA):** React 19 (Vite), React Router DOM v7 (rotas aninhadas e guardas de rota `ProtectedRoute`), Context API (`AuthContext`), Axios e CSS3 estruturado com variáveis globais e metodologia **BEM (Block, Element, Modifier)**.
- **Back-end (API REST):** Node.js, Express 5, CORS, Dotenv.
- **Banco de Dados e Persistência:** PostgreSQL mapeado via ORM **Sequelize** (`Escola`, `Aluno`, `Oficina`, `Administrador`). Para garantir portabilidade total durante a avaliação acadêmica, o Front-end conta com uma camada de serviços com *Auto-Seed* em `localStorage`, permitindo testar 100% dos fluxos de CRUD imediatamente ao iniciar o projeto.
- **Segurança e Controle de Acesso (RBAC):** Controle de permissões baseado em 4 papéis (`superadmin`, `admin`, `escola` e `aluno`), verificação de propriedade de registro (*ownership*), geração de senhas temporárias via Web Crypto API (`crypto.getRandomValues`) e modal acessível de redefinição de senha.

---

## Funcionalidades Implementadas e Guia de Navegação

1. **Página Inicial Institucional (`/`) e Quiz Perfil Tech (`/quiz`):**
   - Apresentação interativa das 5 oficinas reais do ELLP, seção institucional sobre o programa e acesso direto ao **Quiz Perfil Tech**.
   - O Quiz avalia idade, interesses tecnológicos e estilo de aprendizagem via árvore de decisão booleana. Se o aluno estiver logado, o resultado atualiza automaticamente seu cadastro.
2. **Painel Administrativo — Dashboard (`/admin`):**
   - Exclusivo para Coordenação (`superadmin`) e Voluntários (`admin`). Exibe contadores em tempo real (administradores ativos, oficinas ativas, escolas aprovadas e alunos inscritos), lista solicitações de escolas pendentes e oferece atalhos rápidos.
3. **Gestão de Escolas Parceiras e Carta-Convite (`/escolas` e `/escolas/:id`):**
   - Listagem com resumo de métricas, busca por nome/CNPJ/responsável e filtro por status (*Aprovada*, *Pendente*, *Inativa*).
   - No painel de detalhes da escola (`/escolas/:id`), a coordenação pode **aprovar a instituição em 1 clique** e **emitir a Carta-Convite Oficial da UTFPR**, pronta para impressão ou salvamento em PDF (`@media print`).
4. **Gestão de Alunos e Credenciais Temporárias (`/escolas/:id` e `/escolas/:escolaId/alunos/:id`):**
   - Dentro do painel da escola, é possível cadastrar os alunos encaminhados. O sistema sugere automaticamente o `@username` e gera uma **senha temporária** que pode ser copiada em 1 clique para envio ao estudante.
   - Tela exclusiva de perfil do estudante com verificação de *ownership* e redefinição de senha.
5. **Catálogo e CRUD de Oficinas (`/oficinas`, `/oficinas/nova`, `/oficinas/:id`):**
   - Consulta pública das oficinas do ELLP e, para administradores, criação, edição, controle de limite de vagas e chave seletora (*switch*) para ativar/inativar turmas preservando o histórico.
6. **Gestão de Equipe Administrativa e Voluntários (`/administradores` e `/voluntarios`):**
   - Cadastro e controle de membros da equipe diferenciando **Professor/Coordenador (`superadmin`)** e **Voluntário (`admin`)**, com busca dinâmica, filtro por status e inativação (*soft delete*) com notificações *Toast*.

---

## Dados de Acesso e Perfis para Teste (Avaliação)

Ao iniciar o sistema pela primeira vez, o `AuthContext` autentica automaticamente o perfil de **Superadmin** para facilitar a inspeção imediata de todas as telas pelo avaliador.

Caso deseje testar a tela de Login (`/login`) ou alternar entre as visões de cada tipo de usuário (clique no ícone de perfil no topo direito -> **Sair**), você pode usar os **4 Botões de Acesso Rápido (Demonstração)** na própria tela de Login ou digitar um dos usuários abaixo com qualquer senha:

| Perfil de Acesso | Usuário para Login | Papel (`role`) | O que pode acessar e testar |
| :--- | :--- | :--- | :--- |
| **Coordenação (Prof. Antonio)** | `admin` | `superadmin` | Acesso total: Dashboard, Escolas, Carta-Convite, Oficinas, Equipe e Alunos. |
| **Estudante Voluntário** | `voluntario` | `admin` | Gestão operacional do Dashboard, Oficinas, Escolas e Equipe. |
| **Escola Parceira** | `direcao@monteirolobato.pr.gov.br` | `escola` | Acesso restrito ao painel da própria escola (`/escolas/1`) e gestão de seus alunos. |
| **Estudante (Aluno)** | `lucas.martins` | `aluno` | Acesso restrito ao próprio perfil (`/escolas/1/alunos/1`), redefinição de senha e Quiz. |

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
- **Novembro (Semanas 3 e 4):** Integração final de fluxos, revisão de usabilidade, documentação completa, Relatório Final e gravação dos vídeos individuais (Entrega Final 30/11).

---

## Como Rodar Este Projeto na Sua Máquina

### Opção 1: Download Direto (Sem Git)
1. No topo desta página do GitHub, clique no botão verde **"<> Code"** e selecione **"Download ZIP"**.
2. Extraia o arquivo compactado, abra a pasta no VS Code e siga os passos abaixo.

### Opção 2: Via Git (Recomendado)
Clone o repositório no seu terminal:

    git clone [https://github.com/PaulinhoADS/conecta-ellp-utfpr.git](https://github.com/PaulinhoADS/conecta-ellp-utfpr.git)
    cd conecta-ellp-utfpr

#### 1. Executando o Front-end (Aplicação Completa com Dados de Demonstração)
O Front-end possui *Auto-Seed* pré-configurado e funciona imediatamente:
1. Abra o terminal na pasta `frontend` e instale as dependências:

    cd frontend
    npm install
    npm run dev

2. Acesse o endereço exibido no terminal (geralmente `http://localhost:5173`).

#### 2. Executando o Back-end (API Node.js + PostgreSQL)
**Pré-requisitos:** Node.js e PostgreSQL instalados.
1. Abra um novo terminal na pasta `backend`:

    cd backend
    npm install

2. Crie um banco de dados no PostgreSQL chamado `ellp_db`.
3. Copie o arquivo `.env.example`, renomeie para `.env` e informe a senha do seu PostgreSQL local.
4. Inicie o servidor:

    node server.js

*(O Sequelize sincronizará automaticamente as tabelas `escolas`, `alunos`, `oficinas` e `administradores` na porta `3333`).*