// backend/models/Oficina.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Oficina = sequelize.define('Oficina', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  nome: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  tema: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  vagas: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 20,
    validate: { min: 1 },
  },
  descricao: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  ativa: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
}, {
  tableName: 'oficinas',
  timestamps: true,
});

module.exports = Oficina;