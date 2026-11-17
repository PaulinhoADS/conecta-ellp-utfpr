// backend/controllers/escolaController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Escola = require('../models/Escola');
const Aluno = require('../models/Aluno');
const Usuario = require('../models/Usuario');
const Oficina = require('../models/Oficina');
const { JWT_SECRET } = require('../middlewares/authMiddleware');

const validarEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || '').trim());
const validarCnpj = (cnpj) => String(cnpj || '').replace(/\D/g, '').length === 14;

const serializarEscola = (escolaInstance) => {
  const json = escolaInstance.toJSON();
  const alunosAtivos = (json.alunos || [])
    .filter((a) => a.ativo !== false)
    .map((a) => ({
      id: a.id,
      userId: a.userId,
      escolaId: a.escolaId,
      oficinaId: a.oficinaId,
      oficinaNome: a.oficina ? a.oficina.nome : null,
      nome: a.nome,
      username: a.usuario ? a.usuario.login : '',
      idade: a.idade,
      perfilLogico: a.perfilLogico,
      perfilLologico: a.perfilLogico,
      ativo: a.ativo,
    }));

  return {
    id: json.id,
    userId: json.userId,
    nome: json.nome,
    cnpj: json.cnpj,
    tipo: json.tipo,
    endereco: json.endereco,
    telefone: json.telefone,
    email: json.usuario ? json.usuario.login : '',
    responsavel: json.responsavel,
    vagasSolicitadas: json.vagasSolicitadas,
    status: json.status,
    observacoes: json.observacoes,
    ativa: json.ativa && json.status !== 'inativa',
    cartaConviteEmitidaEm: json.cartaConviteEmitidaEm,
    createdAt: json.createdAt,
    alunos: alunosAtivos,
  };
};

exports.listar = async (req, res) => {
  try {
    const escolas = await Escola.findAll({
      include: [
        { model: Usuario, as: 'usuario', attributes: ['id', 'login', 'ativo'] },
        {
          model: Aluno,
          as: 'alunos',
          include: [
            { model: Usuario, as: 'usuario', attributes: ['id', 'login'] },
            { model: Oficina, as: 'oficina', attributes: ['id', 'nome'] },
          ],
        },
      ],
      order: [['id', 'ASC']],
    });
    return res.json(escolas.map(serializarEscola));
  } catch {
    return res.status(500).json({ erro: 'Erro ao listar escolas parceiras.' });
  }
};

exports.obterPorId = async (req, res) => {
  try {
    const escola = await Escola.findByPk(req.params.id, {
      include: [
        { model: Usuario, as: 'usuario', attributes: ['id', 'login', 'ativo'] },
        {
          model: Aluno,
          as: 'alunos',
          include: [
            { model: Usuario, as: 'usuario', attributes: ['id', 'login'] },
            { model: Oficina, as: 'oficina', attributes: ['id', 'nome'] },
          ],
        },
      ],
    });
    if (!escola) return res.status(404).json({ erro: 'Escola não encontrada.' });
    return res.json(serializarEscola(escola));
  } catch {
    return res.status(500).json({ erro: 'Erro ao carregar dados da escola.' });
  }
};

// POST /escolas (Pode ser público — força status 'pendente' se não for admin)
exports.criar = async (req, res) => {
  try {
    const nome = String(req.body.nome || '').trim();
    const cnpj = String(req.body.cnpj || '').trim();
    const tipo = String(req.body.tipo || 'Escola Pública').trim();
    const endereco = String(req.body.endereco || '').trim();
    const telefone = String(req.body.telefone || '').trim();
    const email = String(req.body.email || '').trim().toLowerCase();
    const responsavel = String(req.body.responsavel || '').trim();
    const vagasSolicitadas = Number(req.body.vagasSolicitadas) || 20;
    const observacoes = String(req.body.observacoes || '').trim();
    const senhaInformada = String(req.body.senha || 'ellp12345');

    if (!nome || !validarCnpj(cnpj) || !endereco || !validarEmail(email)) {
      return res.status(400).json({ erro: 'Dados inválidos. Verifique nome, CNPJ (14 dígitos), endereço e e-mail.' });
    }

    // Verifica se quem chamou é admin autenticado
    let isAdminCaller = false;
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      try {
        const decoded = jwt.verify(authHeader.split(' ')[1], JWT_SECRET);
        isAdminCaller = ['admin', 'superadmin'].includes(decoded.role);
      } catch {
        isAdminCaller = false;
      }
    }

    const statusInicial = isAdminCaller && ['pendente', 'aprovada', 'inativa'].includes(req.body.status)
      ? req.body.status
      : 'pendente';

    const existenteLogin = await Usuario.findOne({ where: { login: email } });
    if (existenteLogin) {
      return res.status(409).json({ erro: 'Este e-mail institucional já está cadastrado.' });
    }

    const senhaHash = await bcrypt.hash(senhaInformada, 10);
    const novoUsuario = await Usuario.create({
      login: email,
      senha: senhaHash,
      role: 'escola',
      ativo: statusInicial === 'aprovada',
    });

    const novaEscola = await Escola.create({
      userId: novoUsuario.id,
      nome,
      cnpj,
      tipo,
      endereco,
      telefone,
      responsavel,
      vagasSolicitadas,
      status: statusInicial,
      observacoes,
      ativa: statusInicial !== 'inativa',
    });

    const completa = await Escola.findByPk(novaEscola.id, {
      include: [
        { model: Usuario, as: 'usuario', attributes: ['id', 'login', 'ativo'] },
        { model: Aluno, as: 'alunos' },
      ],
    });

    return res.status(201).json(serializarEscola(completa));
  } catch {
    return res.status(400).json({ erro: 'Não foi possível cadastrar a instituição. Verifique se o CNPJ já existe.' });
  }
};

