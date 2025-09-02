import api from './api';

const pipelineService = {
  // Obter empresas agrupadas por status do pipeline
  getPipelineCompanies: async () => {
    const response = await api.get('/pipeline');
    return response.data.data;
  },
  
  // Atualizar status da empresa no pipeline
  updateCompanyStatus: async (companyId, newStatus, observations, qualificationStatus = null, shouldChangeAssignedUser = false) => {
    // Ensure observations are not empty
    if (!observations || observations.trim() === '') {
      throw new Error('Observação é obrigatória');
    }

    const payload = {
      companyId,
      newStatus,
      observations: observations.trim(),
      shouldChangeAssignedUser // Explicit flag to control assigned user changes
    };
    
    if (qualificationStatus) {
      payload.qualificationStatus = qualificationStatus;
    }
    
    const response = await api.post('/pipeline/update-status', payload);
    return response.data.data;
  },
  
  // Transferir empresa para um Closer
  transferToCloser: async (companyId, closerId, observations = null) => {
    const payload = {
      companyId,
      closerId,
      observations
    };
    
    const response = await api.post('/pipeline/transfer-to-closer', payload);
    return response.data.data;
  },
  
  // Obter histórico do pipeline para uma empresa
  getCompanyPipelineHistory: async (companyId) => {
    const response = await api.get(`/pipeline/history/${companyId}`);
    return response.data.data;
  },
};

export default pipelineService;