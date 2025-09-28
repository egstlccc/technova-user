module.exports = (sequelize, DataTypes) => {
const Booking = sequelize.define('Booking', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4
  },
  passengerId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  driverId: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('requested', 'accepted', 'assigned', 'picked_up', 'completed', 'cancelled'),
    allowNull: false,
    defaultValue: 'requested'
  },
  vehicleType: {
    type: DataTypes.ENUM('mini', 'sedan', 'van'),
    allowNull: false
  },
  pickupLatitude: {
    type: DataTypes.DECIMAL(10, 6),
    allowNull: false
  },
  pickupLongitude: {
    type: DataTypes.DECIMAL(10, 6),
    allowNull: false
  },
  pickupAddress: {
    type: DataTypes.STRING,
    allowNull: true
  },
  dropoffLatitude: {
    type: DataTypes.DECIMAL(10, 6),
    allowNull: false
  },
  dropoffLongitude: {
    type: DataTypes.DECIMAL(10, 6),
    allowNull: false
  },
  dropoffAddress: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  tableName: 'bookings',
  timestamps: true
});

return Booking;
};

