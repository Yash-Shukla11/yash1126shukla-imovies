const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  booking: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
    required: true,
    index: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  transactionId: {
    type: String,
    required: true,
    unique: true,
  },
  paymentMethod: {
    type: String,
    enum: ['Card', 'UPI', 'NetBanking', 'Wallet'],
    default: 'Card',
  },
  amount: {
    type: Number,
    required: true,
  },
  currency: {
    type: String,
    default: 'INR',
  },
  paymentStatus: {
    type: String,
    enum: ['Success', 'Pending', 'Failed', 'Refunded'],
    default: 'Success',
    index: true,
  },
  gatewayResponse: {
    type: Object,
    default: {},
  },
  paidAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.models.Payment || mongoose.model('Payment', paymentSchema);
