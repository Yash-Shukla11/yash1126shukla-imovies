const express = require('express');
const router = express.Router();
const {
  getShowtimes,
  getShowtimeById,
  createShowtime,
  deleteShowtime,
} = require('../controllers/showtimeController');
const { protect, admin } = require('../middleware/auth');

router.get('/', getShowtimes);
router.get('/:id', getShowtimeById);

// Admin routes
router.post('/', protect, admin, createShowtime);
router.delete('/:id', protect, admin, deleteShowtime);

module.exports = router;
