const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const userController = require('../controllers/userController');
const auth = require('../middlewares/auth');
const roleAuth = require('../middlewares/roleAuth');
const multer = require('multer');
const path = require('path');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const fileExt = path.extname(file.originalname);
    cb(null, 'profile-' + uniqueSuffix + fileExt);
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Apenas imagens são permitidas'));
    }
  }
});

// Validation middleware
const validateUser = [
  body('name').notEmpty().withMessage('Nome é obrigatório'),
  body('email').isEmail().withMessage('E-mail inválido'),
  body('password').isLength({ min: 6 }).withMessage('Senha deve ter no mínimo 6 caracteres')
];

// Public routes
router.post('/login', userController.login);

// Add missing controller functions where implemented
router.get('/me', auth, userController.getCurrentUser);

// User profile update
router.put('/profile', auth, upload.single('profilePhoto'), userController.updateProfile);

// Admin-only routes for user management
router.get('/', auth, userController.getAllUsers);
router.post('/', auth, roleAuth(['ADM']), validateUser, userController.createUser);
router.put('/:id', auth, roleAuth(['ADM']), validateUser, userController.updateUser);
router.delete('/:id', auth, roleAuth(['ADM']), userController.deleteUser);

module.exports = router;