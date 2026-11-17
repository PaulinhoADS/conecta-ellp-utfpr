// backend/routes/escolaRoutes.js
const express = require('express');
const router = express.Router();
const escolaController = require('../controllers/escolaController');
const alunoController = require('../controllers/alunoController');
const { autenticar, autorizar } = require('../middlewares/authMiddleware');

// POST /escolas público para autocadastro (força status: 'pendente')
router.post('/', escolaController.criar);

// Rotas de escola autenticadas
router.get('/', autenticar, autorizar(['admin', 'superadmin']), escolaController.listar);
router.get('/:id', autenticar, autorizar(['admin', 'superadmin', 'escola'], { verifySchoolOwnership: true }), escolaController.obterPorId);
router.put('/:id', autenticar, autorizar(['admin', 'superadmin', 'escola'], { verifySchoolOwnership: true }), escolaController.atualizar);
router.delete('/:id', autenticar, autorizar(['admin', 'superadmin']), escolaController.remover);

// Rotas aninhadas de alunos da escola (validando :escolaId e ownership)
router.post('/:escolaId/alunos', autenticar, autorizar(['admin', 'superadmin', 'escola'], { verifySchoolOwnership: true }), alunoController.criar);
router.get('/:escolaId/alunos/:id', autenticar, autorizar(['admin', 'superadmin', 'escola', 'aluno'], { verifyStudentOwnership: true }), alunoController.obterPorId);
router.put('/:escolaId/alunos/:id', autenticar, autorizar(['admin', 'superadmin', 'escola', 'aluno'], { verifyStudentOwnership: true }), alunoController.atualizar);
router.delete('/:escolaId/alunos/:id', autenticar, autorizar(['admin', 'superadmin', 'escola'], { verifySchoolOwnership: true }), alunoController.desativar);

module.exports = router;