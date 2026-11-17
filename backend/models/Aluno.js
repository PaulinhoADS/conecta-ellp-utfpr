// backend/models/Aluno.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Escola = require('./Escola');
const Oficina = require('./Oficina');
const Usuario = require('./Usuario');

const Aluno = sequelize.define('Aluno', {
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
  escolaId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'escolas', key: 'id' },
  },
  oficinaId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: { model: 'oficinas', key: 'id' },
  },
  nome: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  idade: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: { min: 6, max: 25 },
  },
  perfilLogico: {
    type: DataTypes.STRING,
    defaultValue: 'Aguardando Quiz Perfil Tech',
  },
  // Campo virtual para manter 100% de compatibilidade com as telas do Front-end
  perfilLologico: {
    type: DataTypes.VIRTUAL,
    get() {
      return this.getDataValue('perfilLogico');
    },
    set(val) {
      this.setDataValue('perfilLogico', val);
    },
  },
  ativo: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
}, {
  tableName: 'alunos',
  timestamps: true,
});

Usuario.hasOne(Aluno, { foreignKey: 'userId', as: 'aluno', onDelete: 'CASCADE' });
Aluno.belongsTo(Usuario, { foreignKey: 'userId', as: 'usuario' });

Escola.hasMany(Aluno, { foreignKey: 'escolaId', as: 'alunos', onDelete: 'CASCADE' });
Aluno.belongsTo(Escola, { foreignKey: 'escolaId', as: 'escola' });

Oficina.hasMany(Aluno, { foreignKey: 'oficinaId', as: 'alunosInscritos', onDelete: 'SET NULL' });
Aluno.belongsTo(Oficina, { foreignKey: 'oficinaId', as: 'oficina' });

module.exports = Aluno;