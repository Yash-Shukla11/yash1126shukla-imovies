const store = require('../data/store');

// @desc    Get showtimes with filters
// @route   GET /api/showtimes
// @access  Public
exports.getShowtimes = async (req, res, next) => {
  try {
    const { movie, date, theater } = req.query;
    const showtimes = await store.getShowtimes({ movie, date, theater });

    res.status(200).json({
      success: true,
      count: showtimes.length,
      data: showtimes,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single showtime with seat matrix
// @route   GET /api/showtimes/:id
// @access  Public
exports.getShowtimeById = async (req, res, next) => {
  try {
    const showtime = await store.getShowtimeById(req.params.id);
    if (!showtime) {
      return res.status(404).json({
        success: false,
        message: 'Showtime not found',
      });
    }

    res.status(200).json({
      success: true,
      data: showtime,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new showtime
// @route   POST /api/showtimes
// @access  Private/Admin
exports.createShowtime = async (req, res, next) => {
  try {
    const { movie, theater, date, time } = req.body;
    if (!movie || !theater || !date || !time) {
      return res.status(400).json({
        success: false,
        message: 'Movie, theater, date, and time are required',
      });
    }

    const showtime = await store.createShowtime(req.body);
    res.status(201).json({
      success: true,
      data: showtime,
      message: 'Showtime created successfully!',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete showtime
// @route   DELETE /api/showtimes/:id
// @access  Private/Admin
exports.deleteShowtime = async (req, res, next) => {
  try {
    const deleted = await store.deleteShowtime(req.params.id);
    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Showtime not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Showtime deleted successfully!',
    });
  } catch (error) {
    next(error);
  }
};
