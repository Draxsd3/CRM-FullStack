const Meeting = require('../models/Meeting');
const Company = require('../models/Company');
const User = require('../models/User');
const PipelineHistory = require('../models/PipelineHistory');
const mongoose = require('mongoose');

const STATUS = {
  LEAD: 'Lead',
  REUNIAO_AGENDADA: 'Reunião Agendada',
  REUNIAO_REALIZADA: 'Reunião Realizada',
  REUNIAO_CANCELADA: 'Reunião Cancelada',
};

const historyCreate = async (payload) => {
  await PipelineHistory.create(payload);
};

// Get all meetings
exports.getAllMeetings = async () => {
  return await Meeting.find()
    .populate('companyId', 'id name contactName email')
    .lean()
    .then((meetings) =>
      meetings.map((m) => ({
        ...m,
        id: m._id,
        Company: m.companyId
          ? {
              id: m.companyId._id,
              name: m.companyId.name,
              contactName: m.companyId.contactName,
              email: m.companyId.email,
            }
          : null,
      }))
    );
};

// Get meeting by ID
exports.getMeetingById = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) return null;

  const m = await Meeting.findById(id)
    .populate('companyId', 'id name contactName email')
    .lean();

  if (!m) return null;

  return {
    ...m,
    id: m._id,
    Company: m.companyId
      ? {
          id: m.companyId._id,
          name: m.companyId.name,
          contactName: m.companyId.contactName,
          email: m.companyId.email,
        }
      : null,
  };
};

function formatMeeting(m) {
  if (!m) return null;
  const obj = m.toObject ? m.toObject() : m;
  return {
    ...obj,
    id: obj._id,
    Company:
      obj.companyId && typeof obj.companyId === 'object'
        ? {
            id: obj.companyId._id,
            name: obj.companyId.name,
            contactName: obj.companyId.contactName,
            email: obj.companyId.email,
          }
        : null,
  };
}

// Create meeting
exports.createMeeting = async (meetingData) => {
  const company = await Company.findById(meetingData.companyId);
  if (!company) {
    throw new Error('Empresa não encontrada');
  }

  if (meetingData.enableNotification === undefined) {
    meetingData.enableNotification = true;
  }

  const meeting = await Meeting.create(meetingData);

  // Auto-advance pipeline
  if (company.pipelineStatus === STATUS.LEAD) {
    company.pipelineStatus = STATUS.REUNIAO_AGENDADA;
    await company.save();

    await historyCreate([
      {
        companyId: company._id,
        previousStatus: STATUS.LEAD,
        newStatus: STATUS.REUNIAO_AGENDADA,
        observations: 'Reunião agendada automaticamente',
      },
    ]);
  }

  if (meetingData.status === 'Realizada' && company.pipelineStatus === STATUS.REUNIAO_AGENDADA) {
    company.pipelineStatus = STATUS.REUNIAO_REALIZADA;
    await company.save();

    await historyCreate([
      {
        companyId: company._id,
        previousStatus: STATUS.REUNIAO_AGENDADA,
        newStatus: STATUS.REUNIAO_REALIZADA,
        observations: 'Reunião marcada como realizada',
      },
    ]);
  }

  const result = await Meeting.findById(meeting._id)
    .populate('companyId', 'id name contactName email')
    .lean();
  return formatMeeting(result);
};

