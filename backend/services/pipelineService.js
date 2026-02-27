const Company = require('../models/Company');
const PipelineHistory = require('../models/PipelineHistory');
const User = require('../models/User');
const mongoose = require('mongoose');

const PIPELINE_STAGES = [
  'Lead',
  'Reuni\u00e3o Agendada',
  'Reuni\u00e3o Realizada',
  'Reuni\u00e3o Cancelada',
  'Aguardando Documenta\u00e7\u00e3o',
  'Cadastro Efetivado',
  'Cliente Operando',
];

const normalizePipelineStatus = (status) => {
  const raw = String(status || '').trim();
  const ascii = raw
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s]/g, '')
    .toLowerCase();

  if (ascii === 'lead') return 'Lead';
  if (ascii.includes('reuniao agendada') || ascii.includes('reunio agendada')) return 'Reuni\u00e3o Agendada';
  if (ascii.includes('reuniao realizada') || ascii.includes('reunio realizada')) return 'Reuni\u00e3o Realizada';
  if (ascii.includes('reuniao cancelada') || ascii.includes('reunio cancelada')) return 'Reuni\u00e3o Cancelada';
  if (ascii.includes('aguardando documentacao') || ascii.includes('aguardando documentao')) return 'Aguardando Documenta\u00e7\u00e3o';
  if (ascii === 'cadastro efetivado') return 'Cadastro Efetivado';
  if (ascii === 'cliente operando') return 'Cliente Operando';

  return raw;
};

const TRANSACTION_UNSUPPORTED_PATTERNS = [
  'Transaction numbers are only allowed on a replica set member or mongos',
  'transactions are not supported',
  'Transaction not supported',
];
// Force disable transactions for standalone MongoDB environments.
// This CRM runs locally without replica set in most cases.
const USE_TRANSACTIONS = false;

const isTransactionUnsupportedError = (error) => {
  const message = String(
    error?.message || error?.errorResponse?.errmsg || error?.cause?.message || ''
  );
  return TRANSACTION_UNSUPPORTED_PATTERNS.some((pattern) => message.includes(pattern));
};

const withOptionalTransaction = async (operation) => {
  if (!USE_TRANSACTIONS) {
    return await operation(null);
  }

  let session = null;
  try {
    session = await mongoose.startSession();
    session.startTransaction();
    const result = await operation(session);
    await session.commitTransaction();
    return result;
  } catch (error) {
    if (session && session.inTransaction()) {
      try {
        await session.abortTransaction();
      } catch (_) {
      }
    }

    if (isTransactionUnsupportedError(error)) {
      return await operation(null);
    }

    throw error;
  } finally {
    if (session) {
      session.endSession();
    }
  }
};

// Get companies grouped by pipeline status
exports.getPipelineCompanies = async (userId, userRole) => {
  const pipelineData = PIPELINE_STAGES.reduce((acc, stage) => {
    acc[stage] = [];
    return acc;
  }, {});

  const companies = await Company.find({
    qualificationStatus: { $ne: 'Lead Desqualificado' },
  })
    .select('id name cnpj contactName contactPhone email pipelineStatus qualificationStatus createdAt updatedAt assignedUserId ownerType')
    .populate('assignedUserId', 'id name role')
    .lean();

  companies.forEach((company) => {
    const mapped = {
      ...company,
      id: company._id,
      AssignedUser: company.assignedUserId
        ? { id: company.assignedUserId._id, name: company.assignedUserId.name, role: company.assignedUserId.role }
        : null,
    };

    const status = normalizePipelineStatus(company.pipelineStatus);
    mapped.pipelineStatus = status;
    if (pipelineData[status]) {
      pipelineData[status].push(mapped);
    }
  });

  return pipelineData;
};

