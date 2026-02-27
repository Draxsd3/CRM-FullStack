const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
require('dotenv').config();

const User = require('../models/User');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/crm_leads';
const jwtSecret = process.env.JWT_SECRET || 'your_super_secure_and_consistent_secret_key_for_crm_leads';

async function generateTokensFromDB() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const users = await User.find().select('-password');

    if (users.length === 0) {
      console.log('No users found. Run "node database/seed.js" first.');
      process.exit(1);
    }

    console.log('\n🔑 TOKENS FOR LOCAL DEVELOPMENT 🔑\n');

    for (const user of users) {
      const token = jwt.sign(
        { id: user._id, email: user.email, role: user.role },
        jwtSecret,
        { expiresIn: '24h', algorithm: 'HS256', issuer: 'CRMLeads' }
      );

      console.log(`--- TOKEN FOR ${user.role} (${user.name}) ---`);
      console.log(`User ID: ${user._id}`);
      console.log(`Email: ${user.email}`);
      console.log(`\nBearer Token:\n${token}\n`);
      console.log('----------------------------\n');
    }

    console.log('USAGE:');
    console.log('  localStorage.setItem("token", "COPIED_TOKEN_HERE")');
    console.log('  Then reload the page.\n');

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

generateTokensFromDB();
