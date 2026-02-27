const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');
const connectDB = require('./config/database');

// Load environment variables
dotenv.config();

// Import routes
const companyRoutes = require('./routes/companyRoutes');
const meetingRoutes = require('./routes/meetingRoutes');
const pipelineRoutes = require('./routes/pipelineRoutes');
const reportRoutes = require('./routes/reportRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();
const uploadsDir = path.join(__dirname, 'uploads');

// Ensure uploads dir exists on server startup
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// CORS
const corsOptions = {
  origin: process.env.ALLOWED_ORIGINS || '*',
  maxAge: process.env.CORS_MAX_AGE || 86400,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
};
app.use(cors(corsOptions));

// Security & logging
app.use(helmet());
app.use(morgan('dev'));

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files
app.use('/uploads', express.static(uploadsDir));

// API routes
app.use('/api/companies', companyRoutes);
app.use('/api/meetings', meetingRoutes);
app.use('/api/pipeline', pipelineRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/users', userRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'API is running (MongoDB)' });
});

// Serve frontend in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '..', 'frontend', 'build')));
}

// API 404
app.use('/api/*', (req, res) => {
  res.status(404).json({ success: false, error: 'Rota da API não encontrada' });
});

// SPA fallback
app.get('*', (req, res) => {
  if (process.env.NODE_ENV === 'production') {
    res.sendFile(path.join(__dirname, '..', 'frontend', 'build', 'index.html'));
  } else {
    res.status(404).json({
      success: false,
      error: 'Esta é uma aplicação SPA. Use http://localhost:3000 para desenvolvimento.',
    });
  }
});

// Error handler
app.use((err, req, res, next) => {
  const logErrorDetails = process.env.NODE_ENV === 'development';
  console.error('Global Error Handler:', err);
  res.status(err.statusCode || 500).json({
    success: false,
    error: err.message || 'Erro interno do servidor',
    ...(logErrorDetails && { stack: err.stack }),
  });
});

// Start server
const PORT = process.env.PORT || 3001;

const startServer = async () => {
  try {
    await connectDB();
    console.log('MongoDB connected successfully.');

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Unable to start server:', error);
    process.exit(1);
  }
};

startServer();
