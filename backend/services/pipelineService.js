const Company = require('../models/Company');
const PipelineHistory = require('../models/PipelineHistory');
const User = require('../models/User');
const sequelize = require('../config/database');
const { Op } = require('sequelize');

// Pipeline stages
const PIPELINE_STAGES = [
  'Lead',
  'Reunião Agendada', 
  'Reunião Realizada',
  'Reunião Cancelada',
  'Aguardando Documentação', 
  'Cadastro Efetivado', 
  'Cliente Operando'
];

// Pipeline stages by user role
/* @tweakable Pipeline stages configuration */
const PIPELINE_STAGES_BY_ROLE = {
  'SDR': [
    'Lead',
    'Reunião Agendada',
    'Reunião Realizada',
    'Reunião Cancelada'
  ],
  'Closer': [
    'Reunião Agendada',
    'Reunião Realizada',
    'Reunião Cancelada',
    'Aguardando Documentação',
    'Cadastro Efetivado',
    'Cliente Operando'
  ],
  'ADM': [
    'Lead',
    'Reunião Agendada',
    'Reunião Realizada',
    'Aguardando Documentação',
    'Aguardando Cadastro',
    'Cadastro Efetivado',
    'Cliente Operando'
  ],
  'Supervisor': [
    'Lead',
    'Reunião Agendada',
    'Reunião Realizada',
    'Aguardando Documentação',
    'Aguardando Cadastro',
    'Cadastro Efetivado',
    'Cliente Operando'
  ]
};

// Get companies grouped by pipeline status - CRITICAL FIX
exports.getPipelineCompanies = async (userId, userRole) => {
  // Get the appropriate pipeline stages for this user's role
  const pipelineStages = PIPELINE_STAGES;
  
  // Create an object with pipeline stages as empty arrays
  const pipelineData = pipelineStages.reduce((acc, stage) => {
    acc[stage] = [];
    return acc;
  }, {});
  
  // Setup the query - no user filtering for shared pipeline
  let query = {};
  
  /* @tweakable Pipeline sharing configuration */
  const PIPELINE_CONFIG = {
    SHARED_PIPELINE: true,
    FILTER_DISQUALIFIED: true
  };
  
  // Only apply filters for disqualified leads if configured
  if (PIPELINE_CONFIG.FILTER_DISQUALIFIED) {
    query.qualificationStatus = {
      [Op.ne]: 'Lead Desqualificado'
    };
  }
  
  console.log('🔍 Fetching pipeline companies with query:', query);
  
  // Get companies based on the query
  const companies = await Company.findAll({
    attributes: [
      'id', 'name', 'cnpj', 'contactName', 
      'contactPhone', 'email', 'pipelineStatus', 'qualificationStatus',
      'createdAt', 'updatedAt', 'assignedUserId', 'ownerType'
    ],
    where: query,
    include: [
      {
        model: User,
        as: 'AssignedUser',
        attributes: ['id', 'name', 'role']
      }
    ]
  });
  
  console.log(`📊 Found ${companies.length} total companies`);
  
  // Count companies by status
  const statusCounts = {};
  PIPELINE_STAGES.forEach(stage => {
    statusCounts[stage] = 0;
  });
  
  // Group companies by pipeline stage
  companies.forEach(company => {
    const status = company.pipelineStatus;
    if (pipelineData[status]) {
      pipelineData[status].push(company);
      statusCounts[status] = (statusCounts[status] || 0) + 1;
    } else {
      console.warn(`⚠️ Company ${company.id} has invalid status: ${status}`);
    }
  });
  
  // Log counts for each status
  console.log('📊 Companies by status:', statusCounts);
  
  // Specifically log Lead count
  console.log(`📋 Lead Count: ${pipelineData['Lead'].length}`);
  if (pipelineData['Lead'].length > 0) {
    console.log('📋 Sample Lead:', {
      id: pipelineData['Lead'][0].id,
      name: pipelineData['Lead'][0].name,
      status: pipelineData['Lead'][0].pipelineStatus
    });
  }
  
  return pipelineData;
};

