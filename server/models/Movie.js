const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Movie title is required'],
    trim: true,
  },
  tagline: {
    type: String,
    default: '',
  },
  description: {
    type: String,
    required: [true, 'Movie description is required'],
  },
  genre: {
    type: [String],
    required: true,
    default: ['Action'],
  },
  duration: {
    type: Number,
    required: [true, 'Duration in minutes is required'],
  },
  releaseDate: {
    type: Date,
    default: Date.now,
  },
  rating: {
    type: Number,
    default: 8.0,
    min: 0,
    max: 10,
  },
  votes: {
    type: Number,
    default: 1000,
  },
  certificate: {
    type: String,
    default: 'UA',
  },
  language: {
    type: String,
    default: 'English',
  },
  director: {
    type: String,
    default: '',
  },
  cast: {
    type: [String],
    default: [],
  },
  posterUrl: {
    type: String,
    required: [true, 'Poster URL is required'],
  },
  bannerUrl: {
    type: String,
    default: '',
  },
  trailerUrl: {
    type: String,
    default: '',
  },
  status: {
    type: String,
    enum: ['Now Showing', 'Coming Soon'],
    default: 'Now Showing',
  },
  basePrice: {
    type: Number,
    default: 250,
  },
  featured: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.models.Movie || mongoose.model('Movie', movieSchema);
