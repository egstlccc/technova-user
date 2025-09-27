const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/authController');
const rateLimit = require('../middleware/rateLimit');
const pwd = require('../controllers/passwordController');

router.post('/passenger/register', rateLimit({ windowMs: 60_000, max: 10 }), ctrl.registerPassenger);
router.post('/passenger/login', rateLimit({ windowMs: 60_000, max: 20 }), ctrl.loginPassenger);

router.post('/driver/register', rateLimit({ windowMs: 60_000, max: 10 }), ctrl.registerDriver);
router.post('/driver/login', rateLimit({ windowMs: 60_000, max: 20 }), ctrl.loginDriver);
router.post('/driver/send-otp', rateLimit({ windowMs: 60_000, max: 10 }), ctrl.sendDriverOtp);
router.post('/driver/verify-otp', rateLimit({ windowMs: 60_000, max: 20 }), ctrl.verifyDriverOtp);

// Password reset via OTP
router.post('/passenger/password/reset/request', rateLimit({ windowMs: 60_000, max: 5 }), pwd.requestPassengerPasswordReset);
router.post('/passenger/password/reset/verify', rateLimit({ windowMs: 60_000, max: 10 }), pwd.verifyPassengerPasswordReset);
router.post('/driver/password/reset/request', rateLimit({ windowMs: 60_000, max: 5 }), pwd.requestDriverPasswordReset);
router.post('/driver/password/reset/verify', rateLimit({ windowMs: 60_000, max: 10 }), pwd.verifyDriverPasswordReset);

router.post('/staff/login', rateLimit({ windowMs: 60_000, max: 20 }), ctrl.loginStaff);

router.post('/admin/register', rateLimit({ windowMs: 60_000, max: 10 }), ctrl.registerAdmin);
router.post('/admin/login', rateLimit({ windowMs: 60_000, max: 20 }), ctrl.loginAdmin);

module.exports = router;