// Update company pipeline status with role validation and user tracking
exports.updateCompanyStatus = async (companyId, newStatus, observations, qualificationStatus = null, userId = null, shouldChangeAssignedUser = false) => {
  const transaction = await sequelize.transaction();

  try {
    // Validate input parameters
    if (!companyId || !newStatus) {
      throw new Error('ID da empresa e novo status são obrigatórios');
    }

    if (!observations || observations.trim() === '') {
      throw new Error('Observação é obrigatória');
    }

    // Find the company within the transaction
    const company = await Company.findByPk(companyId, { 
      transaction,
      include: [
        {
          model: User,
          as: 'AssignedUser',
          attributes: ['id', 'name', 'role']
        }
      ]
    });
    
    if (!company) {
      await transaction.rollback();
      throw new Error('Empresa não encontrada');
    }

    const oldStatus = company.pipelineStatus;
    const oldAssignedUserId = company.assignedUserId;

    // Get the current user who is making the change
    const currentUser = userId ? await User.findByPk(userId) : null;
    
    // Only prepare assignment update if explicitly requested via shouldChangeAssignedUser flag
    let assignmentUpdate = {};
    if (shouldChangeAssignedUser && userId) {
      assignmentUpdate = { assignedUserId: userId };
    }

    // Update company status and assigned user if requested
    await company.update(
      {
        pipelineStatus: newStatus,
        ...assignmentUpdate, // Only update assignedUserId if explicitly requested
        ...(qualificationStatus && { qualificationStatus })
      },
      { transaction }
    );

    // Create pipeline history record that always tracks who made the change
    await PipelineHistory.create(
      {
        companyId: company.id,
        previousStatus: oldStatus,
        newStatus: newStatus,
        observations: observations,
        qualificationStatus,
        userId: userId, // Who made the change
        previousAssignedUserId: oldAssignedUserId,
        newAssignedUserId: shouldChangeAssignedUser ? userId : null // Only set if user explicitly changed
      },
      { transaction }
    );

    await transaction.commit();

    return {
      company,
      statusChange: {
        from: oldStatus,
        to: newStatus,
        date: new Date(),
        userId: userId,
        assignmentChanged: shouldChangeAssignedUser && userId !== null && oldAssignedUserId !== userId
      }
    };
  } catch (error) {
    await transaction.rollback();
    console.error('Pipeline Status Update Error:', error);
    throw error;
  }
};

// Transfer company to Closer
exports.transferToCloser = async (companyId, closerId, observations) => {
  const transaction = await sequelize.transaction();
  
  try {
    // Validate company exists
    const company = await Company.findByPk(companyId, { transaction });
    
    if (!company) {
      await transaction.rollback();
      throw new Error('Empresa não encontrada');
    }
    
    // Validate closer exists and is actually a Closer
    const closer = await User.findByPk(closerId);
    
    if (!closer || closer.role !== 'Closer') {
      await transaction.rollback();
      throw new Error('Closer inválido');
    }
    
    /* @tweakable Default status when transferring to a Closer */
    const CLOSER_DEFAULT_STATUS = 'Reunião Agendada';
    
    const oldStatus = company.pipelineStatus;
    const oldOwnerType = company.ownerType;
    const oldAssignedUserId = company.assignedUserId;
    
    // Update company
    await company.update({
      assignedUserId: closerId,
      ownerType: 'Closer',
      pipelineStatus: CLOSER_DEFAULT_STATUS,
      lastTransferDate: new Date()
    }, { transaction });
    
    // Record transfer in history
    await PipelineHistory.create({
      companyId: company.id,
      previousStatus: oldStatus,
      newStatus: CLOSER_DEFAULT_STATUS,
      previousOwnerType: oldOwnerType,
      newOwnerType: 'Closer',
      /* @tweakable Transfer history data tracking */
      transferData: JSON.stringify({
        fromUserId: oldAssignedUserId,
        toUserId: closerId,
        date: new Date()
      }),
      observations: observations || 'Empresa transferida para Closer',
      previousAssignedUserId: oldAssignedUserId,
      newAssignedUserId: closerId,
      userId: closerId // Who performed the action
    }, { transaction });
    
    await transaction.commit();
    
    return company;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

// Get pipeline history for a company
exports.getCompanyPipelineHistory = async (companyId) => {
  // Validate company exists
  const company = await Company.findByPk(companyId);
  
  if (!company) {
    throw new Error('Empresa não encontrada');
  }
  
  // Get all history entries for this company with user information
  const history = await PipelineHistory.findAll({
    where: { companyId },
    include: [
      {
        model: User,
        as: 'User',
        attributes: ['id', 'name', 'role']
      },
      {
        model: User,
        as: 'PreviousAssignedUser',
        attributes: ['id', 'name', 'role']
      },
      {
        model: User,
        as: 'NewAssignedUser',
        attributes: ['id', 'name', 'role']
      }
    ],
    order: [['changeDate', 'DESC']]
  });
  
  return history;
};