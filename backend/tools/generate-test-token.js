// Tool to generate a test JWT token for local development
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Function to generate a token for a test user
const generateTestToken = (userId = 1, role = 'ADM') => {
  // Make sure we have a JWT secret
  const jwtSecret = process.env.JWT_SECRET || 'your_super_secure_and_consistent_secret_key_for_securitizadora_crm';
  
  // Create a test user payload
  const userPayload = {
    id: userId,
    email: 'admin@goldcredit.com',
    role: role
  };
  
  // Generate the token with a 24-hour expiration
  const token = jwt.sign(
    userPayload, 
    jwtSecret,
    { 
      expiresIn: '24h',
      algorithm: 'HS256',
      issuer: 'SecuritizadoraCRM'
    }
  );
  
  return {
    token,
    userPayload,
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
  };
};

// Generate and display token for each user role
const generateAllRoleTokens = () => {
  const roles = ['ADM', 'Supervisor', 'SDR', 'Closer'];
  
  console.log('\n🔑 TEST TOKENS FOR LOCAL DEVELOPMENT 🔑\n');
  
  roles.forEach((role, index) => {
    const { token, userPayload, expires } = generateTestToken(index + 1, role);
    
    console.log(`--- TOKEN FOR ${role} ROLE ---`);
    console.log(`User: ID=${userPayload.id}, Role=${userPayload.role}`);
    console.log(`Expires: ${expires}`);
    console.log(`\nBearer Token (copy this):\n${token}\n`);
    console.log('----------------------------\n');
  });
  
  console.log('HOW TO USE:');
  console.log('1. Copy the token for your desired role');
  console.log('2. In Postman/Insomnia, add header: "Authorization: Bearer YOUR_TOKEN_HERE"');
  console.log('3. For browser testing, open Console and run:');
  console.log('   localStorage.setItem("token", "YOUR_TOKEN_HERE")');
  console.log('\n✅ Then reload the page\n');
};

// Run the generator
generateAllRoleTokens();

// Export for potential programmatic use
module.exports = { generateTestToken };

