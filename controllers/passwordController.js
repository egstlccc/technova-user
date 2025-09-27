const { models } = require('../models');
const { hashPassword, comparePassword } = require('../utils/password');
const createAdvancedOtpUtil = require('../utils/createAdvancedOtpUtil');

const otpUtil = createAdvancedOtpUtil({
  token: process.env.GEEZSMS_TOKEN,
  otpLength: 6,
  otpExpirationSeconds: 300,
  maxAttempts: 3,
  lockoutSeconds: 1800,
});

function normalizePhone(phone) {
  const clean = String(phone || '').replace(/\D/g, '');
  if (clean.startsWith('09') || clean.startsWith('07')) return '+251' + clean.substring(1);
  if (clean.startsWith('251')) return '+' + clean;
  if (String(phone).startsWith('+251')) return String(phone);
  return phone;
}

// Passenger: request password reset (via OTP to phone)
exports.requestPassengerPasswordReset = async (req, res) => {
  try {
    const { phone } = req.body || {};
    if (!phone) return res.status(400).json({ message: 'phone is required' });
    const normalizedPhone = normalizePhone(phone);
    const passenger = await models.Passenger.findOne({ where: { phone: normalizedPhone } });
    if (!passenger) return res.status(404).json({ message: 'Passenger not found' });
    const resp = await otpUtil.generateAndSendOtp({ referenceType: 'Passenger', referenceId: passenger.id, phoneNumber: normalizedPhone });
    return res.status(200).json({ message: 'OTP sent', phoneNumber: normalizedPhone, expiresIn: resp.expiresIn });
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
};

// Passenger: verify reset OTP and set new password
exports.verifyPassengerPasswordReset = async (req, res) => {
  try {
    const { phone, otp, newPassword } = req.body || {};
    if (!phone || !otp || !newPassword) return res.status(400).json({ message: 'phone, otp and newPassword are required' });
    const normalizedPhone = normalizePhone(phone);
    const passenger = await models.Passenger.unscoped().findOne({ where: { phone: normalizedPhone } });
    if (!passenger) return res.status(404).json({ message: 'Passenger not found' });
    await otpUtil.verifyOtp({ referenceType: 'Passenger', referenceId: passenger.id, token: otp, phoneNumber: normalizedPhone });
    const hashed = await hashPassword(newPassword);
    await models.Passenger.update({ password: hashed }, { where: { id: passenger.id } });
    return res.status(200).json({ message: 'Password updated successfully' });
  } catch (e) {
    const msg = e?.message || 'Verification failed';
    const code = /expired|Invalid|No valid|locked/i.test(msg) ? 400 : 500;
    return res.status(code).json({ message: msg });
  }
};

// Driver: request password reset
exports.requestDriverPasswordReset = async (req, res) => {
  try {
    const { phone } = req.body || {};
    if (!phone) return res.status(400).json({ message: 'phone is required' });
    const normalizedPhone = normalizePhone(phone);
    const driver = await models.Driver.findOne({ where: { phone: normalizedPhone } });
    if (!driver) return res.status(404).json({ message: 'Driver not found' });
    const resp = await otpUtil.generateAndSendOtp({ referenceType: 'Driver', referenceId: driver.id, phoneNumber: normalizedPhone });
    return res.status(200).json({ message: 'OTP sent', phoneNumber: normalizedPhone, expiresIn: resp.expiresIn });
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
};

// Driver: verify reset OTP and set new password
exports.verifyDriverPasswordReset = async (req, res) => {
  try {
    const { phone, otp, newPassword } = req.body || {};
    if (!phone || !otp || !newPassword) return res.status(400).json({ message: 'phone, otp and newPassword are required' });
    const normalizedPhone = normalizePhone(phone);
    const driver = await models.Driver.unscoped().findOne({ where: { phone: normalizedPhone } });
    if (!driver) return res.status(404).json({ message: 'Driver not found' });
    await otpUtil.verifyOtp({ referenceType: 'Driver', referenceId: driver.id, token: otp, phoneNumber: normalizedPhone });
    const hashed = await hashPassword(newPassword);
    await models.Driver.update({ password: hashed }, { where: { id: driver.id } });
    return res.status(200).json({ message: 'Password updated successfully' });
  } catch (e) {
    const msg = e?.message || 'Verification failed';
    const code = /expired|Invalid|No valid|locked/i.test(msg) ? 400 : 500;
    return res.status(code).json({ message: msg });
  }
};

