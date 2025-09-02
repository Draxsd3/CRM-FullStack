const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

const Company = sequelize.define('Company', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  cnpj: {
    type: DataTypes.STRING(14),
    allowNull: false,
    unique: true,
    validate: {
      len: {
        args: [14, 14],
        msg: 'CNPJ deve ter exatamente 14 dígitos numéricos'
      },
      is: {
        args: /^\d{14}$/,
        msg: 'CNPJ deve conter apenas números'
      },
      customValidator(value) {
        const cleanedCnpj = value.replace(/\D/g, '');
        
        if (cleanedCnpj.length !== 14) {
          throw new Error('CNPJ inválido');
        }
        
        // Additional CNPJ validation logic
        const calculateCheckDigit = (baseNumber, weights) => {
          const sum = baseNumber
            .split('')
            .map((digit, index) => parseInt(digit) * weights[index])
            .reduce((acc, curr) => acc + curr, 0);
          
          const remainder = sum % 11;
          return remainder < 2 ? 0 : 11 - remainder;
        };

        const firstWeights = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
        const secondWeights = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];

        // First check digit validation
        const baseFirstDigit = cleanedCnpj.slice(0, 12);
        const firstCheckDigit = calculateCheckDigit(baseFirstDigit, firstWeights);
        if (parseInt(cleanedCnpj[12]) !== firstCheckDigit) {
          throw new Error('CNPJ inválido');
        }

        // Second check digit validation
        const baseSecondDigit = cleanedCnpj.slice(0, 13);
        const secondCheckDigit = calculateCheckDigit(baseSecondDigit, secondWeights);
        if (parseInt(cleanedCnpj[13]) !== secondCheckDigit) {
          throw new Error('CNPJ inválido');
        }
      }
    }
  },
  contactName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  contactPhone: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    /* @tweakable Email validation complexity */
    validate: {
      customValidator(value) {
        /* @tweakable validation strictness 
         * 0: Very permissive
         * 1: Basic structure check
         * 2: Strict RFC email validation
         */
        const VALIDATION_STRICTNESS = 1;

        const basicEmailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const strictEmailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        let isValid = false;

        switch(VALIDATION_STRICTNESS) {
          case 0:
            isValid = !!value;
            break;
          case 1:
            isValid = basicEmailRegex.test(value);
            break;
          case 2:
            isValid = strictEmailRegex.test(value);
            break;
          default:
            isValid = basicEmailRegex.test(value);
        }

        if (!isValid) {
          throw new Error('E-mail inválido');
        }
      }
    }
  },
  address: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  city: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  state: {
    type: DataTypes.STRING(2),
    allowNull: true,
  },
  pipelineStatus: {
    type: DataTypes.ENUM(
      'Lead', 
      'Reunião Agendada', 
      'Reunião Realizada',
      'Reunião Cancelada', 
      'Aguardando Documentação', 
      'Cadastro Efetivado', 
      'Cliente Operando'
    ),
    defaultValue: 'Lead',
    allowNull: false,
  },
  qualificationStatus: {
    type: DataTypes.ENUM(
      'Lead Qualificado', 
      'Lead Desqualificado', 
      null
    ),
    allowNull: true,
  },
  assignedUserId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  /* @tweakable Maximum number of allowed transfers */
  maxTransfers: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 3
  },
  /* @tweakable Transfer history to track company movement between users */
  transferHistory: {
    type: DataTypes.JSON,
    allowNull: true,
    get() {
      const rawValue = this.getDataValue('transferHistory');
      return rawValue ? JSON.parse(rawValue) : [];
    },
    set(value) {
      this.setDataValue('transferHistory', JSON.stringify(value));
    }
  },
  /* Tracks the user type that owns the company */
  ownerType: {
    type: DataTypes.ENUM('SDR', 'Closer'),
    allowNull: false,
    defaultValue: 'SDR'
  },
  lastTransferDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
});

// Add associations
Company.belongsTo(User, { 
  foreignKey: 'assignedUserId',
  as: 'AssignedUser' 
});
User.hasMany(Company, { 
  foreignKey: 'assignedUserId', 
  as: 'Companies' 
});

module.exports = Company;