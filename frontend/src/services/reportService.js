import api from './api';

const reportService = {
  // Obter estatísticas de reuniões
  getMeetingStats: async (startDate, endDate) => {
    const response = await api.get(`/reports/meetings?startDate=${startDate}&endDate=${endDate}`);
    return response.data.data;
  },
  
  // Obter estatísticas de conversão do pipeline
  getPipelineConversionStats: async (startDate, endDate) => {
    const response = await api.get(`/reports/pipeline?startDate=${startDate}&endDate=${endDate}`);
    return response.data.data;
  },
  
  // Obter relatório completo
  getFullReport: async (startDate, endDate) => {
    const response = await api.get(`/reports/full?startDate=${startDate}&endDate=${endDate}`);
    return response.data.data;
  },
  
  // Exportar relatório em Excel
  exportReportExcel: async (startDate, endDate) => {
    const response = await api.get(`/reports/export/excel?startDate=${startDate}&endDate=${endDate}`, {
      responseType: 'blob'
    });
    return response.data;
  },
  
  // Exportar relatório em PDF
  exportReportPDF: async (startDate, endDate) => {
    const response = await api.get(`/reports/export/pdf?startDate=${startDate}&endDate=${endDate}`, {
      responseType: 'blob'
    });
    return response.data;
  },
};

export default reportService;

