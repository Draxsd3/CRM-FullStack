/**
 * Database setup utility.
 * Creates collections, synchronizes indexes and optionally executes seed.
 *
 * Usage:
 *   node database/setup-database.js
 *   node database/setup-database.js --seed
 */
const mongoose = require('mongoose');
require('dotenv').config();

const User = require('../models/User');
const Company = require('../models/Company');
const Meeting = require('../models/Meeting');
const PipelineHistory = require('../models/PipelineHistory');
const KYCReport = require('../models/KYCReport');
const { seedDatabase } = require('./seed');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/crm_leads';

async function ensureCollection(model) {
  const collectionName = model.collection.collectionName;
  try {
    await mongoose.connection.createCollection(collectionName);
    console.log(`Collection created: ${collectionName}`);
  } catch (error) {
    if (error && error.codeName === 'NamespaceExists') {
      console.log(`Collection already exists: ${collectionName}`);
      return;
    }
    throw error;
  }
}

async function setupDatabase() {
  const shouldSeed = process.argv.includes('--seed');
  await mongoose.connect(MONGODB_URI);
  console.log(`Connected to MongoDB at ${MONGODB_URI}`);

  const models = [User, Company, Meeting, PipelineHistory, KYCReport];

  for (const model of models) {
    await ensureCollection(model);
  }

  for (const model of models) {
    await model.syncIndexes();
    console.log(`Indexes synchronized: ${model.modelName}`);
  }

  if (shouldSeed) {
    console.log('Running seed...');
    await seedDatabase({ drop: false });
  }
}

setupDatabase()
  .then(async () => {
    await mongoose.disconnect();
    console.log('Database setup completed');
    process.exit(0);
  })
  .catch(async (error) => {
    console.error('Database setup error:', error);
    await mongoose.disconnect();
    process.exit(1);
  });
