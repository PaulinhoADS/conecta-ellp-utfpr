// backend/models/Escola.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

// Definindo a tabela 'Escolas'
const Escola = sequelize.define('Escola', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  nome: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  cnpj: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  endereco: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  telefone: {
    type: DataTypes.STRING,
  }
}, {
  tableName: 'escolas',
  timestamps: true, // Cria automaticamente as colunas createdAt e updatedAt
});

module.exports = Escola;