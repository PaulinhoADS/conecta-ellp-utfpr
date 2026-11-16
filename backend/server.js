// backend/server.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const sequelize = require('./config/database');

// Importando Models do Sequelize
const Escola = require('./models/Escola');
const Aluno = require('./models/Aluno');
const Oficina = require('./models/Oficina');
const Administrador = require('./models/Administrador');

const app = express();

app.use(cors());
app.use(express.json());

// Sincronizando o Sequelize com o banco de dados PostgreSQL
sequelize.sync({ alter: true }).then(() => {
  console.log('Tabelas (Escolas, Alunos, Oficinas, Administradores) sincronizadas no PostgreSQL!');
}).catch(err => {
  console.error('Erro ao sincronizar as tabelas:', err);
});

// Rota de status da API
app.get('/teste', (req, res) => {
  res.json({ mensagem: 'Servidor do Conecta ELLP rodando perfeitamente!' });
});

// --- ROTAS DE ESCOLAS ---
app.get('/escolas', async (req, res) => {
  try {
    const escolas = await Escola.findAll({ include: [{ model: Aluno, as: 'alunos' }] });
    res.json(escolas);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao listar escolas.' });
  }
});

app.get('/escolas/:id', async (req, res) => {
  try {
    const escola = await Escola.findByPk(req.params.id, { include: [{ model: Aluno, as: 'alunos' }] });
    if (!escola) return res.status(404).json({ erro: 'Escola não encontrada.' });
    res.json(escola);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao buscar escola.' });
  }
});

app.post('/escolas', async (req, res) => {
  try {
    const nova = await Escola.create(req.body);
    res.status(201).json(nova);
  } catch (err) {
    res.status(400).json({ erro: 'Erro ao cadastrar escola.', detalhes: err.message });
  }
});

app.put('/escolas/:id', async (req, res) => {
  try {
    const escola = await Escola.findByPk(req.params.id);
    if (!escola) return res.status(404).json({ erro: 'Escola não encontrada.' });
    await escola.update(req.body);
    res.json(escola);
  } catch (err) {
    res.status(400).json({ erro: 'Erro ao atualizar escola.' });
  }
});

app.delete('/escolas/:id', async (req, res) => {
  try {
    const escola = await Escola.findByPk(req.params.id);
    if (!escola) return res.status(404).json({ erro: 'Escola não encontrada.' });
    await escola.destroy();
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao remover escola.' });
  }
});

// --- ROTAS DE ALUNOS ---
app.get('/alunos', async (req, res) => {
  try {
    const alunos = await Aluno.findAll();
    res.json(alunos);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao listar alunos.' });
  }
});

app.post('/escolas/:escolaId/alunos', async (req, res) => {
  try {
    const novoAluno = await Aluno.create({ ...req.body, escolaId: Number(req.params.escolaId) });
    res.status(201).json(novoAluno);
  } catch (err) {
    res.status(400).json({ erro: 'Erro ao cadastrar aluno.', detalhes: err.message });
  }
});

app.put('/escolas/:escolaId/alunos/:id', async (req, res) => {
  try {
    const aluno = await Aluno.findByPk(req.params.id);
    if (!aluno) return res.status(404).json({ erro: 'Aluno não encontrado.' });
    await aluno.update(req.body);
    res.json(aluno);
  } catch (err) {
    res.status(400).json({ erro: 'Erro ao atualizar aluno.' });
  }
});

app.delete('/escolas/:escolaId/alunos/:id', async (req, res) => {
  try {
    const aluno = await Aluno.findByPk(req.params.id);
    if (!aluno) return res.status(404).json({ erro: 'Aluno não encontrado.' });
    await aluno.destroy();
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao remover aluno.' });
  }
});

// --- ROTAS DE OFICINAS ---
app.get('/oficinas', async (req, res) => {
  try {
    const oficinas = await Oficina.findAll();
    res.json(oficinas);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao listar oficinas.' });
  }
});

app.post('/oficinas', async (req, res) => {
  try {
    const oficina = await Oficina.create(req.body);
    res.status(201).json(oficina);
  } catch (err) {
    res.status(400).json({ erro: 'Erro ao criar oficina.' });
  }
});

app.put('/oficinas/:id', async (req, res) => {
  try {
    const oficina = await Oficina.findByPk(req.params.id);
    if (!oficina) return res.status(404).json({ erro: 'Oficina não encontrada.' });
    await oficina.update(req.body);
    res.json(oficina);
  } catch (err) {
    res.status(400).json({ erro: 'Erro ao atualizar oficina.' });
  }
});

// --- ROTAS DE ADMINISTRADORES / VOLUNTÁRIOS ---
app.get('/administradores', async (req, res) => {
  try {
    const admins = await Administrador.findAll();
    res.json(admins);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao listar administradores.' });
  }
});

app.post('/administradores', async (req, res) => {
  try {
    const novo = await Administrador.create(req.body);
    res.status(201).json(novo);
  } catch (err) {
    res.status(400).json({ erro: 'Erro ao cadastrar administrador.' });
  }
});

app.put('/administradores/:id', async (req, res) => {
  try {
    const admin = await Administrador.findByPk(req.params.id);
    if (!admin) return res.status(404).json({ erro: 'Administrador não encontrado.' });
    await admin.update(req.body);
    res.json(admin);
  } catch (err) {
    res.status(400).json({ erro: 'Erro ao atualizar administrador.' });
  }
});

const PORT = process.env.PORT || 3333;

app.listen(PORT, () => {
  console.log(`Backend escutando na porta ${PORT}`);
});