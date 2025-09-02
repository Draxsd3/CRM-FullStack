const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const sequelize = require('./config/database');

// Import models to ensure they're loaded
const User = require('./models/User');
const Company = require('./models/Company');
const Meeting = require('./models/Meeting');
const PipelineHistory = require('./models/PipelineHistory');
const KYCReport = require('./models/KYCReport');

// Import routes
const companyRoutes = require('./routes/companyRoutes');
const meetingRoutes = require('./routes/meetingRoutes');
const pipelineRoutes = require('./routes/pipelineRoutes');
const reportRoutes = require('./routes/reportRoutes');
const userRoutes = require('./routes/userRoutes');

// Load environment variables
dotenv.config();

const app = express();

// Middlewares
/* @tweakable CORS configuration */
const corsOptions = {
  /** 
   * @tweakable Allow specific origins
   * Comma-separated list of allowed origins 
   */
  origin: process.env.ALLOWED_ORIGINS || '*', 

  /** 
   * @tweakable Maximum age of CORS preflight request cache 
   */
  maxAge: process.env.CORS_MAX_AGE || 86400,

  /** 
   * @tweakable Allowed HTTP methods 
   */
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
};

app.use(cors(corsOptions));

// Security middleware
app.use(helmet());

// Logging middleware
app.use(morgan('dev'));

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ---- FIX: Prefix all API routes with '/api' only, NOT '/' ----
// All frontend calls are made to '/api/companies', etc.

// These are correct:
app.use('/api/companies', companyRoutes);
app.use('/api/meetings', meetingRoutes);
app.use('/api/pipeline', pipelineRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/users', userRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'API is running' });
});

// Serve static files from frontend build in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '..', 'frontend', 'build')));
}

// ---- FIX: API 404 handler should come BEFORE React SPA fallback ----
app.use('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Rota da API não encontrada'
  });
});

// ---- FIX: React SPA fallback - serve index.html for all non-API routes ----
app.get('*', (req, res) => {
  if (process.env.NODE_ENV === 'production') {
    res.sendFile(path.join(__dirname, '..', 'frontend', 'build', 'index.html'));
  } else {
    // In development, let Create React App handle routing
    res.status(404).json({
      success: false,
      error: 'Esta é uma aplicação SPA. Use http://localhost:3000 para desenvolvimento.'
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  /* @tweakable Error logging configuration */
  const logErrorDetails = process.env.NODE_ENV === 'development';

  console.error('Global Error Handler:', err);
  res.status(err.statusCode || 500).json({
    success: false,
    error: err.message || 'Erro interno do servidor',
    ...(logErrorDetails && { stack: err.stack })
  });
});

// 404 handler for undefined routes
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    error: 'Rota não encontrada'
  });
});

// Database connection and server start
/** @tweakable Server port */
const PORT = process.env.PORT || 3001;

// Improved database connection method with better error handling
const startServer = async () => {
  try {
    // Test database connection
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');
    
    // Use force: false and alter: false to prevent problematic table modifications
    /** @tweakable Database synchronization strategy */
    const syncOptions = {
      /* 
       * @tweakable Synchronization behavior
       * - false: No changes to database structure
       * - true: Create tables if they don't exist
       * - 'alter': Alter existing tables to match model
       */
      force: false, // Never drop tables
      alter: false, // Don't alter existing tables to prevent datetime issues
      /** @tweakable Whether to log SQL statements */
      logging: false // Disable to reduce noise
    };
    
    await sequelize.sync(syncOptions);
    
    console.log('Database models synchronized successfully.');
    
    // Start the server
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    process.exit(1);
  }
};

startServer();