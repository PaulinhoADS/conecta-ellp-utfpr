// backend/controllers/administradorController.js
const bcrypt = require('bcryptjs');
const Administrador = require('../models/Administrador');
const Usuario = require('../models/Usuario');

const validarEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || '').trim());

const serializarAdmin = (adminInstance) => {
  const json = adminInstance.toJSON();
  return {
    id: json.id,
    userId: json.userId,
    nome: json.nome,
    email: json.usuario ? json.usuario.login : '',
    tipoAcesso: json.usuario ? json.usuario.role : 'admin',
    role: json.usuario ? json.usuario.role : 'admin',
    telefone: json.telefone,
    ra: json.ra,
    curso: json.curso,
    oficinaPref: json.oficinaPref,
    ativo: json.ativo,
  };
};

exports.listar = async (req, res) => {
  try {
    const admins = await Administrador.findAll({
      include: [{ model: Usuario, as: 'usuario', attributes: ['id', 'login', 'role', 'ativo'] }],
      order: [['id', 'ASC']],
    });
    return res.json(admins.map(serializarAdmin));
  } catch {
    return res.status(500).json({ erro: 'Erro ao listar equipe administrativa.' });
  }
};

exports.obterPorId = async (req, res) => {
  try {
    const admin = await Administrador.findByPk(req.params.id, {
      include: [{ model: Usuario, as: 'usuario', attributes: ['id', 'login', 'role', 'ativo'] }],
    });
    if (!admin) return res.status(404).json({ erro: 'Administrador não encontrado.' });
    return res.json(serializarAdmin(admin));
  } catch {
    return res.status(500).json({ erro: 'Erro ao consultar administrador.' });
  }
};

exports.criar = async (req, res) => {
  try {
    const nome = String(req.body.nome || '').trim();
    const email = String(req.body.email || '').trim().toLowerCase();
    const telefone = String(req.body.telefone || '').trim();
    const roleEscolhida = req.body.tipoAcesso === 'superadmin' || req.body.role === 'superadmin' ? 'superadmin' : 'admin';
    const ra = String(req.body.ra || (roleEscolhida === 'superadmin' ? 'Docente UTFPR' : '')).trim();
    const curso = String(req.body.curso || 'Análise e Desenvolvimento de Sistemas').trim();
    const oficinaPref = String(req.body.oficinaPref || 'Robótica LEGO').trim();
    const senhaInicial = String(req.body.senha || 'ellp12345');

    if (!nome || !validarEmail(email)) {
      return res.status(400).json({ erro: 'Informe nome completo e um e-mail válido.' });
    }

    const existente = await Usuario.findOne({ where: { login: email } });
    if (existente) {
      return res.status(409).json({ erro: 'Já existe um usuário com este e-mail.' });
    }

    const senhaHash = await bcrypt.hash(senhaInicial, 10);
    const novoUsuario = await Usuario.create({
      login: email,
      senha: senhaHash,
      role: roleEscolhida,
      ativo: true,
    });

    const novoAdmin = await Administrador.create({
      userId: novoUsuario.id,
      nome,
      telefone,
      ra,
      curso,
      oficinaPref,
      ativo: true,
    });

    const completo = await Administrador.findByPk(novoAdmin.id, {
      include: [{ model: Usuario, as: 'usuario', attributes: ['id', 'login', 'role', 'ativo'] }],
    });

    return res.status(201).json(serializarAdmin(completo));
  } catch {
    return res.status(400).json({ erro: 'Não foi possível cadastrar o membro na equipe.' });
  }
};

exports.atualizar = async (req, res) => {
  try {
    const admin = await Administrador.findByPk(req.params.id, {
      include: [{ model: Usuario, as: 'usuario' }],
    });
    if (!admin) return res.status(404).json({ erro: 'Membro não encontrado.' });

    const updates = {};
    if (req.body.nome !== undefined) updates.nome = String(req.body.nome).trim();
    if (req.body.telefone !== undefined) updates.telefone = String(req.body.telefone).trim();
    if (req.body.ra !== undefined) updates.ra = String(req.body.ra).trim();
    if (req.body.curso !== undefined) updates.curso = String(req.body.curso).trim();
    if (req.body.oficinaPref !== undefined) updates.oficinaPref = String(req.body.oficinaPref).trim();
    if (req.body.ativo !== undefined) updates.ativo = Boolean(req.body.ativo);

    await admin.update(updates);

    if (admin.usuario) {
      const userUpdates = {};
      if (req.body.email !== undefined) {
        const novoEmail = String(req.body.email).trim().toLowerCase();
        if (!validarEmail(novoEmail)) {
          return res.status(400).json({ erro: 'E-mail inválido.' });
        }
        userUpdates.login = novoEmail;
      }
      // Apenas superadmin pode promover ou alterar role na tabela Usuario
      if (req.user.role === 'superadmin' && (req.body.tipoAcesso || req.body.role)) {
        const novaRole = (req.body.tipoAcesso || req.body.role) === 'superadmin' ? 'superadmin' : 'admin';
        userUpdates.role = novaRole;
      }
      if (req.body.ativo !== undefined) {
        userUpdates.ativo = Boolean(req.body.ativo);
      }
      if (Object.keys(userUpdates).length > 0) {
        await admin.usuario.update(userUpdates);
      }
    }

    const atualizado = await Administrador.findByPk(admin.id, {
      include: [{ model: Usuario, as: 'usuario', attributes: ['id', 'login', 'role', 'ativo'] }],
    });

    return res.json(serializarAdmin(atualizado));
  } catch {
    return res.status(400).json({ erro: 'Não foi possível atualizar os dados do membro.' });
  }
};