const { models } = require('../models');

exports.createRequest = async (req, res) => {
try {
if (req.user.type !== 'passenger') return res.status(403).json({ message: 'Only passengers can create bookings' });

const { id, bookingId, vehicleType, pickup, dropoff } = req.body || {};

if (!vehicleType || !['mini', 'sedan', 'van'].includes(vehicleType)) {
  return res.status(400).json({ message: 'Invalid vehicleType. Must be one of: mini, sedan, van' });
}
if (!pickup || pickup.latitude == null || pickup.longitude == null) {
  return res.status(400).json({ message: 'pickup with latitude and longitude is required' });
}
if (!dropoff || dropoff.latitude == null || dropoff.longitude == null) {
  return res.status(400).json({ message: 'dropoff with latitude and longitude is required' });
}

const booking = await models.Booking.create({
  id: id || bookingId, // support provided id
  passengerId: req.user.id,
  status: 'requested',
  vehicleType,
  pickupLatitude: pickup.latitude,
  pickupLongitude: pickup.longitude,
  pickupAddress: pickup.address || null,
  dropoffLatitude: dropoff.latitude,
  dropoffLongitude: dropoff.longitude,
  dropoffAddress: dropoff.address || null
});

return res.status(201).json({ success: true, booking });
} catch (e) { return res.status(500).json({ message: e.message }); }
};

exports.accept = async (req, res) => {
try {
if (req.user.type !== 'driver') return res.status(403).json({ message: 'Only drivers can accept bookings' });

const { id } = req.params;
const booking = await models.Booking.findByPk(id);
if (!booking) return res.status(404).json({ message: 'Booking not found' });

// Only requested bookings can be accepted
if (booking.status !== 'requested') {
  return res.status(409).json({ message: `Cannot accept booking in status '${booking.status}'` });
}

// Eligibility checks
const driver = await models.Driver.findByPk(req.user.id);
if (!driver) return res.status(404).json({ message: 'Driver not found' });
if (driver.status !== 'approved' && driver.documentStatus !== 'approved') {
  return res.status(403).json({ message: 'Driver not approved to accept bookings' });
}
if (driver.driverStatus !== 'active') {
  return res.status(403).json({ message: 'Driver status must be active to accept bookings' });
}
if (!driver.availability) {
  return res.status(403).json({ message: 'Driver is offline. Toggle availability to go online.' });
}

// Optional: match vehicle type
if (booking.vehicleType && driver.vehicleType && booking.vehicleType !== driver.vehicleType) {
  return res.status(403).json({ message: `This booking requires '${booking.vehicleType}' vehicle.` });
}

booking.status = 'accepted';
booking.driverId = driver.id;
await booking.save();

return res.json({ success: true, booking });
} catch (e) { return res.status(500).json({ message: e.message }); }
};

