# conecta-ellp-utfpr
# 🔌 Conecta ELLP
**Plataforma Integrada de Gestão e Triagem Baseada em Perfis para o Projeto de Extensão ELLP.**

> Projeto desenvolvido para a disciplina de Certificadora da Competência Identitária - UTFPR Câmpus Cornélio Procópio (Curso de Análise e Desenvolvimento de Sistemas).

---

## Equipe Desenvolvedora (Grupo 05)
- **Paulo Cesar Leite** (Representante / Back-end & Documentação)
- **Carlos Henrique** (Front-end & Algoritmos)
- **Higor Claro** (Front-end & Prototipação)
- **João Bosco** (Back-end & Banco de Dados)
- **Victor Hugo** (Front-end & Integração)

---

## Sobre o Projeto

### A Ideia
O projeto consiste no desenvolvimento de um sistema web completo (Front-end e Back-end) destinado ao gerenciamento e à triagem de participantes do projeto de extensão ELLP (Ensino de Lógica e Linguagem de Programação). A plataforma permitirá o cadastro autônomo pelas escolas parceiras, a gestão de vagas pelos tutores, e contará com o recurso central **"Quiz Perfil Tech"** – um questionário dinâmico que avalia as aptidões lógicas dos alunos inscritos, recomendando de forma automatizada a oficina mais adequada.

### Motivação e Problema a Resolver
O ELLP democratiza a tecnologia, mas o processo de expansão esbarra na burocracia do gerenciamento manual e na alocação genérica dos alunos, gerando desmotivação quando o aluno entra em uma oficina fora do seu perfil. Nossa proposta otimiza o trabalho administrativo dos voluntários/professores e garante uma experiência personalizada para o aluno, aumentando o engajamento através da triagem inteligente.

---

## Especificações e Tecnologias

O sistema será uma *Single Page Application* (SPA) dividida em módulos para Escolas/Alunos e para a Gestão do ELLP, utilizando as seguintes tecnologias:

- **Front-end:** React (com Vite), React Router, Axios, CSS.
- **Back-end:** Node.js, Express, Autenticação JWT.
- **Banco de Dados:** PostgreSQL com Sequelize (ORM).
- **Lógica (O Motor de Recomendação):** Algoritmos baseados em árvores de decisão booleanas (simulando operações de entrada/saída e portas lógicas) para análise do Quiz e um algoritmo guloso (Greedy) para preenchimento ótimo das vagas limitadas.
- **Ferramentas e Deploy:** Visual Studio Code, Figma (Prototipação) e Git/GitHub. A hospedagem do código será no GitHub, e o deploy da aplicação (front e back) utilizará planos gratuitos de serviços em nuvem.

### Arquitetura
A arquitetura do back-end seguirá o padrão **Controller-Service-Repository**, garantindo o total desacoplamento das regras de negócio, acesso a dados e roteamento da API. A comunicação entre Front-end e Back-end ocorrerá via JSON em rotas seguras.

---

## Cronograma de Execução

- **Setembro (Semanas 3 e 4):** Levantamento de requisitos, estruturação do repositório, modelagem do Banco de Dados (físico/lógico) e prototipação no Figma.
- **Outubro (Semanas 1 e 2):** Início do Back-end (BD, classes, rotas CRUD), gravação do Pitch de apresentação e elaboração dos slides para o Seminário de Relatório (Entrega 16/10).
- **Outubro (Semanas 3 e 4):** Desenvolvimento do Front-end (React) e avanço do Back-end (Autenticação JWT).
- **Novembro (Semanas 1 e 2):** Implementação da lógica de Algoritmos (Quiz e Distribuição de vagas) e Integração total Front x Back.
- **Novembro (Semanas 3 e 4):** Testes finais, correção de bugs, validação com o ELLP, redação do Relatório Final e gravação dos vídeos individuais (Entrega Final 30/11).
