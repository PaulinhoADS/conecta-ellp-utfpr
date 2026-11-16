// backend/models/Aluno.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Escola = require('./Escola');

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
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  idade: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  perfilLologico: {
    type: DataTypes.STRING,
    defaultValue: 'Aguardando Quiz Perfil Tech',
  },
  senhaTemporaria: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  tableName: 'alunos',
  timestamps: true,
});

Escola.hasMany(Aluno, { foreignKey: 'escolaId', as: 'alunos', onDelete: 'CASCADE' });
Aluno.belongsTo(Escola, { foreignKey: 'escolaId' });

module.exports = Aluno;