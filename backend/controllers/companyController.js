const companyService = require('../services/companyService');
const { validationResult } = require('express-validator');

/** @tweakable Controller configuration */
const CONTROLLER_CONFIG = {
  /** Maximum number of validation errors to return */
  MAX_VALIDATION_ERRORS: 5,
  
  /** Enable detailed error logging */
  DETAILED_ERROR_LOGGING: true, // Changed to always true for debugging
  
  /** Default pagination settings */
  DEFAULT_PAGE_SIZE: 50,
  DEFAULT_PAGE: 1,

  /** @tweakable Error message verbosity */
  VERBOSE_ERROR_MESSAGES: true
};

// Get all companies
exports.getAllCompanies = async (req, res, next) => {
  try {
    /* @tweakable Pagination parameters */
    const page = parseInt(req.query.page) || CONTROLLER_CONFIG.DEFAULT_PAGE;
    const pageSize = parseInt(req.query.pageSize) || CONTROLLER_CONFIG.DEFAULT_PAGE_SIZE;
    
    const companies = await companyService.getAllCompanies(req.user.id, page, pageSize);
    
    // Debug log companies
    console.log(`Retrieved ${companies.length} companies for user ${req.user.id}`);
    
    res.status(200).json({ 
      success: true, 
      data: companies,
      pagination: {
        page,
        pageSize,
        total: companies.length
      }
    });
  } catch (error) {
    if (CONTROLLER_CONFIG.DETAILED_ERROR_LOGGING) {
      console.error('Error in getAllCompanies:', error);
    }
    next(error);
  }
};

// Search companies
exports.searchCompanies = async (req, res, next) => {
  try {
    const { term } = req.query;
    
    if (!term) {
      return res.status(400).json({ 
        success: false, 
        error: 'Termo de busca é obrigatório' 
      });
    }
    
    const companies = await companyService.searchCompanies(term, req.user.id);
    
    res.status(200).json({ 
      success: true, 
      data: companies 
    });
  } catch (error) {
    next(error);
  }
};

// Get company by ID
exports.getCompanyById = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // Validate ID is a number
    const companyId = parseInt(id, 10);
    if (isNaN(companyId) || companyId <= 0) {
      return res.status(400).json({ 
        success: false, 
        error: 'ID de empresa inválido' 
      });
    }
    
    console.log(`Fetching company with ID: ${companyId}`);
    
    const company = await companyService.getCompanyById(companyId, req.user.id);
    
    if (!company) {
      return res.status(404).json({ 
        success: false, 
        error: 'Empresa não encontrada' 
      });
    }
    
    res.status(200).json({ 
      success: true, 
      data: company 
    });
  } catch (error) {
    console.error('Error in getCompanyById:', error);
    next(error);
  }
};

// Create company with enhanced error handling and validation
exports.createCompany = async (req, res, next) => {
  /** @tweakable Company creation configuration */
  const COMPANY_CREATION_CONFIG = {
    /** Default pipeline status for new companies */
    DEFAULT_STATUS: 'Lead',
    /** Default owner type for new companies */
    DEFAULT_OWNER_TYPE: 'SDR',
    /** Maximum validation errors to return */
    MAX_VALIDATION_ERRORS: 5
  };
  
  try {
    // Validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        errors: errors.array().slice(0, COMPANY_CREATION_CONFIG.MAX_VALIDATION_ERRORS)
      });
    }
    
    console.log('🔍 Creating company with request data:', req.body);
    
    // *** CRITICAL FIX: Force the status to be Lead for all new companies ***
    const companyData = {
      ...req.body,
      pipelineStatus: 'Lead',
      ownerType: COMPANY_CREATION_CONFIG.DEFAULT_OWNER_TYPE
    };
    
    console.log('📋 Processed company data with default status:', companyData);
    
    const company = await companyService.createCompany(companyData, req.user.id);
    
    console.log('✅ Company created successfully:', company);
    
    res.status(201).json({ 
      success: true, 
      data: company,
      message: 'Empresa cadastrada com sucesso e adicionada como Lead' 
    });
  } catch (error) {
    console.error('Company Creation Error:', error);
    
    // Customize error response based on error type
    const statusCode = error.name === 'SequelizeValidationError' ? 400 : 500;
    
    res.status(statusCode).json({ 
      success: false, 
      error: CONTROLLER_CONFIG.VERBOSE_ERROR_MESSAGES 
        ? error.message 
        : 'Erro ao cadastrar empresa' 
    });
  }
};

