// backend/routes/alunoRoutes.js
const express = require('express');
const router = express.Router();
const alunoController = require('../controllers/alunoController');
const { autenticar, autorizar } = require('../middlewares/authMiddleware');

router.get('/', autenticar, autorizar(['admin', 'superadmin', 'escola']), alunoController.listar);
router.get('/:id', autenticar, autorizar(['admin', 'superadmin', 'escola', 'aluno'], { verifyStudentOwnership: true }), alunoController.obterPorId);

module.exports = router;