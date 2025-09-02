const express = require('express');
const router = express.Router();
const pipelineController = require('../controllers/pipelineController');
const auth = require('../middlewares/auth');

// Routes
router.get('/', auth, pipelineController.getPipelineCompanies);
router.post('/update-status', auth, pipelineController.updateCompanyStatus);
router.post('/transfer-to-closer', auth, pipelineController.transferToCloser);
router.get('/history/:companyId', auth, pipelineController.getCompanyPipelineHistory);

module.exports = router;