// Update company
exports.updateCompany = async (req, res, next) => {
  try {
    // Validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        errors: errors.array().slice(0, CONTROLLER_CONFIG.MAX_VALIDATION_ERRORS) 
      });
    }
    
    const { id } = req.params;
    const company = await companyService.updateCompany(id, req.body);
    
    if (!company) {
      return res.status(404).json({ 
        success: false, 
        error: 'Empresa não encontrada' 
      });
    }
    
    res.status(200).json({ 
      success: true, 
      data: company 
    });
  } catch (error) {
    next(error);
  }
};

// Delete company
exports.deleteCompany = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await companyService.deleteCompany(id);
    
    if (!result) {
      return res.status(404).json({ 
        success: false, 
        error: 'Empresa não encontrada' 
      });
    }
    
    res.status(200).json({ 
      success: true, 
      message: 'Empresa excluída com sucesso' 
    });
  } catch (error) {
    next(error);
  }
};

// Transfer company
exports.transferCompany = async (req, res, next) => {
  try {
    const { companyId, newUserId } = req.body;
    const currentUserId = req.user.id;
    
    const company = await companyService.transferCompanyToUser(
      companyId, 
      currentUserId, 
      newUserId
    );
    
    res.status(200).json({ 
      success: true, 
      data: company 
    });
  } catch (error) {
    next(error);
  }
};

// Get all companies in the system (for admins)
exports.getAllCompaniesInSystem = async (req, res, next) => {
  try {
    /* @tweakable Pagination parameters */
    const page = parseInt(req.query.page) || CONTROLLER_CONFIG.DEFAULT_PAGE;
    const pageSize = parseInt(req.query.pageSize) || CONTROLLER_CONFIG.DEFAULT_PAGE_SIZE;
    
    const companies = await companyService.getAllCompaniesInSystem(page, pageSize);
    
    // Debug log companies count
    console.log(`Retrieved ${companies.length} companies in system`);
    
    res.status(200).json({ 
      success: true, 
      data: companies,
      pagination: {
        page,
        pageSize,
        total: companies.length
      }
    });
  } catch (error) {
    if (CONTROLLER_CONFIG.DETAILED_ERROR_LOGGING) {
      console.error('Error in getAllCompaniesInSystem:', error);
    }
    next(error);
  }
};

// Get KYC reports for a company
exports.getCompanyKYCReports = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // Validate ID is a number
    const companyId = parseInt(id, 10);
    if (isNaN(companyId) || companyId <= 0) {
      return res.status(400).json({ 
        success: false, 
        error: 'ID de empresa inválido' 
      });
    }
    
    console.log(`Fetching KYC reports for company ID: ${companyId}`);
    
    const reports = await companyService.getKYCReports(companyId);
    
    res.status(200).json({ 
      success: true, 
      data: reports 
    });
  } catch (error) {
    console.error('Error fetching KYC reports:', error);
    next(error);
  }
};

// Create KYC report
exports.createKYCReport = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        errors: errors.array() 
      });
    }
    
    const reportData = {
      ...req.body,
      userId: req.user.id,
      userName: req.user.name
    };
    
    const report = await companyService.createKYCReport(reportData);
    
    res.status(201).json({ 
      success: true, 
      data: report 
    });
  } catch (error) {
    next(error);
  }
};

// Generate KYC report PDF
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