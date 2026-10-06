# Documento de Requisitos - Conecta ELLP

Este documento detalha os Requisitos Funcionais (RF) e os Requisitos Não Funcionais (RNF) extraídos do planejamento do sistema Conecta ELLP, desenvolvido para a gestão do projeto de extensão Ensino de Lógica e Linguagem de Programação da UTFPR.

---

## Requisitos Funcionais (RF)
*O que o sistema deve fazer (Funcionalidades e interações com o usuário).*

* **RF01:** O sistema deve permitir o cadastro autônomo de dados institucionais e alunos pelas escolas parceiras.
* **RF02:** O sistema deve fornecer um ambiente web de interface para a execução do questionário dinâmico "Quiz Perfil Tech" pelos alunos inscritos.
* **RF03:** O sistema deve recomendar de forma automatizada a oficina mais adequada ao perfil do aluno (ex: programação visual, lógica pura, desenvolvimento web) com base nas respostas do quiz.
* **RF04:** O sistema deve disponibilizar um painel administrativo (Módulo Gestão) para professores e tutores.
* **RF05:** O painel administrativo deve permitir a aprovação de escolas e a emissão de cartas convite.
* **RF06:** O sistema deve permitir o acompanhamento das turmas (gestão de vagas) pelos tutores.
* **RF07:** O painel administrativo deve possuir a funcionalidade de geração de termos de voluntariado.
* **RF08:** O sistema deve realizar a distribuição ótima e automatizada dos alunos recomendados nas turmas disponíveis.

---

## Requisitos Não Funcionais (RNF)
*Como o sistema deve se comportar (Arquitetura, desempenho, segurança e tecnologias).*

* **RNF01:** O sistema deve ser desenvolvido como uma aplicação web do tipo Single Page Application (SPA).
* **RNF02:** O Front-end deve ser construído utilizando a biblioteca React com a ferramenta Vite, e utilizar React Router, Axios e CSS para componentização e consumo de dados.
* **RNF03:** O Back-end deve ser estruturado como uma API RESTful, construído em Node.js com o framework Express.
* **RNF04:** O armazenamento de dados deve ser feito no banco de dados relacional PostgreSQL, mapeado através do ORM Sequelize.
* **RNF05:** A arquitetura do Back-end deve seguir o padrão Controller-Service-Repository, garantindo o desacoplamento das regras de negócio e roteamento.
* **RNF06:** A comunicação de dados entre o Front-end e o Back-end deve ocorrer via formato JSON utilizando rotas seguras.
* **RNF07:** O acesso aos painéis de controle por administradores e escolas deve ser protegido através de autenticação com tokens JWT (JSON Web Token).
* **RNF08:** O motor de recomendação (Back-end) deve processar respostas tratadas como variáveis booleanas, simulando um circuito lógico combinacional (portas lógicas).
* **RNF09:** A distribuição de alunos nas turmas com vagas limitadas deve ser processada por um algoritmo de otimização guloso (Greedy).
* **RNF10:** A hospedagem do código deve ser mantida no GitHub, e a publicação da aplicação (deploy) deve ser viabilizada em planos gratuitos de serviços em nuvem.