const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key';
const ACCESS_TOKEN_EXPIRES_IN = process.env.ACCESS_TOKEN_EXPIRES_IN || '15m';
const REFRESH_TOKEN_EXPIRES_IN = process.env.REFRESH_TOKEN_EXPIRES_IN || '7d';

/**
 * Generate JWT token for user
 * @param {Object} payload - User data to include in token
 * @param {string} secret - Secret key for signing
 * @param {string} expiresIn - Token expiration time
 * @returns {string} JWT token
 */
function generateToken(payload, secret = JWT_SECRET, expiresIn = ACCESS_TOKEN_EXPIRES_IN) {
  return jwt.sign(payload, secret, { expiresIn });
}

/**
 * Verify JWT token
 * @param {string} token - JWT token to verify
 * @param {string} secret - Secret key for verification
 * @returns {Object} Decoded token payload
 */
function verifyToken(token, secret = JWT_SECRET) {
  return jwt.verify(token, secret);
}

/**
 * Generate access and refresh token pair
 * @param {Object} payload - User data to include in tokens
 * @returns {Object} Object containing accessToken and refreshToken
 */
function generateTokenPair(payload) {
  const accessToken = generateToken(payload, JWT_SECRET, ACCESS_TOKEN_EXPIRES_IN);
  const refreshToken = generateToken(payload, JWT_REFRESH_SECRET, REFRESH_TOKEN_EXPIRES_IN);
  
  return {
    accessToken,
    refreshToken
  };
}

/**
 * Generate token for phone-verified user
 * @param {Object} user - User object with id and phone
 * @returns {string} JWT token
 */
function generateUserToken(user) {
  return generateToken({
    id: user.id,
    phone: user.phone,
    type: 'user',
    verified: true
  });
}

/**
 * Generate secure refresh token (random string)
 * @returns {string} Random refresh token
 */
function generateSecureRefreshToken() {
  return crypto.randomBytes(32).toString('hex');
}

module.exports = {
  generateToken,
  verifyToken,
  generateTokenPair,
  generateUserToken,
  generateSecureRefreshToken
};
