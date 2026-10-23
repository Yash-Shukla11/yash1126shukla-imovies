const mongoose = require('mongoose');

const theatreSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Theatre name is required'],
    trim: true,
  },
  location: {
    address: { type: String, default: '' },
    city: { type: String, required: true, index: true },
    state: { type: String, default: '' },
    zipCode: { type: String, default: '' },
  },
  screens: [
    {
      screenNumber: { type: String, required: true },
      screenType: { type: String, enum: ['2D', '3D', 'IMAX 3D', '4DX', 'Dolby Atmos'], default: '2D' },
      totalCapacity: { type: Number, default: 60 },
    },
  ],
  amenities: {
    type: [String],
    default: ['Parking', 'Food Court', 'Recliner Seats', 'Dolby Atmos', 'Wheelchair Accessible'],
  },
  contactNumber: {
    type: String,
    default: '',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

theatreSchema.index({ name: 1, 'location.city': 1 });

module.exports = mongoose.models.Theatre || mongoose.model('Theatre', theatreSchema);
