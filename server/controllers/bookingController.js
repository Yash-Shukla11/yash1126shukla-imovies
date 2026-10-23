const store = require('../data/store');

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Private
exports.createBooking = async (req, res, next) => {
  try {
    const { showtimeId, seats, paymentMethod } = req.body;

    if (!showtimeId || !seats || !Array.isArray(seats) || seats.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide showtimeId and select at least one seat.',
      });
    }

    if (seats.length > 8) {
      return res.status(400).json({
        success: false,
        message: 'Maximum 8 seats can be booked in a single transaction.',
      });
    }

    const booking = await store.createBooking({
      userId: req.user._id,
      showtimeId,
      seats,
      paymentMethod: paymentMethod || 'Card',
    });

    res.status(201).json({
      success: true,
      data: booking,
      message: 'Booking confirmed! Enjoy your movie.',
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to process booking',
    });
  }
};

// @desc    Get bookings for logged in user
// @route   GET /api/bookings/my-bookings
// @access  Private
exports.getMyBookings = async (req, res, next) => {
  try {
    const bookings = await store.getBookingsByUser(req.user._id);

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single booking by ID or reference
// @route   GET /api/bookings/:id
// @access  Private
exports.getBookingById = async (req, res, next) => {
  try {
    const booking = await store.getBookingById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    // Authorization check: user can only view their own booking unless admin
    if (req.user.role !== 'admin' && booking.user !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this booking',
      });
    }

    res.status(200).json({
      success: true,
      data: booking,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel booking
// @route   PUT /api/bookings/:id/cancel
// @access  Private
exports.cancelBooking = async (req, res, next) => {
  try {
    const isAdmin = req.user.role === 'admin';
    const booking = await store.cancelBooking(req.params.id, req.user._id, isAdmin);

    res.status(200).json({
      success: true,
      data: booking,
      message: 'Booking cancelled successfully. Refund will be processed.',
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to cancel booking',
    });
  }
};
