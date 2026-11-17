// backend/models/Administrador.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Usuario = require('./Usuario');

const Administrador = sequelize.define('Administrador', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true,
    references: { model: 'usuarios', key: 'id' },
  },
  nome: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  telefone: {
    type: DataTypes.STRING,
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

Usuario.hasOne(Administrador, { foreignKey: 'userId', as: 'administrador', onDelete: 'CASCADE' });
Administrador.belongsTo(Usuario, { foreignKey: 'userId', as: 'usuario' });

module.exports = Administrador;