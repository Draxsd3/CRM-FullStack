const Company = require('../models/Company');
const Meeting = require('../models/Meeting');
const PipelineHistory = require('../models/PipelineHistory');
const { Op, fn, col, literal } = require('sequelize');
const ExcelJS = require('exceljs');
const PDFDocument = require('pdfkit');
const User = require('../models/User');
const sequelize = require('../config/database'); 

// Get meeting statistics
exports.getMeetingStats = async (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  // Get total meetings count
  const totalMeetings = await Meeting.count({
    where: {
      startTime: { [Op.between]: [start, end] }
    }
  });
  
  // Get meetings count by status
  const meetingsByStatus = await Meeting.findAll({
    attributes: [
      'status',
      [fn('count', '*'), 'count']
    ],
    where: {
      startTime: { [Op.between]: [start, end] }
    },
    group: ['status']
  });
  
  // Get meetings count by type
  const meetingsByType = await Meeting.findAll({
    attributes: [
      'meetingType',
      [fn('count', '*'), 'count']
    ],
    where: {
      startTime: { [Op.between]: [start, end] }
    },
    group: ['meetingType']
  });
  
  return {
    totalMeetings,
    meetingsByStatus: meetingsByStatus.map(m => ({
      status: m.status,
      count: m.getDataValue('count')
    })),
    meetingsByType: meetingsByType.map(m => ({
      type: m.meetingType,
      count: m.getDataValue('count')
    }))
  };
};

// Get pipeline conversion statistics
exports.getPipelineConversionStats = async (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  // Count companies by current pipeline status
  const currentPipelineCount = await Company.findAll({
    attributes: [
      'pipelineStatus',
      [fn('count', '*'), 'count']
    ],
    group: ['pipelineStatus']
  });
  
  // Count companies that moved to "Cliente Operando" in this period
  const newClients = await PipelineHistory.count({
    where: {
      newStatus: 'Cliente Operando',
      changeDate: { [Op.between]: [start, end] }
    }
  });
  
  // Count companies that were created in this period
  const newLeads = await Company.count({
    where: {
      createdAt: { [Op.between]: [start, end] }
    }
  });
  
  // Calculate conversion rate (leads to clients)
  const conversionRate = newLeads > 0 ? (newClients / newLeads) * 100 : 0;
  
  // Get pipeline movements in this period
  const pipelineMovements = await PipelineHistory.findAll({
    attributes: [
      'previousStatus',
      'newStatus',
      [fn('count', '*'), 'count']
    ],
    where: {
      changeDate: { [Op.between]: [start, end] }
    },
    group: ['previousStatus', 'newStatus']
  });
  
  return {
    currentPipelineCount: currentPipelineCount.map(c => ({
      status: c.pipelineStatus,
      count: c.getDataValue('count')
    })),
    newClients,
    newLeads,
    conversionRate: parseFloat(conversionRate.toFixed(2)),
    pipelineMovements: pipelineMovements.map(p => ({
      from: p.previousStatus,
      to: p.newStatus,
      count: p.getDataValue('count')
    }))
  };
};

// Get full report data
exports.getFullReport = async (startDate, endDate) => {
  const meetingStats = await this.getMeetingStats(startDate, endDate);
  const pipelineStats = await this.getPipelineConversionStats(startDate, endDate);
  
  // Get real SDR performance from database
  const sdrPerformance = await this.getSdrPerformanceStats(startDate, endDate);
  
  // Add SDR performance data to pipeline stats
  pipelineStats.sdrPerformance = sdrPerformance;
  
  return {
    period: {
      startDate,
      endDate
    },
    meetingStats,
    pipelineStats
  };
};

// Get SDR performance statistics
exports.getSdrPerformanceStats = async (startDate, endDate) => {
  /* @tweakable Minimum meetings to be considered for performance */
  const MINIMUM_MEETINGS_THRESHOLD = 1;
  
  /* @tweakable Performance weighting for meetings and conversions */
  const MEETING_WEIGHT = 0.3;
  const CONVERSION_WEIGHT = 0.7;
  
  // Get all users with SDR role
  const sdrs = await User.findAll({
    where: { role: 'SDR' },
    attributes: ['id', 'name']
  });
  
  const sdrPerformance = [];
  
  // For each SDR, get their meetings and conversions
  for (const sdr of sdrs) {
    // Count meetings scheduled by this SDR
    const meetingsScheduled = await Meeting.count({
      where: {
        startTime: { [Op.between]: [new Date(startDate), new Date(endDate)] }
      },
      include: [{
        model: Company,
        required: true,
        where: { assignedUserId: sdr.id }
      }]
    });
    
    // Count companies converted to "Cliente Operando" by this SDR
    const clientsConverted = await PipelineHistory.count({
      where: {
        newStatus: 'Cliente Operando',
        changeDate: { [Op.between]: [new Date(startDate), new Date(endDate)] }
      },
      include: [{
        model: Company,
        required: true,
        where: { assignedUserId: sdr.id }
      }]
    });
    
    // Calculate performance score
    const performanceScore = (
      (meetingsScheduled * MEETING_WEIGHT) + 
      (clientsConverted * CONVERSION_WEIGHT)
    ).toFixed(2);
    
    sdrPerformance.push({
      id: sdr.id,
      name: sdr.name,
      meetingsScheduled,
      clientsConverted,
      performanceScore
    });
  }
  
  return sdrPerformance.sort((a, b) => b.performanceScore - a.performanceScore);
};

