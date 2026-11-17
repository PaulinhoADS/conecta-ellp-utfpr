// backend/controllers/alunoController.js
const bcrypt = require('bcryptjs');
const Aluno = require('../models/Aluno');
const Usuario = require('../models/Usuario');
const Oficina = require('../models/Oficina');
const Escola = require('../models/Escola');

const serializarAluno = (alunoInstance) => {
  const json = alunoInstance.toJSON();
  return {
    id: json.id,
    userId: json.userId,
    escolaId: json.escolaId,
    oficinaId: json.oficinaId,
    oficinaNome: json.oficina ? json.oficina.nome : null,
    nome: json.nome,
    username: json.usuario ? json.usuario.login : '',
    idade: json.idade,
    perfilLogico: json.perfilLogico,
    perfilLologico: json.perfilLogico,
    ativo: json.ativo,
  };
};

// Vincula o aluno à oficina recomendada verificando disponibilidade de vagas
const resolverOficinaComVagas = async (nomeOuPerfil, oficinaIdExplicito, alunoIdAtual = null) => {
  let oficinaAlvo = null;

  if (oficinaIdExplicito) {
    oficinaAlvo = await Oficina.findByPk(Number(oficinaIdExplicito));
  } else if (nomeOuPerfil && nomeOuPerfil !== 'Aguardando Quiz Perfil Tech') {
    const todas = await Oficina.findAll({ where: { ativa: true } });
    oficinaAlvo = todas.find((o) =>
      String(nomeOuPerfil).toLowerCase().includes(o.nome.toLowerCase())
    );
  }

  if (!oficinaAlvo) return { oficinaId: null, perfilLogico: nomeOuPerfil || 'Aguardando Quiz Perfil Tech' };

  const inscritosCount = await Aluno.count({
    where: { oficinaId: oficinaAlvo.id, ativo: true },
  });

  const jaEstaNela = alunoIdAtual
    ? (await Aluno.findByPk(alunoIdAtual))?.oficinaId === oficinaAlvo.id
    : false;

  if (!jaEstaNela && inscritosCount >= oficinaAlvo.vagas) {
    throw new Error(`A oficina "${oficinaAlvo.nome}" atingiu o limite máximo de ${oficinaAlvo.vagas} vagas.`);
  }

  return { oficinaId: oficinaAlvo.id, perfilLogico: oficinaAlvo.nome };
};

exports.listar = async (req, res) => {
  try {
    const filtro = { ativo: true };
    if (req.user.role === 'escola') {
      filtro.escolaId = req.user.entityId;
    }

    const alunos = await Aluno.findAll({
      where: filtro,
      include: [
        { model: Usuario, as: 'usuario', attributes: ['id', 'login', 'ativo'] },
        { model: Oficina, as: 'oficina', attributes: ['id', 'nome', 'vagas'] },
      ],
      order: [['id', 'ASC']],
    });
    return res.json(alunos.map(serializarAluno));
  } catch {
    return res.status(500).json({ erro: 'Erro ao listar estudantes.' });
  }
};

exports.obterPorId = async (req, res) => {
  try {
    const aluno = await Aluno.findByPk(req.params.id, {
      include: [
        { model: Usuario, as: 'usuario', attributes: ['id', 'login', 'ativo'] },
        { model: Oficina, as: 'oficina', attributes: ['id', 'nome', 'vagas'] },
      ],
    });
    if (!aluno || !aluno.ativo) {
      return res.status(404).json({ erro: 'Estudante não encontrado.' });
    }
    if (req.params.escolaId && Number(aluno.escolaId) !== Number(req.params.escolaId)) {
      return res.status(404).json({ erro: 'Este estudante não pertence à escola informada.' });
    }
    return res.json(serializarAluno(aluno));
  } catch {
    return res.status(500).json({ erro: 'Erro ao buscar dados do estudante.' });
  }
};