// Update company pipeline status
exports.updateCompanyStatus = async (companyId, newStatus, observations, qualificationStatus = null, userId = null, shouldChangeAssignedUser = false) => {
  const normalizedStatus = normalizePipelineStatus(newStatus);
  if (!companyId || !normalizedStatus) throw new Error('ID da empresa e novo status sao obrigatorios');
  if (!observations || observations.trim() === '') throw new Error('Observacao e obrigatoria');

  return withOptionalTransaction(async (session) => {
    let query = Company.findById(companyId).populate('assignedUserId', 'id name role');
    if (session) {
      query = query.session(session);
    }

    const company = await query;
    if (!company) throw new Error('Empresa nao encontrada');

    const oldStatus = company.pipelineStatus;
    const oldAssignedUserId = company.assignedUserId?._id || company.assignedUserId;

    if (shouldChangeAssignedUser && userId) {
      company.assignedUserId = userId;
    }

    company.pipelineStatus = normalizedStatus;
    if (qualificationStatus) company.qualificationStatus = qualificationStatus;

    if (session) {
      await company.save({ session });
    } else {
      await company.save();
    }

    const historyPayload = [{
      companyId: company._id,
      previousStatus: oldStatus,
      newStatus: normalizedStatus,
      observations,
      qualificationStatus,
      userId,
      previousAssignedUserId: oldAssignedUserId,
      newAssignedUserId: shouldChangeAssignedUser ? userId : null,
    }];

    if (session) {
      await PipelineHistory.create(historyPayload, { session });
    } else {
      await PipelineHistory.create(historyPayload);
    }

    return {
      company,
      statusChange: {
        from: oldStatus,
        to: normalizedStatus,
        date: new Date(),
        userId,
        assignmentChanged: shouldChangeAssignedUser && userId && String(oldAssignedUserId) !== String(userId),
      },
    };
  });
};

// Transfer company to Closer
exports.transferToCloser = async (companyId, currentUserId, closerId, observations) => {
  return withOptionalTransaction(async (session) => {
    let query = Company.findById(companyId);
    if (session) {
      query = query.session(session);
    }

    const company = await query;
    if (!company) throw new Error('Empresa nao encontrada');

    const closer = await User.findById(closerId);
    if (!closer || closer.role !== 'Closer') throw new Error('Closer invalido');

    const CLOSER_DEFAULT_STATUS = 'Reuni\u00e3o Agendada';
    const oldStatus = company.pipelineStatus;
    const oldOwnerType = company.ownerType;
    const oldAssignedUserId = company.assignedUserId;

    company.assignedUserId = closerId;
    company.ownerType = 'Closer';
    company.pipelineStatus = CLOSER_DEFAULT_STATUS;
    company.lastTransferDate = new Date();

    if (session) {
      await company.save({ session });
    } else {
      await company.save();
    }

    const historyPayload = [{
      companyId: company._id,
      previousStatus: oldStatus,
      newStatus: CLOSER_DEFAULT_STATUS,
      previousOwnerType: oldOwnerType,
      newOwnerType: 'Closer',
      observations: observations || 'Empresa transferida para Closer',
      previousAssignedUserId: oldAssignedUserId,
      newAssignedUserId: closerId,
      userId: closerId,
    }];

    if (session) {
      await PipelineHistory.create(historyPayload, { session });
    } else {
      await PipelineHistory.create(historyPayload);
    }

    return company;
  });
};

// Get pipeline history for a company
exports.getCompanyPipelineHistory = async (companyId) => {
  const company = await Company.findById(companyId);
  if (!company) throw new Error('Empresa nao encontrada');

  const history = await PipelineHistory.find({ companyId })
    .populate('userId', 'id name role')
    .populate('previousAssignedUserId', 'id name role')
    .populate('newAssignedUserId', 'id name role')
    .sort({ changeDate: -1 })
    .lean();

  return history.map((h) => ({
    ...h,
    id: h._id,
    User: h.userId ? { id: h.userId._id, name: h.userId.name, role: h.userId.role } : null,
    PreviousAssignedUser: h.previousAssignedUserId ? { id: h.previousAssignedUserId._id, name: h.previousAssignedUserId.name, role: h.previousAssignedUserId.role } : null,
    NewAssignedUser: h.newAssignedUserId ? { id: h.newAssignedUserId._id, name: h.newAssignedUserId.name, role: h.newAssignedUserId.role } : null,
  }));
};

