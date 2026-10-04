// server.js
const express = require('express');
const cors = require('cors');
require('dotenv').config(); // Puxando nossas variáveis de ambiente do .env
const sequelize = require('./config/database');

// Importando Models do Sequelize
const Escola = require('./models/Escola');
const Aluno = require('./models/Aluno');

// Inicializa a aplicação
const app = express();

// middlewares
// cors permite que nosso front-end converse com essa API sem bloqueio
app.use(cors()); 
// avisa o express pra entender os dados que vêm em formato JSON
app.use(express.json()); 

// Sincronizando o Sequelize com o banco de dados
// O alter: true garante que o banco se atualize se mudar alguma coluna depois
sequelize.sync({ alter: true }).then(() => {
  console.log('Tabelas sincronizadas no banco de dados!');
}).catch(err => {
  console.error('Erro ao sincronizar as tabelas:', err);
});

// Criando uma rota de teste simples pra gente validar se o servidor subiu
app.get('/teste', (req, res) => {
  res.json({ mensagem: 'Servidor do Conecta ELLP rodando perfeitamente!' });
});

// Porta do servidor (pega do .env ou usa 3000 como segurança)
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Backend escutando na porta ${PORT}`);
});