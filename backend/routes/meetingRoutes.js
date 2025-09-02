const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const meetingController = require('../controllers/meetingController');
const auth = require('../middlewares/auth');

// Validação para reuniões
const validateMeeting = [
  body('title').notEmpty().withMessage('Título da reunião é obrigatório'),
  body('startTime').notEmpty().withMessage('Data e hora de início são obrigatórias'),
  body('endTime').notEmpty().withMessage('Data e hora de término são obrigatórias'),
  body('companyId').notEmpty().withMessage('ID da empresa é obrigatório')
];

// Aplicar middleware de autenticação em todas as rotas
router.use(auth);

// Rotas de reuniões com handlers verificados
router.get('/', meetingController.getAllMeetings);
router.get('/range', meetingController.getMeetingsByDateRange);
router.get('/company/:companyId', meetingController.getCompanyMeetings);
router.get('/:id', meetingController.getMeetingById);
router.post('/', validateMeeting, meetingController.createMeeting);
router.put('/:id', validateMeeting, meetingController.updateMeeting);
router.delete('/:id', meetingController.deleteMeeting);

module.exports = router;