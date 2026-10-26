# conecta-ellp-utfpr
# Conecta ELLP
**Plataforma Integrada de Gestão e Triagem Baseada em Perfis para o Projeto de Extensão ELLP.**

> Projeto desenvolvido para a disciplina de Certificadora da Competência Identitária - UTFPR Câmpus Cornélio Procópio (Curso de Análise e Desenvolvimento de Sistemas).

---

## Equipe Desenvolvedora (Grupo 05)
- **Paulo Cesar Leite** (Representante / Back-end & Documentação)
- **Carlos Henrique de Andrade** (Front-end & Algoritmos)
- **Higor Claro da Silva** (Front-end & Prototipação)
- **João Bosco Salviano de Carvalho** (Back-end & Banco de Dados)
- **Victor Hugo Concolato Neves** (Front-end & Integração)

---

## Sobre o Projeto

### A Ideia
O projeto consiste no desenvolvimento de um sistema web completo (Front-end e Back-end) destinado ao gerenciamento e à triagem de participantes do projeto de extensão ELLP (Ensino de Lógica e Linguagem de Programação). A plataforma permitirá o cadastro autônomo pelas escolas parceiras, a gestão de vagas pelos tutores, e contará com o recurso central **"Quiz Perfil Tech"** – um questionário dinâmico que avalia as aptidões lógicas dos alunos inscritos, recomendando de forma automatizada a oficina mais adequada.

### Sobre o Programa ELLP (UTFPR)
O projeto Conecta ELLP atende diretamente às necessidades do programa **Ensino Lúdico de Lógica e Programação (ELLP)** da UTFPR Câmpus Cornélio Procópio. Sob a coordenação do professor Antonio Carlos Fernandes, o ELLP foca em educação e tecnologia para a comunidade local, utilizando o ensino tecnológico como ferramenta de reforço escolar em matemática e ciências.
* **Público-alvo:** Crianças e adolescentes (10 a 16 anos) de escolas públicas, ONGs e creches.
* **Execução:** Aulas presenciais aos sábados, ministradas por estudantes voluntários da UTFPR.
* **Saiba mais:** [Acesse o site oficial do Grupo ELLP](https://grupoellp.com.br)

### Motivação e Problema a Resolver
O ELLP democratiza a tecnologia, mas o processo de expansão esbarra na burocracia do gerenciamento manual e na alocação genérica dos alunos, gerando desmotivação quando o aluno entra em uma oficina fora do seu perfil. Nossa proposta otimiza o trabalho administrativo dos voluntários/professores e garante uma experiência personalizada para o aluno, aumentando o engajamento através da triagem inteligente.

---

## Especificações, Tecnologias e Documentação

O sistema será uma *Single Page Application* (SPA) dividida em módulos para Escolas/Alunos e para a Gestão do ELLP, utilizando as seguintes tecnologias:

- **Front-end:** React (com Vite), React Router, Axios, CSS.
- **Back-end:** Node.js, Express, Autenticação JWT.
- **Banco de Dados:** PostgreSQL com Sequelize (ORM).
- **Lógica (O Motor de Recomendação):** Algoritmos baseados em árvores de decisão booleanas (simulando operações de entrada/saída e portas lógicas) para análise do Quiz e um algoritmo guloso (Greedy) para preenchimento ótimo das vagas limitadas.
- **Ferramentas e Deploy:** Visual Studio Code e Git/GitHub. A hospedagem do código será no GitHub, e o deploy da aplicação (front e back) utilizará planos gratuitos de serviços em nuvem.

### Levantamento de Requisitos (Ágil)

Para visualizar o escopo detalhado de funcionalidades e restrições técnicas do projeto, mapeados durante as Sprints iniciais:
[Clique aqui para ler os Requisitos Funcionais e Não Funcionais (RF / RNF)](docs/requisitos.md)

### Diagrama de Banco de Dados


[Clique aqui para visualizar o Diagrama Entidade-Relacionamento do Projeto](docs/DER-BD.png)

### Protótipos de Interface (Versão Inicial)


[Clique aqui para visualizar o Protótipo da Tela Home](docs/prototipo-tela-home.png)


[Clique aqui para visualizar o Protótipo da Tela do Quiz](docs/prototipo-tela-quiz.png)

### Arquitetura
A arquitetura do back-end seguirá o padrão **Controller-Service-Repository**, garantindo o total desacoplamento das regras de negócio, acesso a dados e roteamento da API. A comunicação entre Front-end e Back-end ocorrerá via JSON em rotas seguras.

---

## Funcionalidades e Navegação
* **Cadastro e Triagem (Fluxo Atual):** Alunos acessam a página inicial e realizam o "Quiz Perfil Tech". O algoritmo cruza dados de idade e aptidão para sugerir oficinas reais da grade do ELLP (Robótica, Modelagem 3D, Sites, Jogos, etc).
* **Módulo Administrativo (Em Desenvolvimento):** A página de Login de professores e tutores possui interface pronta, mas a autenticação e o painel de turmas (com acesso ao Banco de Dados) serão integrados na Etapa Final de entrega.

---

## Cronograma de Execução

- **Setembro (Semanas 3 e 4):** Levantamento de requisitos, estruturação do repositório, modelagem do Banco de Dados (físico/lógico) e prototipação.
- **Outubro (Semanas 1 e 2):** Início do Back-end (BD, classes, rotas CRUD), gravação do Pitch de apresentação e elaboração dos slides para o Seminário de Relatório (Entrega 16/10).
- **Outubro (Semanas 3 e 4):** Desenvolvimento do Front-end (React) e avanço do Back-end (Autenticação JWT).
- **Novembro (Semanas 1 e 2):** Implementação da lógica de Algoritmos (Quiz e Distribuição de vagas) e Integração total Front x Back.
- **Novembro (Semanas 3 e 4):** Testes finais, correção de bugs, validação com o ELLP, redação do Relatório Final e gravação dos vídeos individuais (Entrega Final 30/11).

---

## Como rodar este projeto na sua máquina

### Opção 1: Download Direto (Sem Git)
Se preferir não utilizar o terminal, você pode baixar o código-fonte seguro:
1. No topo desta página do GitHub, clique no botão verde **"<> Code"**.
2. Selecione **"Download ZIP"**.
3. Extraia o arquivo, abra a pasta no VS Code e siga os passos de instalação abaixo.

### Opção 2: Via Git (Recomendado)
**Pré-requisitos:** Node.js instalado e PostgreSQL rodando localmente.

**Passos para o Back-end**
1. Clone o repositório: `git clone https://github.com/SeuUsuario/conecta-ellp-utfpr.git`
2. Abra o terminal na pasta `backend` e rode `npm install`.
3. Crie um banco de dados no seu PostgreSQL chamado `ellp_db`.
4. Copie o arquivo `.env.example`, renomeie para `.env` e preencha com a senha do seu banco local.
5. Rode `npm run dev` (ou `node server.js`). As tabelas serão criadas automaticamente pelo Sequelize.

**Passos para o Front-end**
1. Abra um novo terminal na pasta `frontend`.
2. Rode `npm install`.
3. Rode `npm run dev` e acesse o link gerado no terminal (geralmente `http://localhost:5173`).