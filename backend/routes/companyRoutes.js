const express = require('express');
const { body } = require('express-validator');
const companyController = require('../controllers/companyController');
const auth = require('../middlewares/auth');
const roleAuth = require('../middlewares/roleAuth');

const router = express.Router();

const validateCompany = [
  body('name').notEmpty().withMessage('Nome da empresa é obrigatório'),
  body('cnpj').notEmpty().withMessage('CNPJ é obrigatório'),
  body('contactName').notEmpty().withMessage('Nome do contato é obrigatório'),
  body('contactPhone').notEmpty().withMessage('Telefone é obrigatório'),
  body('email').isEmail().withMessage('E-mail inválido'),
];

router.get('/', auth, companyController.getAllCompanies);
router.get('/search', auth, companyController.searchCompanies);
router.get('/all', auth, companyController.getAllCompaniesInSystem);
router.get('/cnpj/:cnpj', auth, companyController.lookupCompanyByCnpj);
router.post('/', auth, validateCompany, companyController.createCompany);
router.put('/:id', auth, validateCompany, companyController.updateCompany);
router.delete('/:id', auth, companyController.deleteCompany);
router.get('/:id', auth, companyController.getCompanyById);

// KYC Reports
router.get('/:id/kyc-reports', auth, companyController.getCompanyKYCReports);
router.post(
  '/kyc-reports',
  auth,
  [
    body('content').notEmpty().withMessage('Conteúdo do relatório é obrigatório'),
    body('companyId').notEmpty().withMessage('ID da empresa é obrigatório'),
    body('reportType').notEmpty().withMessage('Tipo de relatório é obrigatório'),
  ],
  companyController.createKYCReport
);
router.get('/kyc-reports/:id/pdf', auth, companyController.generateKYCReportPDF);

module.exports = router;
