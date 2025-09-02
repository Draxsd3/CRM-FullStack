const User = require('../models/User');

const roleAuth = (requiredRoles) => {
  return async (req, res, next) => {
    try {
      // Check if user is authenticated
      if (!req.user) {
        return res.status(401).json({ 
          success: false, 
          error: 'Autenticação necessária' 
        });
      }

      // Check if the user's role is in the requiredRoles array
      if (!requiredRoles.includes(req.user.role)) {
        return res.status(403).json({ 
          success: false, 
          error: 'Você não tem permissão para acessar este recurso' 
        });
      }

      next();
    } catch (error) {
      console.error('Authorization Error:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Erro de autorização' 
      });
    }
  };
};

module.exports = roleAuth;