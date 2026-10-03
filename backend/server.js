// server.js
const express = require('express');
const cors = require('cors');
require('dotenv').config(); // Puxando nossas variáveis de ambiente do .env

// Inicializa a aplicação
const app = express();

// middlewares
// cors permite que nosso front-end converse com essa API sem bloqueio
app.use(cors()); 
// avisa o express pra entender os dados que vêm em formato JSON
app.use(express.json()); 

// Criando uma rota de teste simples pra gente validar se o servidor subiu
app.get('/teste', (req, res) => {
  res.json({ mensagem: 'Servidor do Conecta ELLP rodando perfeitamente!' });
});

// Porta do servidor (pega do .env ou usa 3000 como segurança)
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Backend escutando na porta ${PORT}`);
});