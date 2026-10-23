const store = require('../data/store');

// @desc    Get all movies with filters & search
// @route   GET /api/movies
// @access  Public
exports.getAllMovies = async (req, res, next) => {
  try {
    const { search, genre, status, sort, language } = req.query;
    const movies = await store.getMovies({ search, genre, status, sort, language });

    res.status(200).json({
      success: true,
      count: movies.length,
      data: movies,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single movie by ID
// @route   GET /api/movies/:id
// @access  Public
exports.getMovieById = async (req, res, next) => {
  try {
    const movie = await store.getMovieById(req.params.id);
    if (!movie) {
      return res.status(404).json({
        success: false,
        message: 'Movie not found',
      });
    }

    // Also get upcoming showtimes for this movie
    const showtimes = await store.getShowtimes({ movie: movie._id });

    res.status(200).json({
      success: true,
      data: {
        ...movie,
        showtimes,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new movie
// @route   POST /api/movies
// @access  Private/Admin
exports.createMovie = async (req, res, next) => {
  try {
    const { title, description, genre, duration, posterUrl } = req.body;
    if (!title || !description || !genre || !duration || !posterUrl) {
      return res.status(400).json({
        success: false,
        message: 'Title, description, genre, duration, and posterUrl are required',
      });
    }

    const movie = await store.createMovie(req.body);
    res.status(201).json({
      success: true,
      data: movie,
      message: 'Movie added successfully!',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update movie
// @route   PUT /api/movies/:id
// @access  Private/Admin
exports.updateMovie = async (req, res, next) => {
  try {
    const updated = await store.updateMovie(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({
        success: false,
        message: 'Movie not found',
      });
    }

    res.status(200).json({
      success: true,
      data: updated,
      message: 'Movie updated successfully!',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete movie
// @route   DELETE /api/movies/:id
// @access  Private/Admin
exports.deleteMovie = async (req, res, next) => {
  try {
    const deleted = await store.deleteMovie(req.params.id);
    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Movie not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Movie deleted successfully!',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get genres list
// @route   GET /api/movies/meta/genres
// @access  Public
exports.getGenres = async (req, res, next) => {
  try {
    const movies = await store.getMovies({});
    const genreSet = new Set();
    movies.forEach((m) => {
      if (Array.isArray(m.genre)) {
        m.genre.forEach((g) => genreSet.add(g));
      }
    });

    res.status(200).json({
      success: true,
      data: Array.from(genreSet).sort(),
    });
  } catch (error) {
    next(error);
  }
};
