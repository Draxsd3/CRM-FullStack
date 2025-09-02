const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Company = require('./Company');

const Meeting = sequelize.define('Meeting', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  startTime: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  endTime: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  location: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  meetingType: {
    type: DataTypes.ENUM('Presencial', 'Virtual', 'Telefônica'),
    allowNull: false,
    defaultValue: 'Presencial',
  },
  status: {
    type: DataTypes.ENUM('Agendada', 'Realizada', 'Cancelada', 'Reagendada'),
    allowNull: false,
    defaultValue: 'Agendada',
  },
  companyId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Company,
      key: 'id',
    },
  },
  enableNotification: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
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

Meeting.belongsTo(Company, { foreignKey: 'companyId' });
Company.hasMany(Meeting, { foreignKey: 'companyId' });

module.exports = Meeting;