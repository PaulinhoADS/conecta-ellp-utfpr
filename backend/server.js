// backend/server.js
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
require('dotenv').config();
const sequelize = require('./config/database');

// Models
const Usuario = require('./models/Usuario');
const Oficina = require('./models/Oficina');
const Escola = require('./models/Escola');
const Aluno = require('./models/Aluno');
const Administrador = require('./models/Administrador');

// Rotas
const authRoutes = require('./routes/authRoutes');
const oficinaRoutes = require('./routes/oficinaRoutes');
const escolaRoutes = require('./routes/escolaRoutes');
const alunoRoutes = require('./routes/alunoRoutes');
const administradorRoutes = require('./routes/administradorRoutes');

const app = express();

app.use(cors());
app.use(express.json());

// Rota pública de saúde da API
app.get('/teste', (req, res) => {
  res.json({ mensagem: 'Servidor Full-Stack do Conecta ELLP rodando perfeitamente!' });
});

// Registro de rotas modulares
app.use('/', authRoutes);
app.use('/oficinas', oficinaRoutes);
app.use('/escolas', escolaRoutes);
app.use('/alunos', alunoRoutes);
app.use('/administradores', administradorRoutes);

// Seed inicial automático caso o banco esteja vazio
const popularBancoInicial = async () => {
  const totalUsuarios = await Usuario.count();
  if (totalUsuarios > 0) return;

  const senhaPadraoHash = await bcrypt.hash('ellp12345', 10);

  // 1. Oficinas Reais do ELLP
  const oficinas = await Oficina.bulkCreate([
    {
      nome: 'Robótica LEGO',
      tema: 'Física, Engenharia e Programação em Blocos',
      vagas: 20,
      descricao: 'Utiliza os kits LEGO Mindstorms para ensinar conceitos de física, matemática, engenharia e lógica de programação de forma lúdica, montando e programando robôs interativos.',
      ativa: true,
    },
    {
      nome: 'Robótica com Arduino',
      tema: 'Eletrônica Básica e Automação',
      vagas: 15,
      descricao: 'Focada em eletrônica básica e automação. Os alunos aprendem a programar placas digitais conectando sensores, luzes LED e pequenos motores. Recomendada a partir de 10 anos.',
      ativa: true,
    },
    {
      nome: 'Modelagem 3D',
      tema: 'Design Tridimensional e Percepção Espacial',
      vagas: 15,
      descricao: 'Desenvolve a percepção espacial através da criação de objetos digitais tridimensionais em softwares específicos, simulando a base para design e engenharia. Recomendada a partir de 12 anos.',
      ativa: true,
    },
    {
      nome: 'Fábrica de Sites',
      tema: 'Desenvolvimento Web (HTML, CSS e JS)',
      vagas: 20,
      descricao: 'Introdução ao desenvolvimento web, onde os estudantes aprendem a estruturar e criar suas próprias páginas e portfólios na internet. Recomendada a partir de 13 anos.',
      ativa: true,
    },
    {
      nome: 'Desenvolvimento de Jogos',
      tema: 'Lógica de Programação e Criação de Games',
      vagas: 25,
      descricao: 'Oficinas focadas na criação de games, ensinando a lógica de programação por trás das mecânicas, personagens e cenários. Indicada para todas as idades.',
      ativa: true,
    },
  ]);

  // 2. Equipe Administrativa e Voluntários (Usuarios + Administradores)
  const dadosEquipe = [
    { login: 'admin', role: 'superadmin', nome: 'Prof. Antonio Carlos Fernandes da Silva', telefone: '(43) 3520-4000', ra: 'Docente Coordenador', curso: 'Coordenação do Programa ELLP', oficinaPref: 'Coordenação Geral' },
    { login: 'paulocesarleite@alunos.utfpr.edu.br', role: 'admin', nome: 'Paulo Cesar Leite', telefone: '(43) 98436-1403', ra: 'a2706512', curso: 'Análise e Desenvolvimento de Sistemas', oficinaPref: 'Fábrica de Sites' },
    { login: 'carlosandrade.2024@alunos.utfpr.edu.br', role: 'admin', nome: 'Carlos Henrique de Andrade', telefone: '(43) 99185-0271', ra: 'a2706350', curso: 'Análise e Desenvolvimento de Sistemas', oficinaPref: 'Robótica com Arduino' },
    { login: 'higorclaro@alunos.utfpr.edu.br', role: 'admin', nome: 'Higor Claro da Silva', telefone: '(43) 99837-2158', ra: 'a2717387', curso: 'Análise e Desenvolvimento de Sistemas', oficinaPref: 'Modelagem 3D' },
    { login: 'nevesv@alunos.utfpr.edu.br', role: 'admin', nome: 'Victor Hugo Concolato Neves', telefone: '(44) 99941-0088', ra: 'a2576139', curso: 'Análise e Desenvolvimento de Sistemas', oficinaPref: 'Desenvolvimento de Jogos' },
    { login: 'jboscos.carvalho@gmail.com', role: 'admin', nome: 'João Bosco Salviano de Carvalho', telefone: '(67) 9999-3727', ra: 'a1915452', curso: 'Análise e Desenvolvimento de Sistemas', oficinaPref: 'Robótica LEGO' },
  ];

  for (const membro of dadosEquipe) {
    const user = await Usuario.create({ login: membro.login, senha: senhaPadraoHash, role: membro.role, ativo: true });
    await Administrador.create({
      userId: user.id,
      nome: membro.nome,
      telefone: membro.telefone,
      ra: membro.ra,
      curso: membro.curso,
      oficinaPref: membro.oficinaPref,
      ativo: true,
    });
  }

  // 3. Escolas Parceiras (Usuarios + Escolas)
  const dadosEscolas = [
    {
      email: 'direcao@monteirolobato.pr.gov.br',
      nome: 'Colégio Estadual Monteiro Lobato',
      cnpj: '76.416.940/0001-28',
      tipo: 'Escola Pública',
      endereco: 'Av. XV de Novembro, 820 - Centro, Cornélio Procópio - PR',
      telefone: '(43) 3524-1840',
      responsavel: 'Prof.ª Márcia Helena Souza',
      vagasSolicitadas: 25,
      observacoes: 'Instituição parceira com turmas do 6º ao 9º ano do Ensino Fundamental interessadas nas oficinas de sábado.',
      status: 'aprovada',
      ativa: true,
      cartaConviteEmitidaEm: '18/10/2026',
    },
    {
      email: 'coord.noemia@edu.cornelioprocopio.pr.gov.br',
      nome: 'Escola Municipal Professora Noêmia',
      cnpj: '18.294.510/0001-64',
      tipo: 'Escola Pública',
      endereco: 'Rua Goiás, 315 - Vila Independência, Cornélio Procópio - PR',
      telefone: '(43) 3523-4190',
      responsavel: 'Prof. Ricardo Almeida',
      vagasSolicitadas: 20,
      observacoes: 'Solicitou parceria para encaminhamento de alunos do contraturno escolar para reforço lógico e robótica.',
      status: 'pendente',
      ativa: true,
      cartaConviteEmitidaEm: null,
    },
    {
      email: 'contato@sementesdofuturo.org.br',
      nome: 'Instituto Social Sementes do Futuro',
      cnpj: '45.812.309/0001-05',
      tipo: 'ONG',
      endereco: 'Rua Mato Grosso, 140 - Jardim Panorama, Cornélio Procópio - PR',
      telefone: '(43) 99812-6504',
      responsavel: 'Ana Paula Ferreira',
      vagasSolicitadas: 15,
      observacoes: 'ONG focada no atendimento socioeducativo de jovens de 10 a 16 anos em situação de vulnerabilidade.',
      status: 'aprovada',
      ativa: true,
      cartaConviteEmitidaEm: '22/10/2026',
    },
  ];

  const escolasCriadas = [];
  for (const esc of dadosEscolas) {
    const userEsc = await Usuario.create({
      login: esc.email,
      senha: senhaPadraoHash,
      role: 'escola',
      ativo: esc.status === 'aprovada',
    });
    const novaEsc = await Escola.create({
      userId: userEsc.id,
      nome: esc.nome,
      cnpj: esc.cnpj,
      tipo: esc.tipo,
      endereco: esc.endereco,
      telefone: esc.telefone,
      responsavel: esc.responsavel,
      vagasSolicitadas: esc.vagasSolicitadas,
      observacoes: esc.observacoes,
      status: esc.status,
      ativa: esc.ativa,
      cartaConviteEmitidaEm: esc.cartaConviteEmitidaEm,
    });
    escolasCriadas.push(novaEsc);
  }

  // 4. Alunos Iniciais (Usuarios + Alunos vinculados às Oficinas e Escolas)
  const dadosAlunos = [
    { nome: 'Lucas Gabriel Martins', username: 'lucas.martins', idade: 12, oficinaIdx: 0, escolaIdx: 0 },
    { nome: 'Beatriz Oliveira Santos', username: 'beatriz.santos', idade: 14, oficinaIdx: 3, escolaIdx: 0 },
    { nome: 'Matheus Henrique Costa', username: 'matheus.costa', idade: 11, oficinaIdx: 4, escolaIdx: 0 },
    { nome: 'Camila Vitória Rocha', username: 'camila.rocha', idade: 13, oficinaIdx: 2, escolaIdx: 1 },
    { nome: 'Pedro Augusto Lima', username: 'pedro.lima', idade: 15, oficinaIdx: 1, escolaIdx: 2 },
    { nome: 'Sofia Rodrigues Alves', username: 'sofia.alves', idade: 10, oficinaIdx: 0, escolaIdx: 2 },
  ];

  for (const al of dadosAlunos) {
    const userAl = await Usuario.create({ login: al.username, senha: senhaPadraoHash, role: 'aluno', ativo: true });
    const oficina = oficinas[al.oficinaIdx];
    const escola = escolasCriadas[al.escolaIdx];
    await Aluno.create({
      userId: userAl.id,
      escolaId: escola.id,
      oficinaId: oficina.id,
      nome: al.nome,
      idade: al.idade,
      perfilLogico: oficina.nome,
      ativo: true,
    });
  }

  console.log('Seed inicial concluído com sucesso no PostgreSQL!');
};

const PORT = process.env.PORT || 3333;

sequelize.sync({ alter: true }).then(async () => {
  console.log('Tabelas sincronizadas no PostgreSQL via Sequelize!');
  await popularBancoInicial();
  app.listen(PORT, () => {
    console.log(`Servidor Back-end escutando na porta ${PORT}`);
  });
}).catch((err) => {
  console.error('Erro ao conectar/sincronizar com o PostgreSQL:', err);
});