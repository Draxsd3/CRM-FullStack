const pipelineService = require('../services/pipelineService');

exports.getPipelineCompanies = async (req, res, next) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ success: false, error: 'Usuário não autenticado' });
    }
    const pipelineData = await pipelineService.getPipelineCompanies(req.user.id, req.user.role);
    res.status(200).json({ success: true, data: pipelineData });
  } catch (error) {
    next(error);
  }
};

exports.updateCompanyStatus = async (req, res, next) => {
  try {
    const { companyId, newStatus, observations, qualificationStatus, shouldChangeAssignedUser } = req.body;

    const result = await pipelineService.updateCompanyStatus(companyId, newStatus, observations, qualificationStatus, req.user.id, shouldChangeAssignedUser);

    res.status(200).json({ success: true, data: result });
  } catch (error) {
    console.error('Pipeline Status Update Controller Error:', error);
    const statusCode = error.message.includes('não encontrada') ? 404 : 500;
    res.status(statusCode).json({ success: false, error: error.message });
  }
};

exports.transferToCloser = async (req, res, next) => {
  try {
    const { companyId, closerId, observations } = req.body;
    if (!companyId || !closerId) {
      return res.status(400).json({ success: false, error: 'ID da empresa e ID do Closer são obrigatórios' });
    }
    const result = await pipelineService.transferToCloser(companyId, req.user.id, closerId, observations);
    if (!result) {
      return res.status(404).json({ success: false, error: 'Empresa ou Closer não encontrado' });
    }
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

exports.getCompanyPipelineHistory = async (req, res, next) => {
  try {
    const { companyId } = req.params;
    const history = await pipelineService.getCompanyPipelineHistory(companyId);
    res.status(200).json({ success: true, data: history });
  } catch (error) {
    next(error);
  }
};
