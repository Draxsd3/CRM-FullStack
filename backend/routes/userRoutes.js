const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const userController = require('../controllers/userController');
const auth = require('../middlewares/auth');
const roleAuth = require('../middlewares/roleAuth');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const uploadsDir = path.resolve(__dirname, '..', 'uploads');

// Ensure upload directory exists as soon as route module is loaded
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const fileExt = path.extname(file.originalname);
    cb(null, 'profile-' + uniqueSuffix + fileExt);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Apenas imagens são permitidas'));
    }
  },
});

const validateUser = [
  body('name').notEmpty().withMessage('Nome é obrigatório'),
  body('email').isEmail().withMessage('E-mail inválido'),
  body('password').isLength({ min: 6 }).withMessage('Senha deve ter no mínimo 6 caracteres'),
];

router.post('/login', userController.login);
router.get('/me', auth, userController.getCurrentUser);
router.put('/profile', auth, upload.single('profilePhoto'), userController.updateProfile);
router.get('/', auth, userController.getAllUsers);
router.post('/', auth, roleAuth(['ADM']), validateUser, userController.createUser);
router.put('/:id', auth, roleAuth(['ADM']), validateUser, userController.updateUser);
router.delete('/:id', auth, roleAuth(['ADM']), userController.deleteUser);

module.exports = router;
