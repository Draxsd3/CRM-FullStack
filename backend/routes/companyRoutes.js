const express = require('express');
const { body, validationResult } = require('express-validator');
const companyController = require('../controllers/companyController');
const auth = require('../middlewares/auth');
const roleAuth = require('../middlewares/roleAuth');

const router = express.Router();

/** @tweakable Route configuration */
const ROUTE_CONFIG = {
  /** Enable detailed logging for routes */
  VERBOSE_LOGGING: process.env.NODE_ENV === 'development',
  
  /** Maximum number of companies to return in a single request */
  MAX_COMPANIES_LIMIT: 1000,
  
  /** Default sorting for company lists */
  DEFAULT_SORT: 'createdAt:DESC'
};

// Validation middleware for company creation/update
const validateCompany = [
  body('name').notEmpty().withMessage('Nome da empresa é obrigatório'),
  body('cnpj').notEmpty().withMessage('CNPJ é obrigatório'),
  body('contactName').notEmpty().withMessage('Nome do contato é obrigatório'),
  body('contactPhone').notEmpty().withMessage('Telefone é obrigatório'),
  body('email').isEmail().withMessage('E-mail inválido')
];

// Logging middleware for route debugging
const logRouteAccess = (req, res, next) => {
  if (ROUTE_CONFIG.VERBOSE_LOGGING) {
    console.log(`[Company Route] ${req.method} ${req.path} accessed by user ${req.user?.id}`);
  }
  next();
};

// Routes with proper controller functions and middleware
router.get('/', 
  auth, 
  logRouteAccess, 
  companyController.getAllCompanies
);

router.get('/search', 
  auth, 
  logRouteAccess, 
  companyController.searchCompanies
);

router.get('/all', 
  auth, 
  logRouteAccess, 
  companyController.getAllCompaniesInSystem
);

router.post('/', 
  auth, 
  logRouteAccess, 
  validateCompany, 
  companyController.createCompany
);

router.put('/:id', 
  auth, 
  logRouteAccess, 
  validateCompany, 
  companyController.updateCompany
);

router.delete('/:id', 
  auth, 
  logRouteAccess, 
  companyController.deleteCompany
);

router.get('/:id', 
  auth, 
  logRouteAccess, 
  companyController.getCompanyById
);

// KYC Reports routes
router.get('/:id/kyc-reports', 
  auth, 
  logRouteAccess, 
  companyController.getCompanyKYCReports
);

router.post('/kyc-reports', 
  auth, 
  logRouteAccess,
  [
    body('content').notEmpty().withMessage('Conteúdo do relatório é obrigatório'),
    body('companyId').notEmpty().withMessage('ID da empresa é obrigatório'),
    body('reportType').notEmpty().withMessage('Tipo de relatório é obrigatório')
  ],
  companyController.createKYCReport
);

router.get('/kyc-reports/:id/pdf', 
  auth, 
  logRouteAccess, 
  companyController.generateKYCReportPDF
);

// Conditional debug route
if (process.env.NODE_ENV === 'development') {
  router.get('/debug/info', 
    auth, 
    roleAuth(['ADM']), 
    (req, res) => {
      res.json({
        success: true,
        debugLevel: ROUTE_CONFIG.VERBOSE_LOGGING ? 'High' : 'Low',
        timestamp: new Date().toISOString(),
        maxCompaniesLimit: ROUTE_CONFIG.MAX_COMPANIES_LIMIT
      });
    }
  );
}

module.exports = router;