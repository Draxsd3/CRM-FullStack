const Company = require('../models/Company');
const Meeting = require('../models/Meeting');
const PipelineHistory = require('../models/PipelineHistory');
const User = require('../models/User');
const ExcelJS = require('exceljs');
const PDFDocument = require('pdfkit');

// Get meeting statistics
exports.getMeetingStats = async (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);

  const totalMeetings = await Meeting.countDocuments({
    startTime: { $gte: start, $lte: end },
  });

  const meetingsByStatus = await Meeting.aggregate([
    { $match: { startTime: { $gte: start, $lte: end } } },
    { $group: { _id: '$status', count: { $sum: 1 } } },
  ]);

  const meetingsByType = await Meeting.aggregate([
    { $match: { startTime: { $gte: start, $lte: end } } },
    { $group: { _id: '$meetingType', count: { $sum: 1 } } },
  ]);

  return {
    totalMeetings,
    meetingsByStatus: meetingsByStatus.map((m) => ({ status: m._id, count: m.count })),
    meetingsByType: meetingsByType.map((m) => ({ type: m._id, count: m.count })),
  };
};

// Get pipeline conversion statistics
exports.getPipelineConversionStats = async (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);

  const currentPipelineCount = await Company.aggregate([
    { $group: { _id: '$pipelineStatus', count: { $sum: 1 } } },
  ]);

  const newClients = await PipelineHistory.countDocuments({
    newStatus: 'Cliente Operando',
    changeDate: { $gte: start, $lte: end },
  });

  const newLeads = await Company.countDocuments({
    createdAt: { $gte: start, $lte: end },
  });

  const conversionRate = newLeads > 0 ? (newClients / newLeads) * 100 : 0;

  const pipelineMovements = await PipelineHistory.aggregate([
    { $match: { changeDate: { $gte: start, $lte: end } } },
    { $group: { _id: { previousStatus: '$previousStatus', newStatus: '$newStatus' }, count: { $sum: 1 } } },
  ]);

  return {
    currentPipelineCount: currentPipelineCount.map((c) => ({ status: c._id, count: c.count })),
    newClients,
    newLeads,
    conversionRate: parseFloat(conversionRate.toFixed(2)),
    pipelineMovements: pipelineMovements.map((p) => ({
      from: p._id.previousStatus,
      to: p._id.newStatus,
      count: p.count,
    })),
  };
};

// Get SDR performance stats
exports.getSdrPerformanceStats = async (startDate, endDate) => {
  const MEETING_WEIGHT = 0.3;
  const CONVERSION_WEIGHT = 0.7;

  const sdrs = await User.find({ role: 'SDR' }).select('id name').lean();

  const sdrPerformance = [];

  for (const sdr of sdrs) {
    // Find companies assigned to this SDR
    const sdrCompanyIds = await Company.find({ assignedUserId: sdr._id }).distinct('_id');

    const meetingsScheduled = await Meeting.countDocuments({
      companyId: { $in: sdrCompanyIds },
      startTime: { $gte: new Date(startDate), $lte: new Date(endDate) },
    });

    const clientsConverted = await PipelineHistory.countDocuments({
      companyId: { $in: sdrCompanyIds },
      newStatus: 'Cliente Operando',
      changeDate: { $gte: new Date(startDate), $lte: new Date(endDate) },
    });

    const performanceScore = (meetingsScheduled * MEETING_WEIGHT + clientsConverted * CONVERSION_WEIGHT).toFixed(2);

    sdrPerformance.push({
      id: sdr._id,
      name: sdr.name,
      meetingsScheduled,
      clientsConverted,
      performanceScore,
    });
  }

  return sdrPerformance.sort((a, b) => b.performanceScore - a.performanceScore);
};

// Get full report data
exports.getFullReport = async (startDate, endDate) => {
  const meetingStats = await this.getMeetingStats(startDate, endDate);
  const pipelineStats = await this.getPipelineConversionStats(startDate, endDate);
  const sdrPerformance = await this.getSdrPerformanceStats(startDate, endDate);

  pipelineStats.sdrPerformance = sdrPerformance;

  return { period: { startDate, endDate }, meetingStats, pipelineStats };
};

// Export report as Excel
exports.exportReportExcel = async (startDate, endDate) => {
  const reportData = await this.getFullReport(startDate, endDate);

  const workbook = new ExcelJS.Workbook();

  const summarySheet = workbook.addWorksheet('Resumo');
  summarySheet.columns = [
    { header: 'Métrica', key: 'metric', width: 30 },
    { header: 'Valor', key: 'value', width: 20 },
  ];
  summarySheet.addRows([
    { metric: 'Período do Relatório', value: `${startDate} até ${endDate}` },
    { metric: 'Total de Reuniões', value: reportData.meetingStats.totalMeetings },
    { metric: 'Novos Leads', value: reportData.pipelineStats.newLeads },
    { metric: 'Novos Clientes Operando', value: reportData.pipelineStats.newClients },
    { metric: 'Taxa de Conversão (%)', value: reportData.pipelineStats.conversionRate },
  ]);

  const pipelineSheet = workbook.addWorksheet('Status do Pipeline');
  pipelineSheet.columns = [
    { header: 'Status', key: 'status', width: 30 },
    { header: 'Quantidade', key: 'count', width: 20 },
  ];
  pipelineSheet.addRows(reportData.pipelineStats.currentPipelineCount);

  const meetingsSheet = workbook.addWorksheet('Reuniões');
  meetingsSheet.columns = [
    { header: 'Tipo', key: 'type', width: 30 },
    { header: 'Quantidade', key: 'count', width: 20 },
  ];
  meetingsSheet.addRows(reportData.meetingStats.meetingsByType);

  return await workbook.xlsx.writeBuffer();
};

// Export report as PDF
exports.exportReportPDF = async (startDate, endDate) => {
  const reportData = await this.getFullReport(startDate, endDate);

  const doc = new PDFDocument();
  const buffers = [];
  doc.on('data', buffers.push.bind(buffers));

  doc.fontSize(16).text('Relatório CRM de Leads', { align: 'center' });
  doc.moveDown();
  doc.fontSize(12).text(`Período: ${startDate} até ${endDate}`, { align: 'center' });
  doc.moveDown(2);

  doc.fontSize(14).text('Resumo', { underline: true });
  doc.moveDown();
  doc.fontSize(12).text(`Total de Reuniões: ${reportData.meetingStats.totalMeetings}`);
  doc.text(`Novos Leads: ${reportData.pipelineStats.newLeads}`);
  doc.text(`Novos Clientes Operando: ${reportData.pipelineStats.newClients}`);
  doc.text(`Taxa de Conversão: ${reportData.pipelineStats.conversionRate}%`);
  doc.moveDown(2);

  doc.fontSize(14).text('Status do Pipeline', { underline: true });
  doc.moveDown();
  reportData.pipelineStats.currentPipelineCount.forEach((item) => {
    doc.fontSize(12).text(`${item.status}: ${item.count}`);
  });

  doc.moveDown(2);
  doc.fontSize(14).text('Reuniões por Tipo', { underline: true });
  doc.moveDown();
  reportData.meetingStats.meetingsByType.forEach((item) => {
    doc.fontSize(12).text(`${item.type}: ${item.count}`);
  });

  doc.end();

  return new Promise((resolve) => {
    doc.on('end', () => resolve(Buffer.concat(buffers)));
  });
};
