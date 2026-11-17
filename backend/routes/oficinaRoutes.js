// backend/routes/oficinaRoutes.js
const express = require('express');
const router = express.Router();
const oficinaController = require('../controllers/oficinaController');
const { autenticar, autorizar } = require('../middlewares/authMiddleware');

// GET público 
router.get('/', oficinaController.listar);
router.get('/:id', oficinaController.obterPorId);

// Criação e edição restritas a admin/superadmin
router.post('/', autenticar, autorizar(['admin', 'superadmin']), oficinaController.criar);
router.put('/:id', autenticar, autorizar(['admin', 'superadmin']), oficinaController.atualizar);

module.exports = router;