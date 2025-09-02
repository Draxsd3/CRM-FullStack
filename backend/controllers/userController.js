const userService = require('../services/userService');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

const generateToken = (user) => {
  return jwt.sign(
    { 
      id: user.id, 
      email: user.email, 
      role: user.role 
    }, 
    process.env.JWT_SECRET, 
    { 
      expiresIn: '24h',
      algorithm: 'HS256',
      issuer: 'SecuritizadoraCRM'
    }
  );
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        error: 'E-mail e senha são obrigatórios' 
      });
    }
    
    const user = await userService.authenticateUser(email, password);
    
    const token = generateToken(user);
    
    const userResponse = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      bio: user.bio,
      phoneNumber: user.phoneNumber,
      position: user.position,
      profilePhoto: user.profilePhoto,
    };
    
    res.json({
      success: true,
      token,
      user: userResponse
    });
  } catch (error) {
    next(error);
  }
};

exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] }
    });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'Usuário não encontrado'
      });
    }
    
    res.json({
      success: true,
      user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Erro ao buscar usuário'
    });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password'] }
    });
    
    res.json({
      success: true,
      data: users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Erro ao buscar usuários'
    });
  }
};

exports.createUser = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        errors: errors.array() 
      });
    }
    
    const user = await userService.createUser(req.body);
    
    res.status(201).json({
      success: true,
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        bio: user.bio,
        phoneNumber: user.phoneNumber,
        position: user.position,
        profilePhoto: user.profilePhoto,
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        errors: errors.array() 
      });
    }
    
    const user = await userService.updateUser(req.params.id, req.body);
    
    res.json({
      success: true,
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        bio: user.bio,
        phoneNumber: user.phoneNumber,
        position: user.position,
        profilePhoto: user.profilePhoto,
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    // Create uploads directory if it doesn't exist
    const uploadsDir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    
    // Find the user
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'Usuário não encontrado'
      });
    }
    
    // Prepare update data
    const updateData = {
      name: req.body.name ?? user.name,
      bio: req.body.bio ?? user.bio,
      phoneNumber: req.body.phoneNumber ?? user.phoneNumber,
      position: req.body.position ?? user.position
    };
    
    // If there's a new password, add it to update data
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(req.body.password, salt);
    }
    
    // If there's a profile photo, add it to update data
    if (req.file) {
      updateData.profilePhoto = req.file.filename;
    }
    
    await user.update(updateData);
    
    // Return updated user without password
    const userData = user.toJSON();
    delete userData.password;
    
    res.json({
      success: true,
      data: userData
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao atualizar perfil'
    });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    await userService.deleteUser(req.params.id);
    res.json({
      success: true,
      message: 'Usuário excluído com sucesso'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};