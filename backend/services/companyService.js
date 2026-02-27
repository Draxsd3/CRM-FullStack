const Company = require('../models/Company');
const User = require('../models/User');
const KYCReport = require('../models/KYCReport');
const PDFDocument = require('pdfkit');
const mongoose = require('mongoose');

const COMPANY_CONFIG = {
  MAX_COMPANIES_LIMIT: 1000,
  DEFAULT_SORT: { createdAt: -1 },
  VERBOSE_LOGGING: true,
};

const onlyDigits = (v = '') => String(v).replace(/\D/g, '');

const normalizeCnpjLookup = (payload = {}, provider = 'unknown') => {
  if (provider === 'brasilapi') {
    return {
      provider,
      name: payload.razao_social || payload.nome_fantasia || '',
      cnpj: onlyDigits(payload.cnpj),
      contactName: payload.nome_fantasia || payload.razao_social || '',
      contactPhone: onlyDigits(payload.ddd_telefone_1 || payload.ddd_telefone_2 || ''),
      email: payload.email || '',
      address: [payload.logradouro, payload.numero, payload.bairro].filter(Boolean).join(', '),
      city: payload.municipio || '',
      state: payload.uf || '',
    };
  }

  return {
    provider,
    name: payload.nome || payload.fantasia || '',
    cnpj: onlyDigits(payload.cnpj),
    contactName: payload.fantasia || payload.nome || '',
    contactPhone: onlyDigits(payload.telefone || ''),
    email: payload.email || '',
    address: [payload.logradouro, payload.numero, payload.bairro].filter(Boolean).join(', '),
    city: payload.municipio || '',
    state: payload.uf || '',
  };
};

const isUsefulLookup = (data) => {
  return !!(data && (data.name || data.contactName || data.address || data.city || data.state));
};

// Get all companies in the system
exports.getAllCompaniesInSystem = async (page = 1, pageSize = 50) => {
  const limit = Math.min(pageSize, COMPANY_CONFIG.MAX_COMPANIES_LIMIT);
  const skip = (page - 1) * limit;

  const companies = await Company.find()
    .populate('assignedUserId', 'id name email role')
    .sort(COMPANY_CONFIG.DEFAULT_SORT)
    .skip(skip)
    .limit(limit)
    .lean();

  // Map assignedUserId populate to AssignedUser for frontend compatibility
  return companies.map((c) => ({
    ...c,
    id: c._id,
    AssignedUser: c.assignedUserId
      ? { id: c.assignedUserId._id, name: c.assignedUserId.name, email: c.assignedUserId.email, role: c.assignedUserId.role }
      : null,
  }));
};

// Get all companies for a specific user (alias)
exports.getAllCompanies = async (userId, page = 1, pageSize = 50) => {
  return this.getAllCompaniesInSystem(page, pageSize);
};

// Lookup company data by CNPJ (Receita/BrasilAPI)
exports.lookupCompanyByCnpj = async (cnpj) => {
  const cleaned = onlyDigits(cnpj);
  if (cleaned.length !== 14) {
    throw new Error('CNPJ deve ter 14 digitos');
  }

  const providers = [
    async () => {
      const res = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${cleaned}`, {
        headers: { Accept: 'application/json' },
      });
      if (!res.ok) throw new Error(`BrasilAPI HTTP ${res.status}`);
      const payload = await res.json();
      return normalizeCnpjLookup(payload, 'brasilapi');
    },
    async () => {
      const res = await fetch(`https://www.receitaws.com.br/v1/cnpj/${cleaned}`, {
        headers: { Accept: 'application/json' },
      });
      if (!res.ok) throw new Error(`ReceitaWS HTTP ${res.status}`);
      const payload = await res.json();
      if (payload.status && String(payload.status).toUpperCase() === 'ERROR') {
        throw new Error(payload.message || 'ReceitaWS indisponivel');
      }
      return normalizeCnpjLookup(payload, 'receitaws');
    },
  ];

  const errors = [];
  for (const provider of providers) {
    try {
      const data = await provider();
      if (isUsefulLookup(data)) return data;
    } catch (error) {
      errors.push(error.message);
    }
  }

  throw new Error(`Nao foi possivel consultar CNPJ. Tentativas: ${errors.join(' | ')}`);
};

