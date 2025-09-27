const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const { models } = require('../models');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const ACCESS_TOKEN_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '15m';
const REFRESH_TOKEN_TTL_DAYS = Number(process.env.REFRESH_TOKEN_TTL_DAYS || 30);

function generateAccessToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRES_IN });
}

function verifyToken(token) {
  return jwt.verify(token, JWT_SECRET);
}

function generateRandomTokenString(bytes = 48) {
  return crypto.randomBytes(bytes).toString('hex');
}

async function hashToken(token) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(token, salt);
}

async function compareHashedToken(token, hashed) {
  return bcrypt.compare(token, hashed);
}

function addDays(date, days) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

async function issueRefreshToken({ userType, userId, metadata }) {
  const rawToken = generateRandomTokenString(32);
  const hashedToken = await hashToken(rawToken);
  const expiresAt = addDays(new Date(), REFRESH_TOKEN_TTL_DAYS);
  const row = await models.RefreshToken.create({ userType, userId, hashedToken, expiresAt, metadata: metadata || null });
  return { token: rawToken, record: row };
}

async function rotateRefreshToken({ token, userType, userId }) {
  // Find active token
  const rows = await models.RefreshToken.findAll({ where: { userType, userId, revokedAt: null } });
  let current = null;
  for (const r of rows) {
    if (await compareHashedToken(token, r.hashedToken)) { current = r; break; }
  }
  if (!current) return null;
  if (new Date(current.expiresAt) < new Date()) return null;

  // Revoke current and issue new
  const { token: newRaw, record: newRec } = await issueRefreshToken({ userType, userId });
  current.revokedAt = new Date();
  current.replacedByTokenId = newRec.id;
  await current.save();
  return { newToken: newRaw, newRecord: newRec };
}

module.exports = {
  generateAccessToken,
  verifyToken,
  issueRefreshToken,
  rotateRefreshToken,
};
