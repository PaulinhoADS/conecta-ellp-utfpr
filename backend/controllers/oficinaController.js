// backend/controllers/oficinaController.js
const Oficina = require('../models/Oficina');
const Aluno = require('../models/Aluno');

const formatarOficina = async (oficina) => {
  const inscritos = await Aluno.count({
    where: { oficinaId: oficina.id, ativo: true },
  });
  const json = oficina.toJSON();
  return {
    ...json,
    inscritos,
    vagasDisponiveis: Math.max(0, json.vagas - inscritos),
  };
};

exports.listar = async (req, res) => {
  try {
    const oficinas = await Oficina.findAll({ order: [['id', 'ASC']] });
    const resultado = await Promise.all(oficinas.map(formatarOficina));
    return res.json(resultado);
  } catch {
    return res.status(500).json({ erro: 'Erro ao listar oficinas.' });
  }
};

exports.obterPorId = async (req, res) => {
  try {
    const oficina = await Oficina.findByPk(req.params.id);
    if (!oficina) return res.status(404).json({ erro: 'Oficina não encontrada.' });
    return res.json(await formatarOficina(oficina));
  } catch {
    return res.status(500).json({ erro: 'Erro ao buscar oficina.' });
  }
};

exports.criar = async (req, res) => {
  try {
    const nome = String(req.body.nome || '').trim();
    const tema = String(req.body.tema || '').trim();
    const descricao = String(req.body.descricao || '').trim();
    const vagas = Number(req.body.vagas);

    if (!nome || !tema || !descricao || !Number.isInteger(vagas) || vagas < 1) {
      return res.status(400).json({ erro: 'Preencha nome, tema, descrição e número válido de vagas.' });
    }

    const nova = await Oficina.create({ nome, tema, vagas, descricao, ativa: true });
    return res.status(201).json(await formatarOficina(nova));
  } catch {
    return res.status(400).json({ erro: 'Não foi possível cadastrar a oficina.' });
  }
};

exports.atualizar = async (req, res) => {
  try {
    const oficina = await Oficina.findByPk(req.params.id);
    if (!oficina) return res.status(404).json({ erro: 'Oficina não encontrada.' });

    const camposPermitidos = {};
    if (req.body.nome !== undefined) camposPermitidos.nome = String(req.body.nome).trim();
    if (req.body.tema !== undefined) camposPermitidos.tema = String(req.body.tema).trim();
    if (req.body.descricao !== undefined) camposPermitidos.descricao = String(req.body.descricao).trim();
    if (req.body.vagas !== undefined) {
      const vagasNum = Number(req.body.vagas);
      if (!Number.isInteger(vagasNum) || vagasNum < 1) {
        return res.status(400).json({ erro: 'Número de vagas inválido.' });
      }
      camposPermitidos.vagas = vagasNum;
    }
    if (req.body.ativa !== undefined) camposPermitidos.ativa = Boolean(req.body.ativa);

    await oficina.update(camposPermitidos);
    return res.json(await formatarOficina(oficina));
  } catch {
    return res.status(400).json({ erro: 'Não foi possível atualizar a oficina.' });
  }
};