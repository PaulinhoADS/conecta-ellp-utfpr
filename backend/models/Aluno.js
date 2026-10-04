// backend/models/Aluno.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Escola = require('./Escola');

// Definindo a tabela 'Alunos'
const Aluno = sequelize.define('Aluno', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  nome: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  idade: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  perfilLologico: {
    type: DataTypes.STRING,
    // Aqui vai entrar o resultado do Quiz (ex: 'Logica Pura', 'Visual', etc)
    allowNull: true, 
  }
}, {
  tableName: 'alunos',
  timestamps: true,
});

// Relacionamento (1 Escola tem muitos Alunos)
// O João Bosco estruturou certinho a chave estrangeira aqui
Escola.hasMany(Aluno, { foreignKey: 'escolaId' });
Aluno.belongsTo(Escola, { foreignKey: 'escolaId' });

module.exports = Aluno;