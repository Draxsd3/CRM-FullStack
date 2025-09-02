const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    // Skip authentication for login route
    if (req.path === '/login' && req.method === 'POST') {
      return next();
    }

    // Get token from header
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return res.status(401).json({ 
        success: false, 
        error: 'Token de autenticação não fornecido' 
      });
    }

    const token = authHeader.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ 
        success: false, 
        error: 'Token de autenticação inválido' 
      });
    }

    // Verify token with more robust options
    const decoded = jwt.verify(token, process.env.JWT_SECRET, {
      algorithms: ['HS256'],
      maxAge: '24h',
      issuer: 'SecuritizadoraCRM'
    });

    const user = await User.findByPk(decoded.id, {
      attributes: { exclude: ['password'] }
    });
    
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        error: 'Usuário não encontrado' 
      });
    }

    req.user = user.toJSON(); // Convert to plain object to avoid Sequelize issues
    next();
  } catch (error) {
    console.error('Authentication Error:', error);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        success: false, 
        error: 'Token inválido',
        details: error.message 
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        success: false, 
        error: 'Token expirado',
        details: 'Faça login novamente' 
      });
    }
    
    res.status(500).json({ 
      success: false, 
      error: 'Erro interno de autenticação' 
    });
  }
};

module.exports = auth;