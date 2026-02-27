const User = require('../models/User');
const bcrypt = require('bcryptjs');

exports.authenticateUser = async (email, password) => {
  try {
    const normalizedEmail = email.toLowerCase();
    let user = await User.findOne({ email: normalizedEmail });

    // Compatibilidade com emails legados do administrador
    if (!user) {
      const legacyAdminEmails = ['admin@goldcredit.com', 'admin@securitizadora.com'];
      if (legacyAdminEmails.includes(normalizedEmail)) {
        user = await User.findOne({ email: 'admin@crmleads.com' });
      }
    }

    if (!user) {
      throw new Error('Usuário não encontrado');
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      console.error('Password comparison failed', {
        providedEmail: email,
        passwordLength: password.length,
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
    const existingUser = await User.findOne({ email: userData.email.toLowerCase() });

    if (existingUser) {
      throw new Error('E-mail já cadastrado');
    }

    // Password will be hashed by the pre-save hook in the model
    const user = await User.create(userData);
    return user;
  } catch (error) {
    throw new Error(error.message || 'Erro ao criar usuário');
  }
};

exports.updateUser = async (id, userData) => {
  try {
    const user = await User.findById(id);
    if (!user) {
      throw new Error('Usuário não encontrado');
    }

    // Handle password update
    if (userData.password && userData.password.length < 50) {
      const salt = await bcrypt.genSalt(10);
      userData.password = await bcrypt.hash(userData.password, salt);
    } else if (!userData.password || userData.password === '') {
      delete userData.password;
    }

    Object.assign(user, userData);
    await user.save();
    return user;
  } catch (error) {
    throw new Error(error.message || 'Erro ao atualizar usuário');
  }
};

exports.deleteUser = async (id) => {
  try {
    const user = await User.findById(id);

    if (!user) {
      throw new Error('Usuário não encontrado');
    }

    await user.deleteOne();
    return true;
  } catch (error) {
    throw new Error(error.message || 'Erro ao excluir usuário');
  }
};
