// backend/middlewares/authMiddleware.js
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'conecta_ellp_utfpr_secret_key_2026';

// Valida o Token JWT enviado no header Authorization
const autenticar = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ erro: 'Token de autenticação não fornecido.' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload; // Contém { userId, role, entityId, escolaId }
    return next();
  } catch {
    return res.status(401).json({ erro: 'Token inválido ou expirado.' });
  }
};

// Autoriza por papel (role) e verifica propriedade do registro (ownership)
const autorizar = (allowedRoles = [], opcoes = {}) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ erro: 'Não autenticado.' });
    }

    const { role, entityId, escolaId } = req.user;
    const rolesLista = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

    if (rolesLista.length > 0 && !rolesLista.includes(role)) {
      return res.status(403).json({ erro: 'Você não tem permissão para realizar esta ação.' });
    }

    const isAdmin = ['admin', 'superadmin'].includes(role);
    const isSuperAdmin = role === 'superadmin';

    if (opcoes.verifyAdminOwnership && !isSuperAdmin) {
      if (String(entityId) !== String(req.params.id)) {
        return res.status(403).json({ erro: 'Acesso permitido apenas ao próprio perfil administrativo.' });
      }
    }

    if (opcoes.verifySchoolOwnership && !isAdmin) {
      const targetSchoolId = req.params.escolaId || req.params.id;
      if (role !== 'escola' || String(entityId) !== String(targetSchoolId)) {
        return res.status(403).json({ erro: 'Acesso permitido apenas à própria instituição.' });
      }
    }

    if (opcoes.verifyStudentOwnership && !isAdmin) {
      const paramAlunoId = req.params.id;
      const paramEscolaId = req.params.escolaId;

      const ehProprioAluno = role === 'aluno' && String(entityId) === String(paramAlunoId);
      const ehEscolaDona = role === 'escola' && paramEscolaId && String(entityId) === String(paramEscolaId);

      if (!ehProprioAluno && !ehEscolaDona) {
        return res.status(403).json({ erro: 'Acesso negado aos dados deste estudante.' });
      }
    }

    return next();
  };
};

module.exports = { autenticar, autorizar, JWT_SECRET };