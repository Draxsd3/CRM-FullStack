const User = require('../models/User');
const bcrypt = require('bcryptjs');
const { Op } = require('sequelize');

/**
 * Atenção ao uso do operador ILIKE
 * MariaDB/MySQL NÃO SUPORTA o operador ILIKE (insensível a maiúsculas/minúsculas).
 * Use o operador 'like' e normalize os campos aplicáveis para comparação case-insensitive.
 */
exports.authenticateUser = async (email, password) => {
  try {
    // Find user by email - MySQL is already case-insensitive with default collation
    const user = await User.findOne({ 
      where: { email }
    });
    
    if (!user) {
      throw new Error('Usuário não encontrado');
    }
    
    // Use a consistent bcrypt implementation with fixed salt rounds
    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) {
      console.error('Password comparison failed', {
        providedEmail: email,
        passwordLength: password.length
      });
      throw new Error('Senha incorreta');
    }
    
    return user;
  } catch (error) {
    console.error('Authentication error:', error);
    throw error;
  }
};

exports.createUser = async (userData) => {
  try {
    // Check for existing user
    const existingUser = await User.findOne({ 
      where: { email: userData.email } 
    });
    
    if (existingUser) {
      throw new Error('E-mail já cadastrado');
    }
    
    // Hash password with consistent method - 10 rounds
    if (userData.password) {
      const salt = await bcrypt.genSalt(10);
      userData.password = await bcrypt.hash(userData.password, salt);
    }
    
    const user = await User.create(userData);
    return user;
  } catch (error) {
    throw new Error(error.errors?.[0]?.message || error.message || 'Erro ao criar usuário');
  }
};

exports.updateUser = async (id, userData) => {
  try {
    const user = await User.findByPk(id);
    if (!user) {
      throw new Error('Usuário não encontrado');
    }
    
    if (userData.password && userData.password.length < 50) { // Avoid double-hashing
      const salt = await bcrypt.genSalt(10);
      userData.password = await bcrypt.hash(userData.password, salt);
    } else if (userData.password === undefined || userData.password === "") {
      delete userData.password;
    }
    
    await user.update(userData);
    return user;
  } catch (error) {
    throw new Error(error.errors?.[0]?.message || error.message || 'Erro ao atualizar usuário');
  }
};

exports.deleteUser = async (id) => {
  try {
    const user = await User.findByPk(id);
    
    if (!user) {
      throw new Error('Usuário não encontrado');
    }
    
    await user.destroy();
    return true;
  } catch (error) {
    throw new Error(error.errors?.[0]?.message || error.message || 'Erro ao excluir usuário');
  }
};