// Create company
exports.createCompany = async (companyData, userId) => {
  const requiredFields = ['name', 'cnpj', 'contactName', 'contactPhone', 'email'];

  for (const field of requiredFields) {
    if (!companyData[field]) {
      throw new Error(`${field} é um campo obrigatório`);
    }
  }

  const cleanedCnpj = companyData.cnpj.replace(/\D/g, '');

  if (cleanedCnpj.length !== 14) {
    throw new Error('CNPJ deve ter exatamente 14 dígitos');
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(companyData.email)) {
    throw new Error('E-mail inválido');
  }

  // Check for duplicate CNPJ
  const existing = await Company.findOne({ cnpj: cleanedCnpj });
  if (existing) {
    throw new Error('CNPJ já cadastrado');
  }

  try {
    const company = await Company.create({
      ...companyData,
      cnpj: cleanedCnpj,
      pipelineStatus: 'Lead',
      assignedUserId: userId,
    });

    return company;
  } catch (error) {
    console.error('Company Creation Error:', {
      message: error.message,
      stack: error.stack,
    });

    throw error;
  }
};

// Get company by ID
exports.getCompanyById = async (id, userId) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return null;
  }

  const company = await Company.findById(id)
    .populate('assignedUserId', 'id name')
    .lean();

  if (!company) return null;

  return {
    ...company,
    id: company._id,
    AssignedUser: company.assignedUserId
      ? { id: company.assignedUserId._id, name: company.assignedUserId.name }
      : null,
  };
};

// Update company
exports.updateCompany = async (id, companyData) => {
  if (!mongoose.Types.ObjectId.isValid(id)) return null;

  const company = await Company.findByIdAndUpdate(id, companyData, {
    new: true,
    runValidators: true,
  });

  return company;
};

// Delete company
exports.deleteCompany = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) return false;

  const company = await Company.findByIdAndDelete(id);
  return !!company;
};

// Search companies
exports.searchCompanies = async (searchTerm, userId) => {
  const regex = new RegExp(searchTerm, 'i');

  return await Company.find({
    assignedUserId: userId,
    $or: [
      { name: regex },
      { cnpj: regex },
      { contactName: regex },
      { email: regex },
    ],
  }).lean();
};

// Transfer company to user
exports.transferCompanyToUser = async (companyId, currentUserId, newUserId) => {
  try {
    const company = await Company.findById(companyId);

    if (!company) throw new Error('Empresa não encontrada');

    const MAX_TRANSFERS = 3;
    const transferHistory = company.transferHistory || [];

    if (transferHistory.length >= MAX_TRANSFERS) {
      throw new Error('Número máximo de transferências atingido');
    }

    const currentUser = await User.findById(currentUserId);
    const newUser = await User.findById(newUserId);

    if (!currentUser || !newUser) throw new Error('Usuários inválidos');

    transferHistory.push({
      fromUserId: currentUserId,
      toUserId: newUserId,
      transferDate: new Date(),
    });

    company.assignedUserId = newUserId;
    company.transferHistory = transferHistory;
    company.lastTransferDate = new Date();

    await company.save();

    return company;
  } catch (error) {
    throw error;
  }
};

// Get KYC reports
exports.getKYCReports = async (companyId) => {
  return await KYCReport.find({ companyId })
    .populate('userId', 'id name')
    .sort({ createdAt: -1 })
    .lean();
};

// Create KYC report
exports.createKYCReport = async (reportData) => {
  try {
    const report = await KYCReport.create(reportData);
    return await KYCReport.findById(report._id)
      .populate('userId', 'id name')
      .lean();
  } catch (error) {
    throw new Error('Erro ao criar relatório KYC: ' + error.message);
  }
};

// Generate KYC report PDF
exports.generateKYCReportPDF = async (reportId) => {
  try {
    const report = await KYCReport.findById(reportId)
      .populate('companyId', 'name cnpj')
      .populate('userId', 'name')
      .lean();

    if (!report) throw new Error('Relatório KYC não encontrado');

    const doc = new PDFDocument();
    const buffers = [];

    doc.on('data', buffers.push.bind(buffers));

    doc.fontSize(16).text('Relatório KYC', { align: 'center' });
    doc.moveDown();

    doc.fontSize(12).text(`Empresa: ${report.companyId.name}`);
    doc.text(`CNPJ: ${report.companyId.cnpj}`);
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
