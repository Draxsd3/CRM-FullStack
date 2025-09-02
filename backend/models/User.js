const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const bcrypt = require('bcryptjs');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Nome é obrigatório' },
      len: { args: [2, 100], msg: 'Nome deve ter entre 2 e 100 caracteres' }
    }
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: { msg: 'Este e-mail já está cadastrado' },
    validate: {
      isEmail: { msg: 'E-mail inválido' }
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: { args: [6, 255], msg: 'Senha deve ter no mínimo 6 caracteres' }
    }
  },
  role: {
    type: DataTypes.ENUM('ADM', 'SDR', 'Supervisor', 'Closer'),
    allowNull: false,
    defaultValue: 'SDR',
    validate: {
      isValidRole(value) {
        const validRoles = ['ADM', 'SDR', 'Supervisor', 'Closer'];
        if (!validRoles.includes(value)) {
          throw new Error('Função de usuário inválida');
        }
      }
    }
  },
  closerSpecialty: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      len: { args: [0, 100], msg: 'Especialidade muito longa' }
    }
  },
  performanceScore: {
    type: DataTypes.FLOAT,
    allowNull: true,
    defaultValue: 0,
    validate: {
      min: 0,
      max: 100
    }
  },
  bio: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  phoneNumber: {
    type: DataTypes.STRING(30),
    allowNull: true,
  },
  position: {
    type: DataTypes.STRING(60),
    allowNull: true,
  },
  profilePhoto: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
}, {
  timestamps: true,
  hooks: {
    beforeCreate: async (user) => {
      // Ensure password is hashed
      if (user.password && user.password.length < 60) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      }
    },
    beforeUpdate: async (user) => {
      if (user.changed('password') && user.password && user.password.length < 60) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      }
    }
  }
});

module.exports = User;