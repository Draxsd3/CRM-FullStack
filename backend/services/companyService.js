const Company = require('../models/Company');
const User = require('../models/User');
const KYCReport = require('../models/KYCReport');
const PDFDocument = require('pdfkit');
const { Op } = require('sequelize');
const sequelize = require('../config/database');

// Company service configuration
/* @tweakable Company listing configuration */
const COMPANY_CONFIG = {
  /** Maximum number of companies to return */
  MAX_COMPANIES_LIMIT: 1000,
  
  /** Default sorting for company lists */
  DEFAULT_SORT: [['createdAt', 'DESC']],
  
  /** Enable detailed logging for company operations */
  VERBOSE_LOGGING: true // Always enable for debugging
};

// Get all companies in the system 
exports.getAllCompaniesInSystem = async (page = 1, pageSize = 50) => {
  const limit = Math.min(pageSize, COMPANY_CONFIG.MAX_COMPANIES_LIMIT);
  const offset = (page - 1) * limit;

  const companies = await Company.findAll({
    include: [
      {
        model: User,
        as: 'AssignedUser',
        attributes: ['id', 'name', 'email', 'role']
      }
    ],
    order: COMPANY_CONFIG.DEFAULT_SORT,
    limit,
    offset
  });

  if (COMPANY_CONFIG.VERBOSE_LOGGING) {
    console.log('Retrieved companies:', {
      count: companies.length,
      page,
      pageSize
    });
  }

  return companies;
};

// Get all companies for a specific user - This is now an alias to getAllCompaniesInSystem
exports.getAllCompanies = async (userId, page = 1, pageSize = 50) => {
  return this.getAllCompaniesInSystem(page, pageSize);
};

// Create company with enhanced error handling and validation
exports.createCompany = async (companyData, userId) => {
  /** @tweakable Company creation validation rules */
  const ValidationRules = {
    requiredFields: ['name', 'cnpj', 'contactName', 'contactPhone', 'email'],
    cnpjLength: 14,
    validateEmail: true
  };

  // Validate required fields
  for (const field of ValidationRules.requiredFields) {
    if (!companyData[field]) {
      throw new Error(`${field} é um campo obrigatório`);
    }
  }

  // Clean and validate CNPJ
  const cleanedCnpj = companyData.cnpj.replace(/\D/g, '');
  
  if (cleanedCnpj.length !== ValidationRules.cnpjLength) {
    throw new Error('CNPJ deve ter exatamente 14 dígitos');
  }

  // Optional email validation
  if (ValidationRules.validateEmail) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(companyData.email)) {
      throw new Error('E-mail inválido');
    }
  }

  const transaction = await sequelize.transaction();

  try {
    // *** CRITICAL FIX: Triple-ensure Lead status is set ***
    console.log("Creating company with following data:", {
      ...companyData,
      pipelineStatus: 'Lead', // Force Lead status
      cnpj: cleanedCnpj,
      assignedUserId: userId
    });
    
    const company = await Company.create({
      ...companyData,
      cnpj: cleanedCnpj,
      pipelineStatus: 'Lead', // Force Lead status 
      assignedUserId: userId
    }, { transaction });

    console.log("Company created with ID:", company.id, "and status:", company.pipelineStatus);
    
    await transaction.commit();
    return company;
  } catch (error) {
    await transaction.rollback();
    
    // Log detailed error information
    console.error('Company Creation Error:', {
      message: error.message,
      stack: error.stack,
      validationErrors: error.errors
    });

    throw error;
  }
};

// Get company by ID
exports.getCompanyById = async (id, userId) => {
  return await Company.findOne({
    where: { 
      id
      // Removed assignedUserId filter to allow all users to view any company
    },
    include: [{ 
      model: User, 
      as: 'AssignedUser', 
      attributes: ['id', 'name'] 
    }]
  });
};

// Update company
exports.updateCompany = async (id, companyData) => {
  const company = await Company.findByPk(id);
  
  if (!company) {
    return null;
  }
  
  return await company.update(companyData);
};

// Delete company
exports.deleteCompany = async (id) => {
  const company = await Company.findByPk(id);
  
  if (!company) {
    return false;
  }
  
  await company.destroy();
  return true;
};

