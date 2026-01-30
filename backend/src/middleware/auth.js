/**
 * Authentication Middleware
 * Verifica token JWT
 */

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Acesso negado. Token não fornecido.' });
  }

  try {
    // Verificar token (implementar com jsonwebtoken)
    // const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // req.user = decoded;
    next();
  } catch (error) {
    res.status(403).json({ error: 'Token inválido ou expirado' });
  }
};

/**
 * Verificar role do usuário
 */
const authorizeRole = (roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Permissão negada' });
    }
    next();
  };
};

module.exports = {
  authenticateToken,
  authorizeRole,
};
