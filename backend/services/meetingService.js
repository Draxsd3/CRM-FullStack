const Meeting = require('../models/Meeting');
const Company = require('../models/Company');
const User = require('../models/User');
const PipelineHistory = require('../models/PipelineHistory');
const { Op } = require('sequelize');
const sequelize = require('../config/database');

// Get all meetings with company information
exports.getAllMeetings = async () => {
  return await Meeting.findAll({
    include: [
      {
        model: Company,
        attributes: ['id', 'name', 'contactName', 'email']
      }
    ]
  });
};

// Get meeting by ID with company information
exports.getMeetingById = async (id) => {
  return await Meeting.findByPk(id, {
    include: [
      {
        model: Company,
        attributes: ['id', 'name', 'contactName', 'email']
      }
    ]
  });
};

// Create meeting
exports.createMeeting = async (meetingData) => {
  const transaction = await sequelize.transaction();
  
  try {
    // Validate company exists
    const company = await Company.findByPk(meetingData.companyId);
    
    if (!company) {
      await transaction.rollback();
      throw new Error('Empresa não encontrada');
    }
    
    // Ensure enableNotification field is set
    if (meetingData.enableNotification === undefined) {
      meetingData.enableNotification = true;
    }
    
    // Create the meeting
    const meeting = await Meeting.create(meetingData, { transaction });
    
    // If company is in 'Lead' status, move to 'Reunião Agendada'
    if (company.pipelineStatus === 'Lead') {
      // Update company status directly without calling pipelineService
      await company.update({ pipelineStatus: 'Reunião Agendada' }, { transaction });
      
      // Create history record
      await PipelineHistory.create({
        companyId: company.id,
        previousStatus: 'Lead',
        newStatus: 'Reunião Agendada',
        observations: 'Reunião agendada automaticamente'
      }, { transaction });
    }
    
    // If meeting status is 'Realizada' and company is in 'Reunião Agendada', update to 'Reunião Realizada'
    if (meetingData.status === 'Realizada' && company.pipelineStatus === 'Reunião Agendada') {
      await company.update({ pipelineStatus: 'Reunião Realizada' }, { transaction });
      
      // Create history record
      await PipelineHistory.create({
        companyId: company.id,
        previousStatus: 'Reunião Agendada',
        newStatus: 'Reunião Realizada',
        observations: 'Reunião marcada como realizada'
      }, { transaction });
    }
    
    await transaction.commit();
    
    // Return the created meeting with company data
    return await Meeting.findByPk(meeting.id, {
      include: [
        {
          model: Company,
          attributes: ['id', 'name', 'contactName', 'email']
        }
      ]
    });
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

// Update meeting - FIXED to properly handle PipelineHistory creation
exports.updateMeeting = async (id, meetingData, userId) => {
  const transaction = await sequelize.transaction();
  
  try {
    // Find the meeting with its associated company
    const meeting = await Meeting.findOne({
      where: { id },
      include: [
        {
          model: Company,
          attributes: ['id', 'assignedUserId', 'pipelineStatus']
        }
      ]
    });
    
    if (!meeting) {
      throw new Error('Reunião não encontrada');
    }

    // Fetch the current user's role
    const user = await User.findByPk(userId);

    // Permission checks remain the same
    const isAdmin = user && (user.role === 'ADM' || user.role === 'Supervisor');
    const isCompanyOwner = meeting.Company && meeting.Company.assignedUserId === userId;
    const isMeetingOwner = meeting.ownerUserId === userId;

    if (!isAdmin && !isCompanyOwner && !isMeetingOwner) {
      console.log('Permission denied:', { isAdmin, isCompanyOwner, isMeetingOwner, userId, meetingOwner: meeting.ownerUserId });
      throw new Error('Você não tem permissão para editar esta reunião');
    }

    // Explicitly handle nullable fields
    const updatePayload = {
      ...meetingData,
      description: meetingData.description || null,
      location: meetingData.location || null
    };
    
    // CRITICAL FIX: Ensure newStatus is always set to a valid value
    const companyStatus = meeting.Company?.pipelineStatus || 'Lead';
    
    // Create history record with guaranteed non-null newStatus
    await PipelineHistory.create({
      companyId: meeting.companyId,
      previousStatus: companyStatus,
      newStatus: companyStatus, // Always use the current valid status
      observations: `Reunião "${meeting.title}" atualizada`,
      changeDate: new Date(),
      userId: userId
    }, { transaction });

    // Update the meeting
    const updatedMeeting = await meeting.update(updatePayload, { transaction });
    
    // Save the old status to check if it changed
    const oldStatus = meeting.status;
    
    // If status changed to 'Realizada', update company status if appropriate
    if (oldStatus !== 'Realizada' && meetingData.status === 'Realizada') {
      if (meeting.Company && (meeting.Company.pipelineStatus === 'Reunião Agendada' || meeting.Company.pipelineStatus === 'Reunião Cancelada')) {
        await meeting.Company.update({ pipelineStatus: 'Reunião Realizada' }, { transaction });
        
        // Create history record
        await PipelineHistory.create({
          companyId: meeting.companyId,
          previousStatus: meeting.Company.pipelineStatus,
          newStatus: 'Reunião Realizada',
          observations: 'Reunião marcada como realizada',
          userId: userId
        }, { transaction });
      }
    }
    
    // If status changed to 'Cancelada', update company status
    if (oldStatus !== 'Cancelada' && meetingData.status === 'Cancelada') {
      if (meeting.Company && meeting.Company.pipelineStatus === 'Reunião Agendada') {
        await meeting.Company.update({ pipelineStatus: 'Reunião Cancelada' }, { transaction });
        
        // Create history record
        await PipelineHistory.create({
          companyId: meeting.companyId,
          previousStatus: 'Reunião Agendada',
          newStatus: 'Reunião Cancelada',
          observations: 'Reunião cancelada',
          userId: userId
        }, { transaction });
      }
    }

    // If status changed to 'Reagendada', ensure company remains in 'Reunião Agendada'
    if (oldStatus !== 'Reagendada' && meetingData.status === 'Reagendada') {
      if (meeting.Company && meeting.Company.pipelineStatus === 'Reunião Cancelada') {
        await meeting.Company.update({ pipelineStatus: 'Reunião Agendada' }, { transaction });
        
        // Create history record
        await PipelineHistory.create({
          companyId: meeting.companyId,
          previousStatus: 'Reunião Cancelada',
          newStatus: 'Reunião Agendada',
          observations: 'Reunião reagendada',
          userId: userId
        }, { transaction });
      }
    }
    
    await transaction.commit();
    
    // Reload to return updated data with relations
    return await Meeting.findByPk(id, {
      include: [
        {
          model: Company,
          attributes: ['id', 'name', 'contactName', 'email']
        }
      ]
    });
  } catch (error) {
    await transaction.rollback();
    console.error('Meeting Update Service Error:', error);
    throw error;
  }
};

// Delete meeting - Fixed to properly handle numerical IDs and permissions
exports.deleteMeeting = async (id, userId) => {
  // Log what's being received
  console.log('Meeting delete service received ID:', id, 'type:', typeof id);
    
  const transaction = await sequelize.transaction();
  
  try {
    // Ensure numeric ID
    const meetingId = Number(id);
    
    if (isNaN(meetingId) || meetingId <= 0) {
      await transaction.rollback();
      throw new Error('ID de reunião inválido');
    }
    
    // Find the meeting with its associated company
    const meeting = await Meeting.findByPk(meetingId, {
      include: [
        {
          model: Company,
          attributes: ['id', 'assignedUserId', 'pipelineStatus']
        }
      ]
    });
    
    if (!meeting) {
      await transaction.rollback();
      throw new Error('Reunião não encontrada');
    }

    // Fetch the current user's role
    const user = await User.findByPk(userId);

    if (!user) {
      await transaction.rollback();
      throw new Error('Usuário não encontrado');
    }

    // FIXED: More permissive permission system
    // Check if user has permission to delete
    const isAdmin = user.role === 'ADM' || user.role === 'Supervisor';
    const isCompanyOwner = meeting.Company && meeting.Company.assignedUserId === userId;
    const isMeetingOwner = meeting.ownerUserId === userId;
    
    // Allow if user is admin, company owner, or meeting creator
    if (!isAdmin && !isCompanyOwner && !isMeetingOwner) {
      console.log('Permission denied for meeting deletion:', { 
        isAdmin, isCompanyOwner, isMeetingOwner,
        userId, 
        meetingOwner: meeting.ownerUserId,
        companyOwner: meeting.Company?.assignedUserId
      });
      
      await transaction.rollback();
      throw new Error('Você não tem permissão para excluir esta reunião');
    }

    // FIXED: Create history record before deletion with all required fields
    await PipelineHistory.create({
      companyId: meeting.companyId,
      previousStatus: meeting.Company.pipelineStatus, // Use current company status
      newStatus: meeting.Company.pipelineStatus, // Same status as we're not changing pipeline state
      observations: `Reunião "${meeting.title}" excluída`,
      changeDate: new Date(),
      userId: userId
    }, { transaction });

    // Destroy the meeting
    await meeting.destroy({ transaction });
    
    await transaction.commit();
    
    return true;
  } catch (error) {
    await transaction.rollback();
    console.error('Meeting Delete Service Error:', error);
    throw error;
  }
};

// Get meetings by date range
exports.getMeetingsByDateRange = async (startDate, endDate) => {
  try {
    console.log('Fetching meetings with date range:', { startDate, endDate });
    
    // Handle potential invalid date strings
    let startDateTime, endDateTime;
    
    try {
      // Ensure we have valid date objects with proper time components
      startDateTime = new Date(startDate);
      startDateTime.setHours(0, 0, 0, 0);
      
      endDateTime = new Date(endDate);
      endDateTime.setHours(23, 59, 59, 999);
      
      // Validate the dates are actually valid
      if (isNaN(startDateTime.getTime()) || isNaN(endDateTime.getTime())) {
        throw new Error('Invalid date format');
      }
    } catch (error) {
      console.error('Date parsing error:', error);
      // Fallback to current month if dates are invalid
      const currentDate = new Date();
      startDateTime = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      endDateTime = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0, 23, 59, 59, 999);
    }
    
    console.log('Parsed date range:', { 
      startDateTime: startDateTime.toISOString(), 
      endDateTime: endDateTime.toISOString() 
    });
    
    return await Meeting.findAll({
      where: {
        startTime: {
          [Op.between]: [startDateTime, endDateTime]
        }
      },
      include: [
        {
          model: Company,
          attributes: ['id', 'name', 'contactName', 'email']
        }
      ],
      order: [['startTime', 'ASC']]
    });
  } catch (error) {
    console.error('Error fetching meetings by date range:', error);
    // Return empty array instead of throwing to prevent 500 errors
    return [];
  }
};

// Get meetings for a company
exports.getCompanyMeetings = async (companyId) => {
  return await Meeting.findAll({
    where: { companyId },
    order: [['startTime', 'DESC']]
  });
};