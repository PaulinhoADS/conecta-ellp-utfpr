// backend/models/Usuario.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Usuario = sequelize.define('Usuario', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  login: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true, // armazena username ou email de acesso
  },
  senha: {
    type: DataTypes.STRING,
    allowNull: false, // armazenada sempre com hash bcrypt
  },
  role: {
    type: DataTypes.ENUM('superadmin', 'admin', 'escola', 'aluno'),
    allowNull: false,
    defaultValue: 'aluno',
  },
  ativo: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
}, {
  tableName: 'usuarios',
  timestamps: true,
});

module.exports = Usuario;