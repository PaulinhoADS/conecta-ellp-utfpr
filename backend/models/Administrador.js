// backend/models/Administrador.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Administrador = sequelize.define('Administrador', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  nome: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  telefone: {
    type: DataTypes.STRING,
  },
  tipoAcesso: {
    type: DataTypes.STRING,
    defaultValue: 'admin', // 'superadmin' (Professor) ou 'admin' (Voluntário)
  },
  ra: {
    type: DataTypes.STRING,
  },
  curso: {
    type: DataTypes.STRING,
  },
  oficinaPref: {
    type: DataTypes.STRING,
  },
  ativo: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
}, {
  tableName: 'administradores',
  timestamps: true,
});

module.exports = Administrador;