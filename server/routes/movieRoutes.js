const express = require('express');
const router = express.Router();
const {
  getAllMovies,
  getMovieById,
  createMovie,
  updateMovie,
  deleteMovie,
  getGenres,
} = require('../controllers/movieController');
const { protect, admin } = require('../middleware/auth');

router.get('/meta/genres', getGenres);
router.get('/', getAllMovies);
router.get('/:id', getMovieById);

// Admin-protected movie management routes
router.post('/', protect, admin, createMovie);
router.put('/:id', protect, admin, updateMovie);
router.delete('/:id', protect, admin, deleteMovie);

module.exports = router;
