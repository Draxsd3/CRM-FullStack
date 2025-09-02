// Tool to generate a JWT token WITHOUT expiration for development
const jwt = require('jsonwebtoken');
require('dotenv').config();

const jwtSecret = process.env.JWT_SECRET || 'your_super_secure_and_consistent_secret_key_for_securitizadora_crm';

/**
 * Generate a JWT token with NO expiration (eternal token)
 * @param {number} userId - The user ID to generate the token for
 * @param {string} role - The user role (ADM, SDR, Supervisor, Closer)
 */
function generateEternalToken(userId = 1, role = 'ADM') {
  // Build payload
  const userPayload = {
    id: userId,
    email: 'admin@goldcredit.com',
    role: role
  };

  // Generate token WITHOUT expiresIn
  const token = jwt.sign(
    userPayload,
    jwtSecret,
    {
      // Intentionally omit expiresIn for eternal token
      algorithm: 'HS256',
      issuer: 'SecuritizadoraCRM'
    }
  );

  return { token, userPayload };
}

function showEternalTokensForAllRoles() {
  const roles = ['ADM', 'Supervisor', 'SDR', 'Closer'];

  console.log('\n🔑 ETERNAL TOKENS FOR LOCAL DEVELOPMENT 🔑\n');
  roles.forEach((role, idx) => {
    const { token, userPayload } = generateEternalToken(idx + 1, role);
    console.log(`--- ETERNAL TOKEN FOR ${role} (User ID ${userPayload.id}) ---`);
    console.log(`User:`, userPayload);
    console.log(`\nBearer Token (never expires, dev only):\n${token}\n`);
    console.log('----------------------------\n');
  });
  console.log('USAGE:\n1. Copy a token above.\n2. In your browser dev console:');
  console.log('   localStorage.setItem("token", "COPIED_TOKEN_HERE")');
  console.log('Then reload the system.\n');
}

if (require.main === module) {
  showEternalTokensForAllRoles();
}

module.exports = { generateEternalToken };