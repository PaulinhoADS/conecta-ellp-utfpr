// backend/controllers/authController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');
const Administrador = require('../models/Administrador');
const Escola = require('../models/Escola');
const Aluno = require('../models/Aluno');
const { JWT_SECRET } = require('../middlewares/authMiddleware');

exports.login = async (req, res) => {
  try {
    const loginRaw = String(req.body.usuario || req.body.login || '').trim().toLowerCase();
    const senha = String(req.body.senha || '');

    if (!loginRaw || !senha) {
      return res.status(400).json({ erro: 'Informe o usuário e a senha.' });
    }

    const usuario = await Usuario.findOne({ where: { login: loginRaw } });
    if (!usuario) {
      return res.status(401).json({ erro: 'Usuário ou senha inválidos.' });
    }

    const senhaValida = await bcrypt.compare(senha, usuario.senha);
    if (!senhaValida) {
      return res.status(401).json({ erro: 'Usuário ou senha inválidos.' });
    }

    if (!usuario.ativo) {
      return res.status(403).json({ erro: 'Esta conta encontra-se inativa.' });
    }

    let entityId = null;
    let escolaId = null;
    let nome = usuario.login;
    let extraIds = {};

    if (usuario.role === 'superadmin' || usuario.role === 'admin') {
      const admin = await Administrador.findOne({ where: { userId: usuario.id } });
      if (!admin || !admin.ativo) {
        return res.status(403).json({ erro: 'Perfil de administrador inativo.' });
      }
      entityId = admin.id;
      nome = admin.nome;
      extraIds = { adminId: admin.id };
    } else if (usuario.role === 'escola') {
      const escola = await Escola.findOne({ where: { userId: usuario.id } });
      if (!escola || !escola.ativa || escola.status === 'inativa') {
        return res.status(403).json({ erro: 'Instituição inativa no sistema.' });
      }
      if (escola.status !== 'aprovada') {
        return res.status(403).json({ erro: 'O cadastro da instituição ainda aguarda aprovação da coordenação.' });
      }
      entityId = escola.id;
      escolaId = escola.id;
      nome = escola.nome;
      extraIds = { escolaId: escola.id };
    } else if (usuario.role === 'aluno') {
      const aluno = await Aluno.findOne({ where: { userId: usuario.id } });
      if (!aluno || !aluno.ativo) {
        return res.status(403).json({ erro: 'Cadastro de estudante inativo.' });
      }
      entityId = aluno.id;
      escolaId = aluno.escolaId;
      nome = aluno.nome;
      extraIds = { alunoId: aluno.id, escolaId: aluno.escolaId };
    }

    const token = jwt.sign(
      { userId: usuario.id, role: usuario.role, entityId, escolaId },
      JWT_SECRET,
      { expiresIn: '12h' }
    );

    return res.json({
      token,
      userId: usuario.id,
      role: usuario.role,
      ...extraIds,
      user: {
        id: entityId,
        userId: usuario.id,
        escolaId,
        nome,
        usuario: usuario.login,
        role: usuario.role,
      },
    });
  } catch {
    return res.status(500).json({ erro: 'Não foi possível realizar a autenticação.' });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { senhaAtual, novaSenha } = req.body;
    if (!senhaAtual || !novaSenha || String(novaSenha).length < 8) {
      return res.status(400).json({ erro: 'A nova senha deve possuir no mínimo 8 caracteres.' });
    }

    const usuario = await Usuario.findByPk(req.user.userId);
    if (!usuario) {
      return res.status(404).json({ erro: 'Usuário não encontrado.' });
    }

    const confere = await bcrypt.compare(String(senhaAtual), usuario.senha);
    if (!confere) {
      return res.status(400).json({ campo: 'senhaAtual', erro: 'A senha atual está incorreta.' });
    }

    const hashNova = await bcrypt.hash(String(novaSenha), 10);
    await usuario.update({ senha: hashNova });

    return res.json({ mensagem: 'Senha alterada com sucesso.' });
  } catch {
    return res.status(500).json({ erro: 'Erro interno ao alterar a senha.' });
  }
};

exports.getUsuarioById = async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.params.id, {
      attributes: ['id', 'login', 'role', 'ativo', 'createdAt'],
    });
    if (!usuario) return res.status(404).json({ erro: 'Usuário não encontrado.' });
    return res.json(usuario);
  } catch {
    return res.status(500).json({ erro: 'Erro ao consultar usuário.' });
  }
};