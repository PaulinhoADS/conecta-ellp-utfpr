// backend/models/Escola.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

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
  tipo: {
    type: DataTypes.STRING,
    defaultValue: 'Escola Pública',
  },
  endereco: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  telefone: {
    type: DataTypes.STRING,
  },
  email: {
    type: DataTypes.STRING,
  },
  responsavel: {
    type: DataTypes.STRING,
  },
  vagasSolicitadas: {
    type: DataTypes.INTEGER,
    defaultValue: 20,
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'pendente',
  },
  observacoes: {
    type: DataTypes.TEXT,
  },
  ativa: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  cartaConviteEmitidaEm: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  tableName: 'escolas',
  timestamps: true,
});

module.exports = Escola;