exports.atualizar = async (req, res) => {
  try {
    const escola = await Escola.findByPk(req.params.id, {
      include: [{ model: Usuario, as: 'usuario' }],
    });
    if (!escola) return res.status(404).json({ erro: 'Escola não encontrada.' });

    const isAdmin = ['admin', 'superadmin'].includes(req.user.role);
    const updates = {};

    if (req.body.nome !== undefined) updates.nome = String(req.body.nome).trim();
    if (req.body.cnpj !== undefined) {
      if (!validarCnpj(req.body.cnpj)) {
        return res.status(400).json({ erro: 'CNPJ inválido.' });
      }
      updates.cnpj = String(req.body.cnpj).trim();
    }
    if (req.body.tipo !== undefined) updates.tipo = String(req.body.tipo).trim();
    if (req.body.endereco !== undefined) updates.endereco = String(req.body.endereco).trim();
    if (req.body.telefone !== undefined) updates.telefone = String(req.body.telefone).trim();
    if (req.body.responsavel !== undefined) updates.responsavel = String(req.body.responsavel).trim();
    if (req.body.vagasSolicitadas !== undefined) updates.vagasSolicitadas = Number(req.body.vagasSolicitadas) || 20;
    if (req.body.observacoes !== undefined) updates.observacoes = String(req.body.observacoes).trim();

    // Apenas Admin pode alterar status de aprovação ou carta-convite
    if (isAdmin) {
      if (req.body.status !== undefined && ['pendente', 'aprovada', 'inativa'].includes(req.body.status)) {
        updates.status = req.body.status;
        updates.ativa = req.body.status !== 'inativa';
      }
      if (req.body.ativa !== undefined) {
        updates.ativa = Boolean(req.body.ativa);
        if (!updates.ativa) updates.status = 'inativa';
        else if (escola.status === 'inativa' && !req.body.status) updates.status = 'aprovada';
      }
      if (req.body.cartaConviteEmitidaEm !== undefined) {
        updates.cartaConviteEmitidaEm = req.body.cartaConviteEmitidaEm;
      }
    }

    await escola.update(updates);

    if (escola.usuario) {
      const userUpdates = {};
      if (req.body.email) {
        const novoEmail = String(req.body.email).trim().toLowerCase();
        if (!validarEmail(novoEmail)) {
          return res.status(400).json({ erro: 'E-mail institucional inválido.' });
        }
        userUpdates.login = novoEmail;
      }
      if (updates.status !== undefined) {
        userUpdates.ativo = updates.status === 'aprovada';
      }
      if (Object.keys(userUpdates).length > 0) {
        await escola.usuario.update(userUpdates);
      }
    }

    const atualizada = await Escola.findByPk(escola.id, {
      include: [
        { model: Usuario, as: 'usuario', attributes: ['id', 'login', 'ativo'] },
        {
          model: Aluno,
          as: 'alunos',
          include: [
            { model: Usuario, as: 'usuario', attributes: ['id', 'login'] },
            { model: Oficina, as: 'oficina', attributes: ['id', 'nome'] },
          ],
        },
      ],
    });

    return res.json(serializarEscola(atualizada));
  } catch {
    return res.status(400).json({ erro: 'Não foi possível atualizar os dados da escola.' });
  }
};

exports.remover = async (req, res) => {
  try {
    const escola = await Escola.findByPk(req.params.id, {
      include: [{ model: Usuario, as: 'usuario' }],
    });
    if (!escola) return res.status(404).json({ erro: 'Escola não encontrada.' });

    await escola.update({ status: 'inativa', ativa: false });
    if (escola.usuario) {
      await escola.usuario.update({ ativo: false });
    }
    return res.status(204).send();
  } catch {
    return res.status(500).json({ erro: 'Erro ao inativar escola.' });
  }
};