exports.criar = async (req, res) => {
  try {
    const escolaId = Number(req.params.escolaId);
    const escola = await Escola.findByPk(escolaId);
    if (!escola) {
      return res.status(404).json({ erro: 'Escola não encontrada.' });
    }

    const nome = String(req.body.nome || '').trim();
    const username = String(req.body.username || '').trim().toLowerCase();
    const idade = Number(req.body.idade);
    const perfilRecebido = req.body.perfilLogico || req.body.perfilLologico || 'Aguardando Quiz Perfil Tech';
    const senhaInicial = String(req.body.senhaTemporaria || req.body.senha || 'aluno1234');

    if (!nome || !username || !Number.isInteger(idade) || idade < 6 || idade > 25) {
      return res.status(400).json({ erro: 'Informe nome completo, username e idade válida (entre 6 e 25 anos).' });
    }

    const existente = await Usuario.findOne({ where: { login: username } });
    if (existente) {
      return res.status(409).json({ campo: 'username', erro: 'Este nome de usuário já está em uso.' });
    }

    const vinculoOficina = await resolverOficinaComVagas(perfilRecebido, req.body.oficinaId);
    const senhaHash = await bcrypt.hash(senhaInicial, 10);

    const novoUsuario = await Usuario.create({
      login: username,
      senha: senhaHash,
      role: 'aluno',
      ativo: true,
    });

    const novoAluno = await Aluno.create({
      userId: novoUsuario.id,
      escolaId,
      oficinaId: vinculoOficina.oficinaId,
      nome,
      idade,
      perfilLogico: vinculoOficina.perfilLogico,
      ativo: true,
    });

    const completo = await Aluno.findByPk(novoAluno.id, {
      include: [
        { model: Usuario, as: 'usuario', attributes: ['id', 'login'] },
        { model: Oficina, as: 'oficina', attributes: ['id', 'nome'] },
      ],
    });

    // Devolve a senha gerada apenas no response da criação para a escola repassar ao aluno, sem gravar em texto puro no banco
    return res.status(201).json({
      ...serializarAluno(completo),
      senhaTemporaria: senhaInicial,
    });
  } catch (err) {
    if (err.message && err.message.includes('limite máximo')) {
      return res.status(400).json({ erro: err.message });
    }
    return res.status(400).json({ erro: 'Não foi possível cadastrar o estudante.' });
  }
};

exports.atualizar = async (req, res) => {
  try {
    const escolaIdParam = Number(req.params.escolaId);
    const aluno = await Aluno.findByPk(req.params.id, {
      include: [{ model: Usuario, as: 'usuario' }],
    });

    if (!aluno || !aluno.ativo) {
      return res.status(404).json({ erro: 'Estudante não encontrado.' });
    }

    // Validação estrita do :escolaId na URL (Item 9 do Victor)
    if (escolaIdParam && Number(aluno.escolaId) !== escolaIdParam) {
      return res.status(403).json({ erro: 'Este estudante não pertence à instituição informada na rota.' });
    }

    const updates = {};
    if (req.body.nome !== undefined) updates.nome = String(req.body.nome).trim();
    if (req.body.idade !== undefined) {
      const idadeNum = Number(req.body.idade);
      if (!Number.isInteger(idadeNum) || idadeNum < 6 || idadeNum > 25) {
        return res.status(400).json({ erro: 'Idade inválida (deve ser entre 6 e 25 anos).' });
      }
      updates.idade = idadeNum;
    }

    const perfilDesejado = req.body.perfilLogico || req.body.perfilLologico;
    if (perfilDesejado !== undefined || req.body.oficinaId !== undefined) {
      const vinculo = await resolverOficinaComVagas(perfilDesejado, req.body.oficinaId, aluno.id);
      updates.oficinaId = vinculo.oficinaId;
      updates.perfilLogico = vinculo.perfilLogico;
    }

    if (req.body.username !== undefined && aluno.usuario) {
      const novoUsername = String(req.body.username).trim().toLowerCase();
      if (novoUsername !== aluno.usuario.login) {
        const conflito = await Usuario.findOne({ where: { login: novoUsername } });
        if (conflito) {
          return res.status(409).json({ campo: 'username', erro: 'Este nome de usuário já está em uso.' });
        }
        await aluno.usuario.update({ login: novoUsername });
      }
    }

    // Caso a escola ou admin solicite redefinição de senha temporária para o aluno
    if (req.body.novaSenhaTemporaria && ['admin', 'superadmin', 'escola'].includes(req.user.role) && aluno.usuario) {
      const hash = await bcrypt.hash(String(req.body.novaSenhaTemporaria), 10);
      await aluno.usuario.update({ senha: hash });
    }

    await aluno.update(updates);

    const atualizado = await Aluno.findByPk(aluno.id, {
      include: [
        { model: Usuario, as: 'usuario', attributes: ['id', 'login'] },
        { model: Oficina, as: 'oficina', attributes: ['id', 'nome'] },
      ],
    });

    return res.json(serializarAluno(atualizado));
  } catch (err) {
    if (err.message && err.message.includes('limite máximo')) {
      return res.status(400).json({ erro: err.message });
    }
    return res.status(400).json({ erro: 'Não foi possível atualizar os dados do estudante.' });
  }
};

// Desativa o aluno (Soft Delete — Item 2 do Victor)
exports.desativar = async (req, res) => {
  try {
    const escolaIdParam = Number(req.params.escolaId);
    const aluno = await Aluno.findByPk(req.params.id, {
      include: [{ model: Usuario, as: 'usuario' }],
    });

    if (!aluno) return res.status(404).json({ erro: 'Estudante não encontrado.' });
    if (escolaIdParam && Number(aluno.escolaId) !== escolaIdParam) {
      return res.status(403).json({ erro: 'Este estudante não pertence à escola informada.' });
    }

    await aluno.update({ ativo: false, oficinaId: null });
    if (aluno.usuario) {
      await aluno.usuario.update({ ativo: false });
    }

    return res.status(204).send();
  } catch {
    return res.status(500).json({ erro: 'Erro ao desativar estudante.' });
  }
};