const mongoose = require('mongoose');

const seatSchema = new mongoose.Schema({
  seatNumber: {
    type: String,
    required: true,
  },
  row: {
    type: String,
    required: true,
  },
  col: {
    type: Number,
    required: true,
  },
  tier: {
    type: String,
    enum: ['standard', 'premium', 'vip'],
    default: 'standard',
  },
  price: {
    type: Number,
    required: true,
  },
  isBooked: {
    type: Boolean,
    default: false,
  },
  bookedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
});

const showtimeSchema = new mongoose.Schema({
  movie: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Movie',
    required: true,
  },
  theater: {
    type: String,
    required: true,
  },
  screen: {
    type: String,
    default: 'Screen 1 (Dolby Atmos)',
  },
  city: {
    type: String,
    default: 'Mumbai',
  },
  date: {
    type: String, // Format: YYYY-MM-DD
    required: true,
  },
  time: {
    type: String, // e.g. "06:30 PM"
    required: true,
  },
  format: {
    type: String,
    enum: ['2D', '3D', 'IMAX 2D', 'IMAX 3D', '4DX'],
    default: '2D',
  },
  pricing: {
    standard: { type: Number, default: 220 },
    premium: { type: Number, default: 350 },
    vip: { type: Number, default: 550 },
  },
  seats: [seatSchema],
  totalSeats: {
    type: Number,
    default: 60,
  },
  availableSeats: {
    type: Number,
    default: 60,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.models.Showtime || mongoose.model('Showtime', showtimeSchema);
