const express = require('express');
const router = express.Router();
const { getDashboardStats, getAllBookings } = require('../controllers/adminController');
const { protect, admin } = require('../middleware/auth');

router.use(protect);
router.use(admin);

router.get('/stats', getDashboardStats);
router.get('/bookings', getAllBookings);

module.exports = router;
