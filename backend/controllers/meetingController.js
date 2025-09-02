const meetingService = require('../services/meetingService');
const { validationResult } = require('express-validator');

// Get all meetings
exports.getAllMeetings = async (req, res, next) => {
  try {
    const meetings = await meetingService.getAllMeetings();
    res.status(200).json({ success: true, data: meetings });
  } catch (error) {
    next(error);
  }
};

// Get meeting by ID
exports.getMeetingById = async (req, res, next) => {
  try {
    const meeting = await meetingService.getMeetingById(req.params.id);
    if (!meeting) {
      return res.status(404).json({ success: false, error: 'Reunião não encontrada' });
    }
    res.status(200).json({ success: true, data: meeting });
  } catch (error) {
    next(error);
  }
};

// Create meeting
exports.createMeeting = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    
    // FIXED: Add the current user ID as ownerUserId
    const meetingData = {
      ...req.body,
      ownerUserId: req.user.id // Set current user as meeting owner
    };
    
    const meeting = await meetingService.createMeeting(meetingData);
    res.status(201).json({ success: true, data: meeting });
  } catch (error) {
    next(error);
  }
};

// Update meeting
exports.updateMeeting = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        errors: errors.array() 
      });
    }
    
    const { id } = req.params;
    const userId = req.user.id; // Get current user's ID from authenticated request
    
    // FIXED: Parse ID as number and validate
    const meetingId = parseInt(id, 10);
    if (isNaN(meetingId) || meetingId <= 0) {
      return res.status(400).json({
        success: false,
        error: 'ID de reunião inválido'
      });
    }
    
    // Log the incoming update request for debugging
    console.log('Updating meeting:', { 
      id: meetingId, 
      data: req.body 
    });
    
    const meeting = await meetingService.updateMeeting(meetingId, req.body, userId);
    
    if (!meeting) {
      return res.status(404).json({ 
        success: false, 
        error: 'Reunião não encontrada ou você não tem permissão para editar' 
      });
    }
    
    res.status(200).json({ 
      success: true, 
      data: meeting 
    });
  } catch (error) {
    console.error('Meeting Update Controller Error:', error);
    
    if (error.message === 'Reunião não encontrada') {
      return res.status(404).json({ 
        success: false, 
        error: error.message 
      });
    }
    
    if (error.message.includes('permissão')) {
      return res.status(403).json({ 
        success: false, 
        error: error.message 
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Erro ao atualizar reunião: ' + error.message
    });
  }
};

// Delete meeting
exports.deleteMeeting = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // FIXED: Better ID validation
    // Ensure id is a valid numeric ID
    const meetingId = parseInt(id, 10);
    if (isNaN(meetingId) || meetingId <= 0) {
      console.error('Invalid meeting ID received:', id);
      return res.status(400).json({
        success: false,
        error: 'ID de reunião inválido'
      });
    }
    
    const userId = req.user.id;
    
    console.log('Attempting to delete meeting with ID:', { 
      meetingId, 
      userId,
      userRole: req.user.role
    });
    
    const result = await meetingService.deleteMeeting(meetingId, userId);
    
    res.status(200).json({ 
      success: true, 
      message: 'Reunião excluída com sucesso' 
    });
  } catch (error) {
    console.error('Meeting Delete Controller Error:', error.message);
    
    if (error.message === 'Reunião não encontrada') {
      return res.status(404).json({ 
        success: false, 
        error: error.message 
      });
    }
    
    if (error.message.includes('permissão')) {
      return res.status(403).json({ 
        success: false, 
        error: error.message 
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Erro ao excluir reunião: ' + error.message
    });
  }
};

// Get meetings by date range
exports.getMeetingsByDateRange = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;
    
    if (!startDate || !endDate) {
      return res.status(400).json({ 
        success: false, 
        error: 'Data inicial e final são obrigatórias' 
      });
    }
    
    const meetings = await meetingService.getMeetingsByDateRange(startDate, endDate);
    res.status(200).json({ success: true, data: meetings });
  } catch (error) {
    next(error);
  }
};

// Get company meetings
exports.getCompanyMeetings = async (req, res, next) => {
  try {
    const { companyId } = req.params;
    
    if (!companyId) {
      return res.status(400).json({
        success: false,
        error: 'ID da empresa é obrigatório'
      });
    }
    
    const meetings = await meetingService.getCompanyMeetings(companyId);
    res.status(200).json({ success: true, data: meetings });
  } catch (error) {
    next(error);
  }
};