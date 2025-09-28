const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { canAcceptBookings } = require('../middleware/driverStatus');
const ctrl = require('../controllers/bookingController');

// Passenger creates booking request
router.post('/', auth(), ctrl.createRequest);

// Driver accepts booking
router.post('/:id/accept', auth(), canAcceptBookings, ctrl.accept);

// Cancel booking (passenger or assigned driver)
router.post('/:id/cancel', auth(), ctrl.cancel);

module.exports = router;

