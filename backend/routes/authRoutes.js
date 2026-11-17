// backend/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { autenticar, autorizar } = require('../middlewares/authMiddleware');

router.post('/login', authController.login);
router.put('/auth/senha', autenticar, authController.changePassword);
router.get('/usuarios/:id', autenticar, autorizar(['admin', 'superadmin']), authController.getUsuarioById);

module.exports = router;