const companyService = require('../services/companyService');
const { validationResult } = require('express-validator');
const mongoose = require('mongoose');

const CONTROLLER_CONFIG = {
  MAX_VALIDATION_ERRORS: 5,
  DEFAULT_PAGE_SIZE: 50,
  DEFAULT_PAGE: 1,
  VERBOSE_ERROR_MESSAGES: true,
};

exports.getAllCompanies = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || CONTROLLER_CONFIG.DEFAULT_PAGE;
    const pageSize = parseInt(req.query.pageSize) || CONTROLLER_CONFIG.DEFAULT_PAGE_SIZE;

    const companies = await companyService.getAllCompanies(req.user.id, page, pageSize);

    res.status(200).json({
      success: true,
      data: companies,
      pagination: { page, pageSize, total: companies.length },
    });
  } catch (error) {
    console.error('Error in getAllCompanies:', error);
    next(error);
  }
};

exports.searchCompanies = async (req, res, next) => {
  try {
    const { term } = req.query;
    if (!term) {
      return res.status(400).json({ success: false, error: 'Termo de busca é obrigatório' });
    }
    const companies = await companyService.searchCompanies(term, req.user.id);
    res.status(200).json({ success: true, data: companies });
  } catch (error) {
    next(error);
  }
};

exports.lookupCompanyByCnpj = async (req, res, next) => {
  try {
    const { cnpj } = req.params;
    const data = await companyService.lookupCompanyByCnpj(cnpj);
    return res.status(200).json({ success: true, data });
  } catch (error) {
    return res.status(400).json({
      success: false,
      error: error.message || 'Nao foi possivel consultar o CNPJ',
    });
  }
};

exports.getCompanyById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, error: 'ID de empresa inválido' });
    }

    const company = await companyService.getCompanyById(id, req.user.id);

    if (!company) {
      return res.status(404).json({ success: false, error: 'Empresa não encontrada' });
    }

    res.status(200).json({ success: true, data: company });
  } catch (error) {
    console.error('Error in getCompanyById:', error);
    next(error);
  }
};

exports.createCompany = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array().slice(0, 5) });
    }

    const companyData = { ...req.body, pipelineStatus: 'Lead', ownerType: 'SDR' };
    const company = await companyService.createCompany(companyData, req.user.id);

    res.status(201).json({
      success: true,
      data: company,
      message: 'Empresa cadastrada com sucesso e adicionada como Lead',
    });
  } catch (error) {
    console.error('Company Creation Error:', error);
    const statusCode = error.name === 'ValidationError' ? 400 : 500;
    res.status(statusCode).json({
      success: false,
      error: CONTROLLER_CONFIG.VERBOSE_ERROR_MESSAGES ? error.message : 'Erro ao cadastrar empresa',
    });
  }
};

exports.updateCompany = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array().slice(0, 5) });
    }

    const { id } = req.params;
    const company = await companyService.updateCompany(id, req.body);

    if (!company) {
      return res.status(404).json({ success: false, error: 'Empresa não encontrada' });
    }

    res.status(200).json({ success: true, data: company });
  } catch (error) {
    next(error);
  }
};

exports.deleteCompany = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await companyService.deleteCompany(id);

    if (!result) {
      return res.status(404).json({ success: false, error: 'Empresa não encontrada' });
    }

    res.status(200).json({ success: true, message: 'Empresa excluída com sucesso' });
  } catch (error) {
    next(error);
  }
};

exports.transferCompany = async (req, res, next) => {
  try {
    const { companyId, newUserId } = req.body;
    const currentUserId = req.user.id;
    const company = await companyService.transferCompanyToUser(companyId, currentUserId, newUserId);
    res.status(200).json({ success: true, data: company });
  } catch (error) {
    next(error);
  }
};

exports.getAllCompaniesInSystem = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || CONTROLLER_CONFIG.DEFAULT_PAGE;
    const pageSize = parseInt(req.query.pageSize) || CONTROLLER_CONFIG.DEFAULT_PAGE_SIZE;

    const companies = await companyService.getAllCompaniesInSystem(page, pageSize);

    res.status(200).json({
      success: true,
      data: companies,
      pagination: { page, pageSize, total: companies.length },
    });
  } catch (error) {
    console.error('Error in getAllCompaniesInSystem:', error);
    next(error);
  }
};

exports.getCompanyKYCReports = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, error: 'ID de empresa inválido' });
    }

    const reports = await companyService.getKYCReports(id);
    res.status(200).json({ success: true, data: reports });
  } catch (error) {
    console.error('Error fetching KYC reports:', error);
    next(error);
  }
};

exports.createKYCReport = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const reportData = { ...req.body, userId: req.user.id, userName: req.user.name };
    const report = await companyService.createKYCReport(reportData);
    res.status(201).json({ success: true, data: report });
  } catch (error) {
    next(error);
  }
};

exports.generateKYCReportPDF = async (req, res, next) => {
  try {
    const { id } = req.params;
    const pdfBuffer = await companyService.generateKYCReportPDF(id);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=kyc-report-${id}.pdf`);
    res.send(pdfBuffer);
  } catch (error) {
    next(error);
  }
};