// Update meeting
exports.updateMeeting = async (id, meetingData, userId) => {
  if (!mongoose.Types.ObjectId.isValid(id)) throw new Error('ID de reunião inválido');

  const meeting = await Meeting.findById(id).populate('companyId', 'id assignedUserId pipelineStatus');
  if (!meeting) throw new Error('Reunião não encontrada');

  const user = await User.findById(userId);
  const isAdmin = user && (user.role === 'ADM' || user.role === 'Supervisor');
  const isCompanyOwner = meeting.companyId && String(meeting.companyId.assignedUserId) === String(userId);
  const isMeetingOwner = String(meeting.ownerUserId) === String(userId);

  if (!isAdmin && !isCompanyOwner && !isMeetingOwner) {
    throw new Error('Você não tem permissão para editar esta reunião');
  }

  const companyStatus = meeting.companyId?.pipelineStatus || STATUS.LEAD;

  await historyCreate([
    {
      companyId: meeting.companyId._id,
      previousStatus: companyStatus,
      newStatus: companyStatus,
      observations: `Reunião "${meeting.title}" atualizada`,
      changeDate: new Date(),
      userId,
    },
  ]);

  const oldStatus = meeting.status;

  const updatePayload = {
    ...meetingData,
    description: meetingData.description || null,
    location: meetingData.location || null,
  };

  Object.assign(meeting, updatePayload);
  await meeting.save();

  // Pipeline status transitions
  const company = await Company.findById(meeting.companyId._id);

  if (oldStatus !== 'Realizada' && meetingData.status === 'Realizada') {
    if (company && (company.pipelineStatus === STATUS.REUNIAO_AGENDADA || company.pipelineStatus === STATUS.REUNIAO_CANCELADA)) {
      const prevStatus = company.pipelineStatus;
      company.pipelineStatus = STATUS.REUNIAO_REALIZADA;
      await company.save();
      await historyCreate([
        {
          companyId: company._id,
          previousStatus: prevStatus,
          newStatus: STATUS.REUNIAO_REALIZADA,
          observations: 'Reunião marcada como realizada',
          userId,
        },
      ]);
    }
  }

  if (oldStatus !== 'Cancelada' && meetingData.status === 'Cancelada') {
    if (company && company.pipelineStatus === STATUS.REUNIAO_AGENDADA) {
      company.pipelineStatus = STATUS.REUNIAO_CANCELADA;
      await company.save();
      await historyCreate([
        {
          companyId: company._id,
          previousStatus: STATUS.REUNIAO_AGENDADA,
          newStatus: STATUS.REUNIAO_CANCELADA,
          observations: 'Reunião cancelada',
          userId,
        },
      ]);
    }
  }

  if (oldStatus !== 'Reagendada' && meetingData.status === 'Reagendada') {
    if (company && company.pipelineStatus === STATUS.REUNIAO_CANCELADA) {
      company.pipelineStatus = STATUS.REUNIAO_AGENDADA;
      await company.save();
      await historyCreate([
        {
          companyId: company._id,
          previousStatus: STATUS.REUNIAO_CANCELADA,
          newStatus: STATUS.REUNIAO_AGENDADA,
          observations: 'Reunião reagendada',
          userId,
        },
      ]);
    }
  }

  const result = await Meeting.findById(id)
    .populate('companyId', 'id name contactName email')
    .lean();
  return formatMeeting(result);
};

// Delete meeting
exports.deleteMeeting = async (id, userId) => {
  if (!mongoose.Types.ObjectId.isValid(id)) throw new Error('ID de reunião inválido');

  const meeting = await Meeting.findById(id).populate('companyId', 'id assignedUserId pipelineStatus');
  if (!meeting) throw new Error('Reunião não encontrada');

  const user = await User.findById(userId);
  if (!user) throw new Error('Usuário não encontrado');

  const isAdmin = user.role === 'ADM' || user.role === 'Supervisor';
  const isCompanyOwner = meeting.companyId && String(meeting.companyId.assignedUserId) === String(userId);
  const isMeetingOwner = String(meeting.ownerUserId) === String(userId);

  if (!isAdmin && !isCompanyOwner && !isMeetingOwner) {
    throw new Error('Você não tem permissão para excluir esta reunião');
  }

  await historyCreate([
    {
      companyId: meeting.companyId._id,
      previousStatus: meeting.companyId.pipelineStatus,
      newStatus: meeting.companyId.pipelineStatus,
      observations: `Reunião "${meeting.title}" excluída`,
      changeDate: new Date(),
      userId,
    },
  ]);

  await meeting.deleteOne();
  return true;
};

// Get meetings by date range
exports.getMeetingsByDateRange = async (startDate, endDate) => {
  try {
    let startDateTime = new Date(startDate);
    startDateTime.setHours(0, 0, 0, 0);

    let endDateTime = new Date(endDate);
    endDateTime.setHours(23, 59, 59, 999);

    if (isNaN(startDateTime.getTime()) || isNaN(endDateTime.getTime())) {
      const now = new Date();
      startDateTime = new Date(now.getFullYear(), now.getMonth(), 1);
      endDateTime = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
    }

    const meetings = await Meeting.find({
      startTime: { $gte: startDateTime, $lte: endDateTime },
    })
      .populate('companyId', 'id name contactName email')
      .sort({ startTime: 1 })
      .lean();

    return meetings.map((m) => formatMeeting(m));
  } catch (error) {
    console.error('Error fetching meetings by date range:', error);
    return [];
  }
};

// Get meetings for a company
exports.getCompanyMeetings = async (companyId) => {
  return await Meeting.find({ companyId }).sort({ startTime: -1 }).lean();
};
