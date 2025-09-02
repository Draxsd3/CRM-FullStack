const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Company = require('./Company');
const User = require('./User');

const KYCReport = sequelize.define('KYCReport', {
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
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id',
    },
  },
  userName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  reportType: {
    type: DataTypes.STRING,
    allowNull: false,
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

// Define associations
KYCReport.belongsTo(Company, { foreignKey: 'companyId' });
Company.hasMany(KYCReport, { foreignKey: 'companyId' });

KYCReport.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(KYCReport, { foreignKey: 'userId' });

module.exports = KYCReport;