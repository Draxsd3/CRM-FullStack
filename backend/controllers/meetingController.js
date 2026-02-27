const meetingService = require('../services/meetingService');
const { validationResult } = require('express-validator');
const mongoose = require('mongoose');

exports.getAllMeetings = async (req, res, next) => {
  try {
    const meetings = await meetingService.getAllMeetings();
    res.status(200).json({ success: true, data: meetings });
  } catch (error) {
    next(error);
  }
};

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

exports.createMeeting = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const meetingData = { ...req.body, ownerUserId: req.user.id };
    const meeting = await meetingService.createMeeting(meetingData);
    res.status(201).json({ success: true, data: meeting });
  } catch (error) {
    next(error);
  }
};

exports.updateMeeting = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { id } = req.params;
    const userId = req.user.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, error: 'ID de reunião inválido' });
    }

    const meeting = await meetingService.updateMeeting(id, req.body, userId);

    if (!meeting) {
      return res.status(404).json({ success: false, error: 'Reunião não encontrada ou você não tem permissão para editar' });
    }

    res.status(200).json({ success: true, data: meeting });
  } catch (error) {
    console.error('Meeting Update Controller Error:', error);

    if (error.message === 'Reunião não encontrada') {
      return res.status(404).json({ success: false, error: error.message });
    }
    if (error.message.includes('permissão')) {
      return res.status(403).json({ success: false, error: error.message });
    }

    res.status(500).json({ success: false, error: 'Erro ao atualizar reunião: ' + error.message });
  }
};

exports.deleteMeeting = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, error: 'ID de reunião inválido' });
    }

    await meetingService.deleteMeeting(id, req.user.id);
    res.status(200).json({ success: true, message: 'Reunião excluída com sucesso' });
  } catch (error) {
    console.error('Meeting Delete Controller Error:', error.message);

    if (error.message === 'Reunião não encontrada') {
      return res.status(404).json({ success: false, error: error.message });
    }
    if (error.message.includes('permissão')) {
      return res.status(403).json({ success: false, error: error.message });
    }

    res.status(500).json({ success: false, error: 'Erro ao excluir reunião: ' + error.message });
  }
};

exports.getMeetingsByDateRange = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;
    if (!startDate || !endDate) {
      return res.status(400).json({ success: false, error: 'Data inicial e final são obrigatórias' });
    }
    const meetings = await meetingService.getMeetingsByDateRange(startDate, endDate);
    res.status(200).json({ success: true, data: meetings });
  } catch (error) {
    next(error);
  }
};

exports.getCompanyMeetings = async (req, res, next) => {
  try {
    const { companyId } = req.params;
    if (!companyId) {
      return res.status(400).json({ success: false, error: 'ID da empresa é obrigatório' });
    }
    const meetings = await meetingService.getCompanyMeetings(companyId);
    res.status(200).json({ success: true, data: meetings });
  } catch (error) {
    next(error);
  }
};
