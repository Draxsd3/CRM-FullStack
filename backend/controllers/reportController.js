const reportService = require('../services/reportService');

exports.getMeetingStats = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;
    if (!startDate || !endDate) {
      return res.status(400).json({ success: false, error: 'Data inicial e final são obrigatórias' });
    }
    const stats = await reportService.getMeetingStats(startDate, endDate);
    res.status(200).json({ success: true, data: stats });
  } catch (error) {
    next(error);
  }
};

exports.getPipelineConversionStats = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;
    if (!startDate || !endDate) {
      return res.status(400).json({ success: false, error: 'Data inicial e final são obrigatórias' });
    }
    const stats = await reportService.getPipelineConversionStats(startDate, endDate);
    res.status(200).json({ success: true, data: stats });
  } catch (error) {
    next(error);
  }
};

exports.getFullReport = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;
    if (!startDate || !endDate) {
      return res.status(400).json({ success: false, error: 'Data inicial e final são obrigatórias' });
    }
    const reportData = await reportService.getFullReport(startDate, endDate);
    res.status(200).json({ success: true, data: reportData });
  } catch (error) {
    next(error);
  }
};

exports.exportReportExcel = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;
    if (!startDate || !endDate) {
      return res.status(400).json({ success: false, error: 'Data inicial e final são obrigatórias' });
    }
    const buffer = await reportService.exportReportExcel(startDate, endDate);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=relatorio.xlsx');
    res.send(buffer);
  } catch (error) {
    next(error);
  }
};

exports.exportReportPDF = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;
    if (!startDate || !endDate) {
      return res.status(400).json({ success: false, error: 'Data inicial e final são obrigatórias' });
    }
    const buffer = await reportService.exportReportPDF(startDate, endDate);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=relatorio.pdf');
    res.send(buffer);
  } catch (error) {
    next(error);
  }
};