// Export report as Excel
exports.exportReportExcel = async (startDate, endDate) => {
  const reportData = await this.getFullReport(startDate, endDate);
  
  const workbook = new ExcelJS.Workbook();
  
  // Add summary sheet
  const summarySheet = workbook.addWorksheet('Resumo');
  
  summarySheet.columns = [
    { header: 'Métrica', key: 'metric', width: 30 },
    { header: 'Valor', key: 'value', width: 20 }
  ];
  
  summarySheet.addRows([
    { metric: 'Período do Relatório', value: `${startDate} até ${endDate}` },
    { metric: 'Total de Reuniões', value: reportData.meetingStats.totalMeetings },
    { metric: 'Novos Leads', value: reportData.pipelineStats.newLeads },
    { metric: 'Novos Clientes Operando', value: reportData.pipelineStats.newClients },
    { metric: 'Taxa de Conversão (%)', value: reportData.pipelineStats.conversionRate }
  ]);
  
  // Add pipeline status sheet
  const pipelineSheet = workbook.addWorksheet('Status do Pipeline');
  
  pipelineSheet.columns = [
    { header: 'Status', key: 'status', width: 30 },
    { header: 'Quantidade', key: 'count', width: 20 }
  ];
  
  pipelineSheet.addRows(reportData.pipelineStats.currentPipelineCount);
  
  // Add meetings sheet
  const meetingsSheet = workbook.addWorksheet('Reuniões');
  
  meetingsSheet.columns = [
    { header: 'Tipo', key: 'type', width: 30 },
    { header: 'Quantidade', key: 'count', width: 20 }
  ];
  
  meetingsSheet.addRows(reportData.meetingStats.meetingsByType);
  
  // Create buffer
  const buffer = await workbook.xlsx.writeBuffer();
  
  return buffer;
};

// Export report as PDF
exports.exportReportPDF = async (startDate, endDate) => {
  const reportData = await this.getFullReport(startDate, endDate);
  
  // Create a document
  const doc = new PDFDocument();
  const buffers = [];
  
  doc.on('data', buffers.push.bind(buffers));
  
  // Add title
  doc.fontSize(16).text('Relatório CRM Securitizadora', { align: 'center' });
  doc.moveDown();
  
  // Add period
  doc.fontSize(12).text(`Período: ${startDate} até ${endDate}`, { align: 'center' });
  doc.moveDown(2);
  
  // Add summary
  doc.fontSize(14).text('Resumo', { underline: true });
  doc.moveDown();
  
  doc.fontSize(12).text(`Total de Reuniões: ${reportData.meetingStats.totalMeetings}`);
  doc.fontSize(12).text(`Novos Leads: ${reportData.pipelineStats.newLeads}`);
  doc.fontSize(12).text(`Novos Clientes Operando: ${reportData.pipelineStats.newClients}`);
  doc.fontSize(12).text(`Taxa de Conversão: ${reportData.pipelineStats.conversionRate}%`);
  doc.moveDown(2);
  
  // Add pipeline status
  doc.fontSize(14).text('Status do Pipeline', { underline: true });
  doc.moveDown();
  
  reportData.pipelineStats.currentPipelineCount.forEach(item => {
    doc.fontSize(12).text(`${item.status}: ${item.count}`);
  });
  
  doc.moveDown(2);
  
  // Add meetings by type
  doc.fontSize(14).text('Reuniões por Tipo', { underline: true });
  doc.moveDown();
  
  reportData.meetingStats.meetingsByType.forEach(item => {
    doc.fontSize(12).text(`${item.type}: ${item.count}`);
  });
  
  // Finalize the PDF
  doc.end();
  
  return new Promise((resolve) => {
    doc.on('end', () => {
      resolve(Buffer.concat(buffers));
    });
  });
};