const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');

// Routes
router.get('/meetings', reportController.getMeetingStats);
router.get('/pipeline', reportController.getPipelineConversionStats);
router.get('/full', reportController.getFullReport);
router.get('/export/excel', reportController.exportReportExcel);
router.get('/export/pdf', reportController.exportReportPDF);

module.exports = router;

