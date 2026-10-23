import React, { useState, useEffect } from 'react';
import api from '../services/api';
import MovieCard from '../components/MovieCard';
import LoadingSpinner from '../components/LoadingSpinner';

const MoviesPage = () => {
  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filter States
  const [search, setSearch] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [sortBy, setSortBy] = useState('rating');

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const { data } = await api.get('/movies/meta/genres');
        if (data.success) {
          setGenres(['All', ...data.data]);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchGenres();
  }, []);

  useEffect(() => {
    const fetchFilteredMovies = async () => {
      setLoading(true);
      try {
        const params = {
          search: search || undefined,
          genre: selectedGenre !== 'All' ? selectedGenre : undefined,
          status: selectedStatus !== 'All' ? selectedStatus : undefined,
          sort: sortBy,
        };
        const { data } = await api.get('/movies', { params });
        if (data.success) {
          setMovies(data.data);
        }
      } catch (err) {
        console.error('Error fetching movies:', err);
      } finally {
        setLoading(false);
      }
    };

    const delayDebounce = setTimeout(() => {
      fetchFilteredMovies();
    }, 250);

    return () => clearTimeout(delayDebounce);
  }, [search, selectedGenre, selectedStatus, sortBy]);

  return (
    <div className="container py-4">
      {/* Title */}
      <div className="mb-4">
        <h1 className="fw-bold text-white brand-font">Browse All Movies</h1>
        <p className="text-secondary small">Filter by genre, status, and sort to find your next cinema adventure.</p>
      </div>

      {/* Filter Toolbar */}
      <div className="glass-panel mb-4 p-3">
        <div className="row g-3 align-items-center">
          {/* Search */}
          <div className="col-lg-4 col-md-6">
            <div className="input-group">
              <span className="input-group-text bg-dark border-secondary text-secondary">
                <i className="bi bi-search"></i>
              </span>
              <input
                type="text"
                className="form-control bg-dark text-white border-secondary"
                placeholder="Search movies, cast, director..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              {search && (
                <button
                  className="btn btn-outline-secondary"
                  type="button"
                  onClick={() => setSearch('')}
                >
                  <i className="bi bi-x"></i>
                </button>
              )}
            </div>
          </div>

          {/* Genre select */}
          <div className="col-lg-3 col-md-6">
            <div className="d-flex align-items-center gap-2">
              <label className="text-secondary small text-nowrap">Genre:</label>
              <select
                className="form-select bg-dark text-white border-secondary form-select-sm"
                value={selectedGenre}
                onChange={(e) => setSelectedGenre(e.target.value)}
              >
                {genres.map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Status select */}
          <div className="col-lg-3 col-md-6">
            <div className="d-flex align-items-center gap-2">
              <label className="text-secondary small text-nowrap">Status:</label>
              <select
                className="form-select bg-dark text-white border-secondary form-select-sm"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                <option value="All">All Releases</option>
                <option value="Now Showing">Now Showing</option>
                <option value="Coming Soon">Coming Soon</option>
              </select>
            </div>
          </div>

          {/* Sort By */}
          <div className="col-lg-2 col-md-6">
            <div className="d-flex align-items-center gap-2">
              <label className="text-secondary small text-nowrap">Sort:</label>
              <select
                className="form-select bg-dark text-white border-secondary form-select-sm"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="rating">Top Rated</option>
                <option value="title">Title (A-Z)</option>
                <option value="duration">Duration</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Results Header */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <span className="text-secondary small">
          Showing <strong className="text-white">{movies.length}</strong> movies
        </span>
        {(search || selectedGenre !== 'All' || selectedStatus !== 'All') && (
          <button
            className="btn btn-sm btn-link text-danger text-decoration-none p-0"
            onClick={() => {
              setSearch('');
              setSelectedGenre('All');
              setSelectedStatus('All');
            }}
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* Movies Grid */}
      {loading ? (
        <LoadingSpinner text="Searching movies..." />
      ) : movies.length > 0 ? (
        <div className="row g-4">
          {movies.map((movie) => (
            <div key={movie._id} className="col-xl-3 col-lg-4 col-md-6 col-sm-6">
              <MovieCard movie={movie} />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-5 glass-panel">
          <i className="bi bi-camera-reels text-secondary display-3 mb-3 d-block"></i>
          <h4 className="text-white fw-bold">No movies found</h4>
          <p className="text-secondary small">Try adjusting your search criteria or genre filters.</p>
          <button
            className="btn btn-cinema btn-sm mt-2"
            onClick={() => {
              setSearch('');
              setSelectedGenre('All');
              setSelectedStatus('All');
            }}
          >
            Reset All Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default MoviesPage;
