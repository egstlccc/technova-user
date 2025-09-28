const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { canAcceptBookings } = require('../middleware/driverStatus');
const ctrl = require('../controllers/bookingController');

// Passenger creates booking request
router.post('/', auth(), ctrl.createRequest);

// Driver accepts booking
router.post('/:id/accept', auth(), canAcceptBookings, ctrl.accept);

module.exports = router;

