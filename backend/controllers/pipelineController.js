const pipelineService = require('../services/pipelineService');

// Get companies grouped by pipeline status
exports.getPipelineCompanies = async (req, res, next) => {
  try {
    // Make sure user is authenticated and pass the user ID
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        success: false,
        error: 'Usuário não autenticado'
      });
    }
    
    const pipelineData = await pipelineService.getPipelineCompanies(req.user.id, req.user.role);
    res.status(200).json({ success: true, data: pipelineData });
  } catch (error) {
    next(error);
  }
};

// Update company pipeline status
exports.updateCompanyStatus = async (req, res, next) => {
  try {
    const { 
      companyId, 
      newStatus, 
      observations, 
      qualificationStatus,
      shouldChangeAssignedUser
    } = req.body;

    const result = await pipelineService.updateCompanyStatus(
      companyId, 
      newStatus, 
      observations, 
      qualificationStatus,
      req.user.id,  // User ID for tracking who made the change
      shouldChangeAssignedUser // Flag to control whether to change assignedUser
    );

    res.status(200).json({ 
      success: true, 
      data: result 
    });
  } catch (error) {
    console.error('Pipeline Status Update Controller Error:', error);
    
    const statusCode = error.message.includes('não encontrada') ? 404 : 500;
    
    res.status(statusCode).json({ 
      success: false, 
      error: error.message 
    });
  }
};

// Transfer company to Closer
exports.transferToCloser = async (req, res, next) => {
  try {
    const { companyId, closerId, observations } = req.body;
    
    if (!companyId || !closerId) {
      return res.status(400).json({ 
        success: false, 
        error: 'ID da empresa e ID do Closer são obrigatórios' 
      });
    }
    
    const result = await pipelineService.transferToCloser(
      companyId, 
      req.user.id,
      closerId,
      observations
    );
    
    if (!result) {
      return res.status(404).json({ success: false, error: 'Empresa ou Closer não encontrado' });
    }
    
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

// Get pipeline history for a company
exports.getCompanyPipelineHistory = async (req, res, next) => {
  try {
    const { companyId } = req.params;
    
    const history = await pipelineService.getCompanyPipelineHistory(companyId);
    
    res.status(200).json({ success: true, data: history });
  } catch (error) {
    next(error);
  }
};