// Search companies
exports.searchCompanies = async (searchTerm, userId) => {
  return await Company.findAll({
    where: {
      assignedUserId: userId,
      [Op.or]: [
        { name: { [Op.like]: `%${searchTerm}%` } },
        { cnpj: { [Op.like]: `%${searchTerm}%` } },
        { contactName: { [Op.like]: `%${searchTerm}%` } },
        { email: { [Op.like]: `%${searchTerm}%` } }
      ]
    }
  });
};

// Transfer company to user
exports.transferCompanyToUser = async (companyId, currentUserId, newUserId) => {
  const transaction = await sequelize.transaction();
  
  try {
    const company = await Company.findByPk(companyId, { transaction });
    
    if (!company) {
      throw new Error('Empresa não encontrada');
    }
    
    /* @tweakable Maximum number of allowed transfers */
    const MAX_TRANSFERS = 3;
    
    // Get current transfer history
    const transferHistory = company.transferHistory || [];
    
    if (transferHistory.length >= MAX_TRANSFERS) {
      throw new Error('Número máximo de transferências atingido');
    }
    
    // Validate users exist
    const currentUser = await User.findByPk(currentUserId);
    const newUser = await User.findByPk(newUserId);
    
    if (!currentUser || !newUser) {
      throw new Error('Usuários inválidos');
    }
    
    // Update transfer history
    transferHistory.push({
      fromUserId: currentUserId,
      toUserId: newUserId,
      transferDate: new Date()
    });
    
    // Update company
    await company.update({
      assignedUserId: newUserId,
      transferHistory: transferHistory,
      lastTransferDate: new Date()
    }, { transaction });
    
    await transaction.commit();
    
    return company;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

// Get KYC reports for a company
exports.getKYCReports = async (companyId) => {
  try {
    console.log('Fetching KYC reports for company:', companyId);
    
    const reports = await KYCReport.findAll({
      where: { companyId },
      include: [
        {
          model: User,
          attributes: ['id', 'name']
        }
      ],
      order: [['createdAt', 'DESC']]
    });
    
    console.log(`Found ${reports.length} KYC reports for company ${companyId}`);
    
    return reports;
  } catch (error) {
    console.error('Error in getKYCReports service:', error);
    throw error;
  }
};

// Create KYC report
exports.createKYCReport = async (reportData) => {
  try {
    const report = await KYCReport.create(reportData);
    
    // Return with user information
    return await KYCReport.findByPk(report.id, {
      include: [
        {
          model: User,
          attributes: ['id', 'name']
        }
      ]
    });
  } catch (error) {
    throw new Error('Erro ao criar relatório KYC: ' + error.message);
  }
};

// Generate KYC report PDF
exports.generateKYCReportPDF = async (reportId) => {
  try {
    const report = await KYCReport.findByPk(reportId, {
      include: [
        {
          model: Company,
          attributes: ['name', 'cnpj']
        },
        {
          model: User,
          attributes: ['name']
        }
      ]
    });
    
    if (!report) {
      throw new Error('Relatório KYC não encontrado');
    }
    
    // Create PDF
    const doc = new PDFDocument();
    const buffers = [];
    
    doc.on('data', buffers.push.bind(buffers));
    
    // Add content to PDF
    doc.fontSize(16).text('Relatório KYC', { align: 'center' });
    doc.moveDown();
    
    doc.fontSize(12).text(`Empresa: ${report.Company.name}`);
    doc.text(`CNPJ: ${report.Company.cnpj}`);
    doc.text(`Tipo: ${report.reportType}`);
    doc.text(`Criado por: ${report.userName}`);
    doc.text(`Data: ${new Date(report.createdAt).toLocaleDateString('pt-BR')}`);
    doc.moveDown();
    
    doc.fontSize(14).text('Conteúdo:', { underline: true });
    doc.moveDown();
    doc.fontSize(12).text(report.content, { align: 'justify' });
    
    doc.end();
    
    return new Promise((resolve) => {
      doc.on('end', () => {
        resolve(Buffer.concat(buffers));
      });
    });
  } catch (error) {
    throw new Error('Erro ao gerar PDF: ' + error.message);
  }
};