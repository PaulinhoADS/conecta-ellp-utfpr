// backend/models/Escola.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Usuario = require('./Usuario');

const Escola = sequelize.define('Escola', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    unique: true,
    references: { model: 'usuarios', key: 'id' },
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
  responsavel: {
    type: DataTypes.STRING,
  },
  vagasSolicitadas: {
    type: DataTypes.INTEGER,
    defaultValue: 20,
    validate: { min: 1 },
  },
  status: {
    type: DataTypes.ENUM('pendente', 'aprovada', 'inativa'),
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

Usuario.hasOne(Escola, { foreignKey: 'userId', as: 'escola', onDelete: 'SET NULL' });
Escola.belongsTo(Usuario, { foreignKey: 'userId', as: 'usuario' });

module.exports = Escola;