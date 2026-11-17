// backend/routes/administradorRoutes.js
const express = require('express');
const router = express.Router();
const administradorController = require('../controllers/administradorController');
const { autenticar, autorizar } = require('../middlewares/authMiddleware');

router.get('/', autenticar, autorizar(['admin', 'superadmin']), administradorController.listar);
router.get('/:id', autenticar, autorizar(['admin', 'superadmin'], { verifyAdminOwnership: true }), administradorController.obterPorId);
router.post('/', autenticar, autorizar(['admin', 'superadmin']), administradorController.criar);
router.put('/:id', autenticar, autorizar(['admin', 'superadmin'], { verifyAdminOwnership: true }), administradorController.atualizar);

module.exports = router;