const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Company = require('./Company');
const User = require('./User');

const PipelineHistory = sequelize.define('PipelineHistory', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  companyId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Company,
      key: 'id',
    },
  },
  previousStatus: {
    type: DataTypes.ENUM(
      'Lead', 
      'Reunião Agendada', 
      'Reunião Realizada',
      'Reunião Cancelada', 
      'Aguardando Documentação', 
      'Cadastro Efetivado', 
      'Cliente Operando'
    ),
    allowNull: true,
  },
  newStatus: {
    type: DataTypes.ENUM(
      'Lead', 
      'Reunião Agendada', 
      'Reunião Realizada',
      'Reunião Cancelada', 
      'Aguardando Documentação',  
      'Cadastro Efetivado', 
      'Cliente Operando'
    ),
    allowNull: false,
    defaultValue: 'Lead',
  },
  previousOwnerType: {
    type: DataTypes.ENUM('SDR', 'Closer', null),
    allowNull: true,
  },
  newOwnerType: {
    type: DataTypes.ENUM('SDR', 'Closer'),
    allowNull: true,
  },
  qualificationStatus: {
    type: DataTypes.ENUM(
      'Lead Qualificado', 
      'Lead Desqualificado'
    ),
    allowNull: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'Users',
      key: 'id',
    },
  },
  previousAssignedUserId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'Users',
      key: 'id',
    },
  },
  newAssignedUserId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'Users',
      key: 'id',
    },
  },
  changeDate: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  observations: {
    type: DataTypes.TEXT,
    allowNull: true,
  }
}, {
  tableName: 'PipelineHistories',
  timestamps: true, 
  paranoid: false  
});

PipelineHistory.belongsTo(Company, { 
  foreignKey: 'companyId',
  onDelete: 'CASCADE', 
  onUpdate: 'CASCADE'
});
Company.hasMany(PipelineHistory, { 
  foreignKey: 'companyId',
  as: 'PipelineHistory' 
});

// Add associations to track users
PipelineHistory.belongsTo(User, {
  foreignKey: 'userId',
  as: 'User'
});

PipelineHistory.belongsTo(User, {
  foreignKey: 'previousAssignedUserId',
  as: 'PreviousAssignedUser'
});

PipelineHistory.belongsTo(User, {
  foreignKey: 'newAssignedUserId',
  as: 'NewAssignedUser'
});

module.exports = PipelineHistory;